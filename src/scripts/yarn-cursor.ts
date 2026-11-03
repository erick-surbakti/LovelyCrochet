/**
 * Yarn-ball cursor follower: a small ball of yarn that eases behind the
 * pointer, trailing a short thread. Desktop only (fine pointer + hover),
 * never with reduced motion, purely decorative (aria-hidden, no pointer
 * events), and the animation loop sleeps whenever the ball is at rest.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const TRAIL = 14;

class YarnCursor extends HTMLElement {
  private ball!: SVGGElement;
  private thread!: SVGPathElement;
  private target = { x: -100, y: -100 };
  private pos = { x: -100, y: -100 };
  private trail: { x: number; y: number }[] = [];
  private raf = 0;
  private spin = 0;

  connectedCallback(): void {
    this.setAttribute('aria-hidden', 'true');
    Object.assign(this.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '70',
    });
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    this.thread = document.createElementNS(SVG_NS, 'path');
    this.thread.setAttribute('fill', 'none');
    this.thread.setAttribute('stroke', '#C9776B');
    this.thread.setAttribute('stroke-width', '2');
    this.thread.setAttribute('stroke-linecap', 'round');
    this.thread.setAttribute('opacity', '.75');
    this.ball = document.createElementNS(SVG_NS, 'g');
    this.ball.innerHTML =
      '<circle r="9" fill="#C9776B"/><g fill="none" stroke="#FBF6EE" stroke-width="1.3" opacity=".8">' +
      '<path d="M-7 -3c4 2 10 2 14-1"/><path d="M-8 2c5 3 11 2 16-2"/><path d="M-3 -8c-2 5-2 11 1 16"/></g>';
    svg.append(this.thread, this.ball);
    this.append(svg);
    window.addEventListener('pointermove', this.onMove, { passive: true });
    document.addEventListener('pointerleave', this.onLeave);
  }

  disconnectedCallback(): void {
    window.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerleave', this.onLeave);
    cancelAnimationFrame(this.raf);
  }

  private onMove = (e: PointerEvent): void => {
    if (e.pointerType !== 'mouse') return;
    this.target = { x: e.clientX + 14, y: e.clientY + 18 };
    if (this.pos.x < -50) this.pos = { ...this.target };
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  };

  private onLeave = (): void => {
    this.target = { x: -100, y: -100 };
    this.pos = { x: -100, y: -100 };
    this.trail = [];
    this.render();
  };

  private tick = (): void => {
    const dx = this.target.x - this.pos.x;
    const dy = this.target.y - this.pos.y;
    this.pos.x += dx * 0.16;
    this.pos.y += dy * 0.16;
    this.spin += dx * 0.6;
    this.trail.unshift({ ...this.pos });
    if (this.trail.length > TRAIL) this.trail.pop();
    this.render();
    const resting = Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3;
    this.raf = resting ? 0 : requestAnimationFrame(this.tick);
  };

  private render(): void {
    this.ball.setAttribute('transform', `translate(${this.pos.x} ${this.pos.y}) rotate(${this.spin % 360})`);
    if (this.trail.length < 2) {
      this.thread.setAttribute('d', '');
      return;
    }
    const [first, ...rest] = this.trail;
    let d = `M${first!.x} ${first!.y}`;
    rest.forEach((p, i) => {
      const wobble = Math.sin(i * 1.3) * 2.5;
      d += ` L${p.x + wobble} ${p.y + 6 + i * 0.6}`;
    });
    this.thread.setAttribute('d', d);
  }
}

export function mountYarnCursor(): void {
  const ok =
    matchMedia('(pointer: fine) and (hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!ok) return;
  if (!customElements.get('yarn-cursor')) customElements.define('yarn-cursor', YarnCursor);
  if (!document.querySelector('yarn-cursor')) document.body.append(document.createElement('yarn-cursor'));
}
