import { test, expect } from '@playwright/test';
import { login, createProgram, generateUniqueName, generateLongString } from './helpers/test-helpers';

test.describe('DS-2: Edit Program', () => {
  let testProgramName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    testProgramName = generateUniqueName('Edit Test');
    await createProgram(page, testProgramName, 'Original description');
  });

  test.describe('Positive Test Cases', () => {
    test('TC-001: Edit form opens with pre-populated data', async ({ page }) => {
      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();

      await expect(page.getByLabel('Program Name')).toHaveValue(testProgramName);
      await expect(page.getByLabel('Description')).toHaveValue('Original description');
    });

    test('TC-002: Successfully update program name', async ({ page }) => {
      const newName = `${testProgramName} - Updated`;

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill(newName);
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText(newName)).toBeVisible();
      await expect(page.getByText(testProgramName)).not.toBeVisible();
    });

    test('TC-003: Unchanged fields are preserved after edit', async ({ page }) => {
      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Description').clear();
      await page.getByLabel('Description').fill('New description');
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText(testProgramName)).toBeVisible();
      await expect(page.getByText('New description')).toBeVisible();
    });

    test('TC-004: Edit program description only', async ({ page }) => {
      const newDescription = 'Updated course description for 2026';

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Description').clear();
      await page.getByLabel('Description').fill(newDescription);
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText(testProgramName)).toBeVisible();
      await expect(page.getByText(newDescription)).toBeVisible();
    });

    test('TC-005: Edit multiple fields simultaneously', async ({ page }) => {
      const newName = generateUniqueName('Multi Edit');
      const newDescription = 'Multi-field update description';

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill(newName);
      await page.getByLabel('Description').clear();
      await page.getByLabel('Description').fill(newDescription);
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText(newName)).toBeVisible();
      await expect(page.getByText(newDescription)).toBeVisible();
    });

    test('TC-006: Cancel edit without saving', async ({ page }) => {
      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill('Modified Name Should Not Save');
      await page.keyboard.press('Escape');

      await expect(page.getByLabel('Program Name')).not.toBeVisible();
      await expect(page.getByText(testProgramName)).toBeVisible();
    });
  });

  test.describe('Negative Test Cases', () => {
    test('TC-007: Reject empty program name', async ({ page }) => {
      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();

      await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    test('TC-008: Reject whitespace-only program name', async ({ page }) => {
      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill('     ');

      await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    test('TC-009: Reject duplicate program name', async ({ page }) => {
      const duplicateName = generateUniqueName('Duplicate Test');
      await createProgram(page, duplicateName, 'Another program');

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill(duplicateName);
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText(/already exists|duplicate/i)).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('TC-011: Edit program name with special characters', async ({ page }) => {
      const specialName = `Développement & IA - Niveau 2 ${Date.now()}`;

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill(specialName);
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText(specialName)).toBeVisible();
    });

    test('TC-012: Edit program name at maximum length', async ({ page }) => {
      const maxLengthName = generateLongString(255);

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill(maxLengthName);
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText(maxLengthName.substring(0, 50))).toBeVisible();
    });

    test('TC-014: Edit form handles leading/trailing whitespace', async ({ page }) => {
      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill('  Trimmed Name  ');
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText('Trimmed Name')).toBeVisible();
    });
  });
});
