import { Page, expect } from '@playwright/test';

export const BASE_URL = process.env.BASE_URL || 'https://test.didaxis.studio';
export const EMAIL = process.env.DIDAXIS_EMAIL || '';
export const PASSWORD = process.env.DIDAXIS_PASSWORD || '';

export async function login(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/programs');
}

export async function navigateToPrograms(page: Page): Promise<void> {
  await page.getByRole('link', { name: 'Programs', exact: true }).click();
  await page.waitForURL('**/programs');
}

export async function createProgram(page: Page, name: string, description?: string): Promise<void> {
  await page.getByRole('button', { name: 'New Program' }).click();
  await page.getByLabel('Program Name').waitFor();
  await page.getByLabel('Program Name').fill(name);
  if (description) {
    await page.getByLabel('Description').fill(description);
  }
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText(name)).toBeVisible();
}

export async function openEditForm(page: Page, programName: string): Promise<void> {
  const programRow = page.getByRole('row').filter({ hasText: programName });
  await programRow.getByRole('button', { name: /edit/i }).click();
  await page.getByLabel('Program Name').waitFor();
}

export async function deleteProgram(page: Page, programName: string): Promise<void> {
  const programRow = page.getByRole('row').filter({ hasText: programName });
  await programRow.getByRole('button', { name: /delete/i }).click();
  await page.getByRole('button', { name: /confirm|delete/i }).click();
  await expect(page.getByText(programName)).not.toBeVisible();
}

export function generateUniqueName(prefix: string = 'Test Program'): string {
  return `${prefix} ${Date.now()}`;
}

export function generateLongString(length: number): string {
  return 'A'.repeat(length);
}
