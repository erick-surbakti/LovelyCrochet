/**
 * Privacy-friendly analytics events (Plausible custom events).
 * Elements opt in with data-track="<event>" plus optional
 * data-track-context / data-track-product. If analytics is disabled the
 * `plausible` function simply doesn't exist and nothing is sent.
 */
type Props = Record<string, string>;
type PlausibleFn = (event: string, options?: { props?: Props }) => void;

const EVENT_NAMES: Record<string, string> = {
  whatsapp: 'WhatsApp Click',
  marketplace: 'Marketplace Click',
  'custom-order-complete': 'Custom Order Completed',
  'pattern-download': 'Pattern Download',
  'newsletter-signup': 'Newsletter Signup',
};

export function track(event: string, props: Props = {}): void {
  const plausible = (window as unknown as { plausible?: PlausibleFn }).plausible;
  const name = EVENT_NAMES[event] ?? event;
  if (typeof plausible === 'function') plausible(name, { props });
}

let installed = false;

export function initTracking(): void {
  if (installed) return;
  installed = true;
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      const props: Props = { page: location.pathname };
      if (el.dataset.trackContext) props.context = el.dataset.trackContext;
      if (el.dataset.trackProduct) props.product = el.dataset.trackProduct;
      if (el.dataset.trackChannel) props.channel = el.dataset.trackChannel;
      track(el.dataset.track ?? 'click', props);
    },
    { capture: true },
  );
}
