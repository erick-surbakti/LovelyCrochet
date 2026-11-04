import { expect, test, type Page } from '@playwright/test';

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

test('home loads with hero, schema and no console errors', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page).toHaveTitle(/Simpul Mungil/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'id-ID');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mungil');
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  const types = (JSON.parse(ld ?? '{}')['@graph'] as { '@type': string }[]).map((n) => n['@type']);
  expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'Store']));
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
    'href',
    'https://lovelycrochet.shop/',
  );
  expect(errors).toEqual([]);
});

test('language switch keeps the visitor on the same page', async ({ page }) => {
  await page.goto('/koleksi/buket-bunga-rajut/');
  await page.locator('[data-lang-switch]').click();
  await expect(page).toHaveURL(/\/en\/shop\/crochet-flower-bouquets\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('[data-lang-switch]').click();
  await expect(page).toHaveURL(/\/koleksi\/buket-bunga-rajut\/$/);
});

test('product WhatsApp link is correctly encoded and follows the composer', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/produk/boneka-hello-kitty-rajut/');
  const cta = page.locator('a[data-track="whatsapp"][data-track-context="product"]');
  await expect(cta).toBeVisible();

  const read = async () => {
    const href = (await cta.getAttribute('href')) ?? '';
    const url = new URL(href);
    expect(url.origin + url.pathname).toBe('https://wa.me/6281296761659');
    return url.searchParams.get('text') ?? '';
  };

  expect(await read()).toContain('Boneka Hello Kitty Rajut');
  expect(await read()).toContain('Varian: Tanpa kotak');
  await page.locator('astro-island:not([ssr])').first().waitFor({ state: 'attached' });
  await page.getByRole('radio', { name: /Dengan kotak kado/ }).check({ force: true });
  await page.getByRole('radio', { name: /Overall pink/ }).check({ force: true });
  await page.getByRole('button', { name: 'Tambah jumlah' }).click();
  const text = await read();
  expect(text).toContain('Varian: Dengan kotak kado');
  expect(text).toContain('Warna: Overall pink, pita magenta');
  expect(text).toContain('Jumlah: 2');
  expect(text).toContain('Rp 470.000');
  expect(text).toContain('https://lovelycrochet.shop/produk/boneka-hello-kitty-rajut/');
  expect(errors).toEqual([]);
});

test('shop filters are URL driven and set noindex', async ({ page }) => {
  await page.goto('/koleksi/');
  const cards = page.locator('[data-product-grid] .product-card');
  const total = await cards.count();
  await page.locator('#f-category').selectOption('aksesoris-rajut');
  await expect(page).toHaveURL(/kategori=aksesoris-rajut/);
  await expect(page.locator('[data-product-grid] .product-card:visible')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://lovelycrochet.shop/koleksi/');

  await page.goto('/koleksi/?warna=blue');
  const blue = await page.locator('[data-product-grid] .product-card:visible').count();
  expect(blue).toBeGreaterThan(0);
  expect(blue).toBeLessThan(total);
});

test('custom order builder walks through all steps to WhatsApp', async ({ page }) => {
  await page.goto('/pesanan-custom/');
  await page.locator('astro-island:not([ssr])').first().waitFor({ state: 'attached' });
  await page.getByRole('radio', { name: /Boneka amigurumi/ }).check({ force: true });
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: /Lanjut/ }).click();
  const send = page.locator('a[data-track="custom-order-complete"]').first();
  const text = new URL((await send.getAttribute('href')) ?? '').searchParams.get('text') ?? '';
  expect(text).toContain('Jenis: Boneka amigurumi');
  expect(text).toContain('Warna: Merah bata, Kuning mentega');
});

test('gallery lightbox opens, navigates by keyboard and closes with Escape', async ({ page }) => {
  await page.goto('/produk/boneka-penguin-rajut/');
  const trigger = page.locator('[data-lightbox-item]').first();
  await trigger.click();
  const dialog = page.locator('dialog.lb');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.lb-caption')).toContainText('(1 dari 2)');
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('.lb-caption')).toContainText('(2 dari 2)');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('site search finds products', async ({ page }) => {
  await page.goto('/cari/?q=penguin');
  await expect(page.locator('[data-results] li').first()).toBeVisible();
  await expect(page.locator('[data-results]')).toContainText('Boneka Penguin Rajut');
});

test('404 page is friendly and noindex', async ({ page }) => {
  const res = await page.goto('/tidak-ada-halaman-ini/');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('benangnya putus');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
