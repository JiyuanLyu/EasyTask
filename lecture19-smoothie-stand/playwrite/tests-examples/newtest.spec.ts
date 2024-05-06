import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:31000/');
  await page.goto('http://localhost:31000/easytask/');
  await page.getByRole('link', { name: 'Hello, qianaaaaan' }).click();
  await page.getByRole('link', { name: 'User List' }).click();
  await page.getByRole('link', { name: 'New Task' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'New Task' }).click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('d d d d');
  await page.getByPlaceholder('Name').press('Enter');
  await page.getByPlaceholder('Description').click();
  await page.getByPlaceholder('Description').fill('dddd');
  await page.getByLabel('Due Date').fill('2024-04-19');
  await page.getByText('Recurring').click();
  await page.getByLabel('Period').selectOption('monthly');
  await page.getByRole('button', { name: 'Create Task' }).click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('d d d');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByPlaceholder('Name').press('Enter');
  await page.getByRole('link', { name: 'New Task' }).click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('a a a');
  await page.getByPlaceholder('Name').press('Enter');
  await page.getByPlaceholder('Description').click();
  await page.getByPlaceholder('Description').fill('aaa');
  await page.getByLabel('Due Date').fill('2024-04-01');
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('c c c');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByPlaceholder('Name').press('Enter');
  await page.getByRole('link', { name: 'New Task' }).click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('aaa');
  await page.getByPlaceholder('Description').click();
  await page.getByPlaceholder('Description').fill('aaaaa');
  await page.getByText('NameDescriptionDue').click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('aaassss');
  await page.getByLabel('Priority').selectOption('3');
  await page.getByRole('button', { name: 'Create Task' }).click();
  await page.getByLabel('Due Date').fill('2024-04-30');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Create Task' }).click();
  await page.locator('div:nth-child(14) > h2').click();
});