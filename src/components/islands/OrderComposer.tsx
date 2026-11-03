/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { formatIDR } from '@/lib/format';
import { productMessage, waLink } from '@/lib/whatsapp';

interface Option {
  key: string;
  label: string;
  price?: number;
  hex?: string;
}

interface Props {
  locale: 'id' | 'en';
  productId: string;
  name: string;
  url: string;
  basePrice: number;
  variants: Option[];
  colors: Option[];
  giftWrap: boolean;
  personalisable: boolean;
}

const COPY = {
  id: {
    variant: 'Pilih varian',
    color: 'Pilih warna',
    qty: 'Jumlah',
    less: 'Kurangi jumlah',
    more: 'Tambah jumlah',
    gift: 'Bungkus kado + kartu ucapan (gratis)',
    note: 'Catatan atau personalisasi',
    notePh: 'Misal: sulam nama "Aira", kirim tanggal 20',
    total: 'Perkiraan total',
    excl: 'belum termasuk ongkir',
    cta: 'Pesan via WhatsApp',
    preview: 'Pratinjau pesan',
    newTab: '(buka di tab baru)',
  },
  en: {
    variant: 'Choose a variant',
    color: 'Choose a colour',
    qty: 'Quantity',
    less: 'Decrease quantity',
    more: 'Increase quantity',
    gift: 'Gift wrap + card (free)',
    note: 'Notes or personalisation',
    notePh: 'e.g. embroider the name "Aira", deliver on the 20th',
    total: 'Estimated total',
    excl: 'shipping not included',
    cta: 'Order via WhatsApp',
    preview: 'Message preview',
    newTab: '(opens in a new tab)',
  },
};

export default function OrderComposer(props: Props) {
  const t = COPY[props.locale];
  // Default to the variant that matches the listed price (e.g. 5 stems), not simply the first one.
  const [variant, setVariant] = useState(
    (props.variants.find((v) => v.price === props.basePrice) ?? props.variants[0])?.key ?? '',
  );
  const [color, setColor] = useState(props.colors[0]?.key ?? '');
  const [qty, setQty] = useState(1);
  const [gift, setGift] = useState(props.giftWrap);
  const [note, setNote] = useState('');

  const v = props.variants.find((x) => x.key === variant);
  const c = props.colors.find((x) => x.key === color);
  const unit = v?.price ?? props.basePrice;
  const total = unit * qty;

  const message = useMemo(
    () =>
      productMessage({
        locale: props.locale,
        name: props.name,
        url: props.url,
        price: total,
        variant: v?.label,
        color: c?.label,
        qty,
        giftWrap: gift,
        note,
      }),
    [props.locale, props.name, props.url, total, v?.label, c?.label, qty, gift, note],
  );
  const id = `oc-${props.productId}`;

  return (
    <form class="space-y-5" onSubmit={(e) => e.preventDefault()} aria-describedby={`${id}-total`}>
      {props.variants.length > 1 && (
        <fieldset>
          <legend class="mb-2 font-bold">{t.variant}</legend>
          <div class="flex flex-wrap gap-2">
            {props.variants.map((o) => (
              <label key={o.key} class="choice">
                <input
                  type="radio"
                  name={`${id}-variant`}
                  value={o.key}
                  checked={variant === o.key}
                  onChange={() => setVariant(o.key)}
                />
                <span>
                  {o.label}
                  {o.price ? <small> · {formatIDR(o.price)}</small> : null}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend class="mb-2 font-bold">{t.color}</legend>
        <div class="flex flex-wrap gap-2">
          {props.colors.map((o) => (
            <label key={o.key} class="choice">
              <input
                type="radio"
                name={`${id}-color`}
                value={o.key}
                checked={color === o.key}
                onChange={() => setColor(o.key)}
              />
              <span>
                <i class="swatch" style={{ background: o.hex }} aria-hidden="true" />
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div class="flex flex-wrap items-end gap-6">
        <div>
          <label for={`${id}-qty`} class="mb-2 block font-bold">
            {t.qty}
          </label>
          <div class="stepper">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t.less}>
              −
            </button>
            <input
              id={`${id}-qty`}
              type="number"
              inputMode="numeric"
              min={1}
              max={99}
              value={qty}
              onInput={(e) => setQty(Math.min(99, Math.max(1, Number((e.target as HTMLInputElement).value) || 1)))}
            />
            <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label={t.more}>
              +
            </button>
          </div>
        </div>
        {props.giftWrap && (
          <label class="flex items-center gap-2 pb-3 font-semibold">
            <input
              type="checkbox"
              class="size-5 accent-[var(--color-rose-ink)]"
              checked={gift}
              onChange={(e) => setGift((e.target as HTMLInputElement).checked)}
            />
            {t.gift}
          </label>
        )}
      </div>

      <div>
        <label for={`${id}-note`} class="mb-2 block font-bold">
          {t.note}
        </label>
        <textarea
          id={`${id}-note`}
          rows={2}
          maxLength={200}
          placeholder={props.personalisable ? t.notePh : ''}
          value={note}
          onInput={(e) => setNote((e.target as HTMLTextAreaElement).value)}
          class="w-full rounded-2xl border-2 border-cocoa/20 bg-cream px-4 py-3"
        />
      </div>

      <p id={`${id}-total`} class="text-step-1" aria-live="polite">
        {t.total}: <strong>{formatIDR(total)}</strong> <span class="text-step--1 text-cocoa-soft">({t.excl})</span>
      </p>

      <a
        href={waLink(message)}
        class="btn btn-wa w-full text-step-1"
        target="_blank"
        rel="noopener"
        data-track="whatsapp"
        data-track-context="product"
        data-track-product={props.productId}>
        {t.cta}
        <span class="sr-only-lc"> {t.newTab}</span>
      </a>

      <details class="text-step--1 text-cocoa-soft">
        <summary class="cursor-pointer font-semibold">{t.preview}</summary>
        <pre class="mt-2 rounded-xl bg-oat p-3 font-sans whitespace-pre-wrap">{message}</pre>
      </details>
    </form>
  );
}
