/** @jsxImportSource preact */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { formatIDR } from '@/lib/format';
import { customOrderMessage, waLink } from '@/lib/whatsapp';
import { YARN_COLORS, PIECE_TYPES, addWorkingDays, type PieceType } from '@/lib/custom-order';

interface Props {
  locale: 'id' | 'en';
  /** ISO date of "today" in WIB, injected at build and refreshed on the client. */
  today?: string;
}

const COPY = {
  id: {
    steps: ['Jenis', 'Ukuran', 'Warna', 'Personalisasi', 'Tanggal', 'Budget'],
    progress: 'Langkah pesanan custom',
    stepOf: (n: number, total: number) => `Langkah ${n} dari ${total}`,
    type: 'Mau dibuatkan apa?',
    size: 'Pilih ukuran',
    colors: 'Pilih sampai 3 warna benang',
    colorsHint: 'Warna pertama untuk bagian utama, kedua untuk aksen, ketiga untuk detail.',
    selected: 'dipilih',
    maxColors: 'Maksimal 3 warna. Lepas salah satu dulu untuk memilih yang lain.',
    preview: 'Pratinjau warna',
    personal: 'Personalisasi (opsional)',
    personalHint: 'Nama, inisial, tanggal, atau pesan singkat. Maksimal 40 karakter.',
    deadline: 'Kapan dibutuhkan?',
    earliest: (d: string) => `Paling cepat jadi sekitar ${d} (dihitung dari DP masuk).`,
    tooSoon:
      'Tanggal ini lebih cepat dari waktu pengerjaan normal. Kami tetap bisa coba dengan biaya prioritas 20%, chat dulu ya.',
    budget: 'Kisaran budget',
    name: 'Namamu (opsional)',
    from: 'Estimasi mulai',
    back: 'Kembali',
    next: 'Lanjut',
    summary: 'Ringkasan pesanan',
    send: 'Kirim ke WhatsApp',
    newTab: '(buka di tab baru)',
    lead: (a: number, b: number) => `${a}–${b} hari kerja`,
    none: 'Belum dipilih',
    budgets: [
      'Di bawah Rp 100.000',
      'Rp 100.000 – 250.000',
      'Rp 250.000 – 500.000',
      'Di atas Rp 500.000',
      'Belum tahu, minta saran',
    ],
  },
  en: {
    steps: ['Type', 'Size', 'Colours', 'Personalise', 'Date', 'Budget'],
    progress: 'Custom order steps',
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    type: 'What would you like made?',
    size: 'Choose a size',
    colors: 'Pick up to 3 yarn colours',
    colorsHint: 'The first colour is the main body, the second the accent, the third the details.',
    selected: 'selected',
    maxColors: 'Three colours max. Remove one first to pick another.',
    preview: 'Colour preview',
    personal: 'Personalisation (optional)',
    personalHint: 'A name, initials, a date or a short message. Up to 40 characters.',
    deadline: 'When do you need it?',
    earliest: (d: string) => `Earliest finish is around ${d} (counted from the deposit).`,
    tooSoon:
      "That's sooner than our usual lead time. We may still manage it with a 20% priority fee, so message us first.",
    budget: 'Budget range',
    name: 'Your name (optional)',
    from: 'Estimated from',
    back: 'Back',
    next: 'Next',
    summary: 'Order summary',
    send: 'Send on WhatsApp',
    newTab: '(opens in a new tab)',
    lead: (a: number, b: number) => `${a}–${b} working days`,
    none: 'Not chosen yet',
    budgets: [
      'Under Rp 100.000',
      'Rp 100.000 – 250.000',
      'Rp 250.000 – 500.000',
      'Over Rp 500.000',
      'Not sure, suggest one',
    ],
  },
};

function Preview({ type, colors, label }: { type: PieceType['key']; colors: string[]; label: string }) {
  const [a = '#C9776B', b = '#F3D98B', c = '#8FA48A'] = colors;
  const stroke = '#3E2C25';
  return (
    <svg viewBox="0 0 200 200" class="w-full max-w-[16rem]" role="img" aria-label={label}>
      <rect width="200" height="200" rx="28" fill="#FFFDF8" />
      {type === 'boneka' ? (
        <g stroke={stroke} stroke-width="2">
          <circle cx="62" cy="58" r="20" fill={a} />
          <circle cx="138" cy="58" r="20" fill={a} />
          <ellipse cx="100" cy="150" rx="52" ry="40" fill={a} />
          <ellipse cx="100" cy="155" rx="28" ry="24" fill={b} />
          <circle cx="100" cy="92" r="46" fill={a} />
          <ellipse cx="100" cy="104" rx="20" ry="14" fill={b} />
          <circle cx="84" cy="88" r="4" fill={stroke} />
          <circle cx="116" cy="88" r="4" fill={stroke} />
          <path d="M80 130 q20 12 40 0 l-20 10z" fill={c} />
          <path d="M100 136 q-20 -16 -24 2 q10 8 24 -2 q20 -16 24 2 q-10 8 -24 -2" fill={c} />
        </g>
      ) : type === 'tas' ? (
        <g stroke={stroke} stroke-width="2">
          <path d="M70 70 Q70 30 100 30 Q130 30 130 70" fill="none" stroke={a} stroke-width="10" />
          <path d="M40 70 H160 L168 170 Q100 180 32 170Z" fill={a} />
          <rect x="40" y="70" width="120" height="16" fill={b} />
          <circle cx="128" cy="124" r="16" fill={c} />
          <path d="M128 112 a6 6 0 1 1 0.1 0" fill="none" />
        </g>
      ) : type === 'pakaian' ? (
        <g stroke={stroke} stroke-width="2">
          <path
            d="M70 40 L36 62 L22 140 L44 144 L54 90 L56 176 H144 L146 90 L156 144 L178 140 L164 62 L130 40 Q100 62 70 40Z"
            fill={a}
          />
          <path d="M70 40 Q100 70 100 176 M130 40 Q100 70 100 176" fill="none" stroke={b} stroke-width="6" />
          <rect x="60" y="104" width="28" height="28" rx="4" fill={c} />
          <rect x="112" y="104" width="28" height="28" rx="4" fill={c} />
        </g>
      ) : type === 'aksesoris' ? (
        <g stroke={stroke} stroke-width="2">
          <circle cx="100" cy="38" r="12" fill="none" stroke="#9AA0A6" stroke-width="5" />
          <path d="M100 50 V70" />
          <path
            d="M100 170 C84 156 44 132 44 100 C44 78 62 66 78 66 C88 66 96 72 100 80 C104 72 112 66 122 66 C138 66 156 78 156 100 C156 132 116 156 100 170Z"
            fill={a}
          />
          <path d="M62 100 C62 88 70 82 78 84" fill="none" stroke={b} stroke-width="5" stroke-linecap="round" />
          <circle cx="126" cy="98" r="9" fill={c} />
        </g>
      ) : (
        <g stroke={stroke} stroke-width="2">
          <path d="M100 190 V110" stroke="#6E8569" stroke-width="5" />
          <path d="M100 160 C70 150 60 130 70 124 C84 130 96 146 100 160Z" fill={c} />
          <path d="M100 150 C130 140 140 120 130 114 C116 120 104 136 100 150Z" fill={c} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse key={i} cx="100" cy="58" rx="17" ry="32" fill={a} transform={`rotate(${i * 60} 100 82)`} />
          ))}
          <circle cx="100" cy="82" r="18" fill={b} />
        </g>
      )}
    </svg>
  );
}

export default function CustomBuilder({ locale, today }: Props) {
  const t = COPY[locale];
  const [step, setStep] = useState(0);
  const [typeKey, setTypeKey] = useState<PieceType['key']>('boneka');
  const [sizeKey, setSizeKey] = useState('');
  const [colors, setColors] = useState<string[]>(['rose-clay', 'butter']);
  const [personal, setPersonal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [name, setName] = useState('');
  const [limitHit, setLimitHit] = useState(false);
  const legendRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const [now, setNow] = useState(() => (today ? new Date(`${today}T12:00:00+07:00`) : new Date()));

  useEffect(() => setNow(new Date()), []);

  const type = PIECE_TYPES.find((p) => p.key === typeKey)!;
  const size = type.sizes.find((s) => s.key === sizeKey) ?? type.sizes[0]!;
  const earliest = addWorkingDays(now, type.leadDays[0]);
  const earliestIso = earliest.toISOString().slice(0, 10);
  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  const tooSoon = Boolean(deadline) && deadline < earliestIso;
  const colorNames = colors.map((k) => YARN_COLORS.find((c) => c.key === k)?.name[locale] ?? k);
  const hexes = colors.map((k) => YARN_COLORS.find((c) => c.key === k)?.hex ?? '#ccc');

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    legendRef.current?.focus();
  }, [step]);

  const message = useMemo(
    () =>
      customOrderMessage({
        locale,
        type: type.name[locale],
        size: size.label[locale],
        colors: colorNames,
        personalization: personal,
        deadline: deadline ? fmtDate(new Date(`${deadline}T12:00:00+07:00`)) : undefined,
        budget: budget || t.none,
        name,
      }),
    [locale, type, size, colorNames.join(), personal, deadline, budget, name],
  );

  const toggleColor = (key: string) => {
    setColors((cur) => {
      if (cur.includes(key)) {
        setLimitHit(false);
        return cur.filter((k) => k !== key);
      }
      if (cur.length >= 3) {
        setLimitHit(true);
        return cur;
      }
      setLimitHit(false);
      return [...cur, key];
    });
  };

  const last = t.steps.length - 1;
  const fieldset = 'scallop p-6 md:p-8 shadow-[var(--shadow-warm)]';

  return (
    <div class="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
      <div>
        <nav aria-label={t.progress}>
          <ol class="mb-6 flex flex-wrap gap-2">
            {t.steps.map((label, i) => (
              <li key={label}>
                <button
                  type="button"
                  class={`marker ${i === step ? 'marker--butter' : i < step ? 'marker--sage' : 'marker--oat'}`}
                  aria-current={i === step ? 'step' : undefined}
                  onClick={() => setStep(i)}>
                  {i + 1}. {label}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <form onSubmit={(e) => e.preventDefault()} class="space-y-6">
          <p class="sr-only-lc" aria-live="polite">
            {t.stepOf(step + 1, t.steps.length)}: {t.steps[step]}
          </p>

          {step === 0 && (
            <fieldset class={fieldset}>
              <legend class="sr-only-lc">{t.type}</legend>
              <h2 ref={legendRef} tabIndex={-1} class="mb-5 text-step-2 outline-none">
                {t.type}
              </h2>
              <div class="grid gap-3 sm:grid-cols-2">
                {PIECE_TYPES.map((p) => (
                  <label key={p.key} class="choice choice--block">
                    <input
                      type="radio"
                      name="type"
                      value={p.key}
                      checked={typeKey === p.key}
                      onChange={() => {
                        setTypeKey(p.key);
                        setSizeKey('');
                      }}
                    />
                    <span>
                      <strong>{p.name[locale]}</strong>
                      <small class="block">{t.lead(p.leadDays[0], p.leadDays[1])}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset class={fieldset}>
              <legend class="sr-only-lc">{t.size}</legend>
              <h2 ref={legendRef} tabIndex={-1} class="mb-5 text-step-2 outline-none">
                {t.size}
              </h2>
              <div class="grid gap-3">
                {type.sizes.map((s) => (
                  <label key={s.key} class="choice choice--block">
                    <input
                      type="radio"
                      name="size"
                      value={s.key}
                      checked={size.key === s.key}
                      onChange={() => setSizeKey(s.key)}
                    />
                    <span>
                      <strong>{s.label[locale]}</strong>
                      <small class="block">
                        {t.from} {formatIDR(s.from)}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset class={fieldset}>
              <legend class="sr-only-lc">{t.colors}</legend>
              <h2 ref={legendRef} tabIndex={-1} class="text-step-2 outline-none">
                {t.colors}
              </h2>
              <p class="mt-1 mb-5 text-cocoa-soft">{t.colorsHint}</p>
              <div class="flex flex-wrap gap-3">
                {YARN_COLORS.map((c) => {
                  const idx = colors.indexOf(c.key);
                  return (
                    <label key={c.key} class="swatch-pick">
                      <input type="checkbox" checked={idx >= 0} onChange={() => toggleColor(c.key)} />
                      <span class="swatch-ball" style={{ background: c.hex }} aria-hidden="true">
                        {idx >= 0 ? idx + 1 : ''}
                      </span>
                      <span class="text-step--1 font-semibold">{c.name[locale]}</span>
                    </label>
                  );
                })}
              </div>
              <p class="mt-4 text-step--1 font-semibold text-rose-ink" aria-live="polite">
                {limitHit ? t.maxColors : `${colors.length}/3 ${t.selected}: ${colorNames.join(', ') || '-'}`}
              </p>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset class={fieldset}>
              <legend class="sr-only-lc">{t.personal}</legend>
              <h2 ref={legendRef} tabIndex={-1} class="text-step-2 outline-none">
                {t.personal}
              </h2>
              <label for="cb-personal" class="mt-1 mb-3 block text-cocoa-soft">
                {t.personalHint}
              </label>
              <input
                id="cb-personal"
                type="text"
                maxLength={40}
                value={personal}
                onInput={(e) => setPersonal((e.target as HTMLInputElement).value)}
                class="w-full rounded-full border-2 border-cocoa/20 bg-cream px-5 py-3"
              />
              <p class="mt-2 text-right text-step--1 text-cocoa-soft">{personal.length}/40</p>
            </fieldset>
          )}

          {step === 4 && (
            <fieldset class={fieldset}>
              <legend class="sr-only-lc">{t.deadline}</legend>
              <h2 ref={legendRef} tabIndex={-1} class="text-step-2 outline-none">
                {t.deadline}
              </h2>
              <p class="mt-1 mb-4 text-cocoa-soft">{t.earliest(fmtDate(earliest))}</p>
              <label for="cb-deadline" class="sr-only-lc">
                {t.deadline}
              </label>
              <input
                id="cb-deadline"
                type="date"
                value={deadline}
                min={now.toISOString().slice(0, 10)}
                onInput={(e) => setDeadline((e.target as HTMLInputElement).value)}
                class="rounded-full border-2 border-cocoa/20 bg-cream px-5 py-3"
                aria-describedby="cb-deadline-note"
              />
              <p id="cb-deadline-note" class="mt-3 text-step--1 font-semibold text-rose-ink" aria-live="polite">
                {tooSoon ? t.tooSoon : ''}
              </p>
            </fieldset>
          )}

          {step === 5 && (
            <fieldset class={fieldset}>
              <legend class="sr-only-lc">{t.budget}</legend>
              <h2 ref={legendRef} tabIndex={-1} class="mb-5 text-step-2 outline-none">
                {t.budget}
              </h2>
              <div class="grid gap-3 sm:grid-cols-2">
                {t.budgets.map((b) => (
                  <label key={b} class="choice choice--block">
                    <input type="radio" name="budget" value={b} checked={budget === b} onChange={() => setBudget(b)} />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
              <label for="cb-name" class="mt-6 mb-2 block font-bold">
                {t.name}
              </label>
              <input
                id="cb-name"
                type="text"
                autoComplete="given-name"
                maxLength={40}
                value={name}
                onInput={(e) => setName((e.target as HTMLInputElement).value)}
                class="w-full rounded-full border-2 border-cocoa/20 bg-cream px-5 py-3"
              />
            </fieldset>
          )}

          <div class="flex justify-between gap-3">
            <button
              type="button"
              class="btn btn-ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}>
              ← {t.back}
            </button>
            {step < last ? (
              <button type="button" class="btn btn-primary" onClick={() => setStep((s) => Math.min(last, s + 1))}>
                {t.next} →
              </button>
            ) : (
              <a
                href={waLink(message)}
                class="btn btn-wa"
                target="_blank"
                rel="noopener"
                data-track="custom-order-complete"
                data-track-context={typeKey}>
                {t.send}
                <span class="sr-only-lc"> {t.newTab}</span>
              </a>
            )}
          </div>
        </form>
      </div>

      <aside class="lg:sticky lg:top-24 lg:self-start" aria-labelledby="cb-summary">
        <div class="polaroid !pb-6" style={{ '--tilt': '1.5deg' }}>
          <Preview
            type={typeKey}
            colors={hexes}
            label={`${t.preview}: ${type.name[locale]}, ${colorNames.join(', ')}`}
          />
          <h2 id="cb-summary" class="mt-5 text-step-2">
            {t.summary}
          </h2>
          <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-step--1" aria-live="polite">
            <dt class="font-bold">{t.steps[0]}</dt>
            <dd>{type.name[locale]}</dd>
            <dt class="font-bold">{t.steps[1]}</dt>
            <dd>
              {size.label[locale]} · {t.from} {formatIDR(size.from)}
            </dd>
            <dt class="font-bold">{t.steps[2]}</dt>
            <dd>{colorNames.join(', ') || t.none}</dd>
            <dt class="font-bold">{t.steps[3]}</dt>
            <dd>{personal || '-'}</dd>
            <dt class="font-bold">{t.steps[4]}</dt>
            <dd>{deadline ? fmtDate(new Date(`${deadline}T12:00:00+07:00`)) : t.none}</dd>
            <dt class="font-bold">{t.steps[5]}</dt>
            <dd>{budget || t.none}</dd>
          </dl>
          <a
            href={waLink(message)}
            class="btn btn-wa mt-6 w-full"
            target="_blank"
            rel="noopener"
            data-track="custom-order-complete"
            data-track-context={`${typeKey}-summary`}>
            {t.send}
            <span class="sr-only-lc"> {t.newTab}</span>
          </a>
        </div>
      </aside>
    </div>
  );
}
