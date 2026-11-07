import { test, expect } from '@playwright/test';

test('seção de projetos fica entre serviços e "Como funciona"', async ({ page }) => {
  await page.goto('/');
  const ordem = await page.evaluate(() =>
    ['servicos', 'projetos', 'processo'].map((id) => document.getElementById(id)!.getBoundingClientRect().top + scrollY),
  );
  expect(ordem[0]).toBeLessThan(ordem[1]);
  expect(ordem[1]).toBeLessThan(ordem[2]);
});

test('cards mostram nome, segmento, serviços e o aviso de conceito', async ({ page }) => {
  await page.goto('/');
  const secao = page.locator('#projetos');
  await expect(secao.getByRole('heading', { name: 'Projetos selecionados' })).toBeAttached();
  await expect(secao.getByText('conceitos demonstrativos')).toBeAttached();

  const cards = secao.getByRole('link').filter({ has: page.getByRole('heading', { level: 3 }) });
  await expect(cards).toHaveCount(3);
  const primeiro = cards.first();
  await expect(primeiro.getByText('Projeto conceito')).toBeAttached();
  // o segmento também aparece dentro da ilustração; aqui conferimos o texto do card
  await expect(primeiro.locator('p', { hasText: 'Padaria de bairro' }).last()).toBeVisible();
  await expect(primeiro.getByRole('list', { name: 'Serviços realizados' })).toBeAttached();
});

test('clicar em um projeto abre a página individual', async ({ page }) => {
  await page.goto('/');
  await page.locator('#projetos').getByRole('link', { name: /Clínica Respira/ }).click();
  await expect(page).toHaveURL(/\/projetos\/clinica-respira$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Clínica Respira');
  for (const bloco of ['O desafio', 'A solução', 'Resultado esperado']) {
    await expect(page.getByRole('heading', { name: bloco })).toBeVisible();
  }
  await expect(page.getByText('Este é um projeto conceito')).toBeVisible();
  await expect(page.getByRole('img', { name: /Ilustração conceito/ }).first()).toBeVisible();
});

test('projeto inexistente mostra a página de não encontrado', async ({ page }) => {
  await page.goto('/projetos/nao-existe');
  await expect(page.getByRole('heading', { name: 'Esta página se camuflou.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ver projetos' })).toBeVisible();
});

test('página do projeto não tem rolagem horizontal', async ({ page }) => {
  await page.goto('/projetos/agulha-fina-tattoo');
  const sobra = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(sobra).toBeLessThanOrEqual(0);
});
