import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('mostra a marca, o manifesto, os serviços e o sobre', async ({ page }) => {
  await expect(page).toHaveTitle(/Cameleon/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sua marca, viva em cada lugar onde aparece.');
  await expect(page.getByText('Hoje, sua empresa está espalhada por dezenas de lugares.')).toBeAttached();
  await expect(page.getByRole('heading', { name: 'Prazer, eu sou o Gabriel.' })).toBeAttached();
  await expect(page.getByRole('heading', { name: 'Reunião de alinhamento' })).toBeAttached();
  for (const servico of ['Site profissional', 'Redes sociais repaginadas', 'Perfil completo no Google Maps']) {
    await expect(page.getByRole('heading', { name: servico })).toBeAttached();
  }
});

test('desenha a cena 3D do camaleão', async ({ page }) => {
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible({ timeout: 15_000 });
  const box = await canvas.boundingBox();
  expect(box?.width).toBeGreaterThan(200);
});

test('trocar o tema muda a cor do site', async ({ page }) => {
  const accent = () =>
    page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
  const antes = await accent();

  // tenta de novo até a página terminar de carregar e responder ao clique
  await expect(async () => {
    await page.getByTitle('Selva').click();
    await expect(page.getByRole('radio', { name: 'Selva' })).toBeChecked({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await expect(page.getByText('Mude a cor do camaleão: Selva')).toBeVisible();
  await expect.poll(accent).not.toBe(antes);
});

test('não tem rolagem horizontal', async ({ page }) => {
  const sobra = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(sobra).toBeLessThanOrEqual(0);
});

test('links do menu levam às seções', async ({ page, isMobile }) => {
  test.skip(isMobile, 'No celular o menu fica escondido; a navegação é rolando a página.');
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Como funciona' }).click();
  await expect(page).toHaveURL(/#processo$/);
  await expect(page.getByRole('heading', { name: 'Como funciona' })).toBeInViewport({ timeout: 5_000 });
});
