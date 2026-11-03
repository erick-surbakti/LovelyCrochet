/**
 * Browsers without `animation-timeline: view()` (Firefox, older Safari) get
 * the yarn drawn by an IntersectionObserver instead. With reduced motion the
 * yarn simply stays fully drawn (handled in CSS, nothing to do here).
 */
let io: IntersectionObserver | undefined;

export function initYarnFallback(): void {
  if (CSS.supports('animation-timeline: view()')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  io?.disconnect();
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
          io?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -15% 0px' },
  );

  document.querySelectorAll<SVGElement>('.yarn-draw').forEach((el) => {
    el.classList.add('yarn-io');
    io?.observe(el);
  });
}
