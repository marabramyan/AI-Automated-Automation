import { test, expect } from '@playwright/test';
import { login, generateUniqueName } from './helpers/test-helpers';

test.describe('DS-1: Create Program', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.describe('Positive Test Cases', () => {
    test('TC-001: Create program with valid name and description', async ({ page }) => {
      const programName = generateUniqueName();
      const description = `Test description created at ${Date.now()}`;

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.getByLabel('Description').fill(description);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(programName)).toBeVisible();
    });

    test('TC-002: Create program with name only (no description)', async ({ page }) => {
      const programName = generateUniqueName('Program No Desc');

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(programName)).toBeVisible();
    });

    test('TC-003: Create multiple programs sequentially', async ({ page }) => {
      const programs = [
        generateUniqueName('Program A'),
        generateUniqueName('Program B'),
        generateUniqueName('Program C')
      ];

      for (const programName of programs) {
        await page.getByRole('button', { name: 'New Program' }).click();
        await page.getByLabel('Program Name').waitFor();
        await page.getByLabel('Program Name').fill(programName);
        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.getByText(programName)).toBeVisible();
      }
    });
  });

  test.describe('Negative Test Cases', () => {
    test('TC-004: Cannot create program with empty name', async ({ page }) => {
      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Description').fill('Test description');

      await expect(page.getByRole('button', { name: 'Create' })).toBeDisabled();
    });

    test('TC-005: Cannot create program with whitespace-only name', async ({ page }) => {
      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill('     ');
      await page.getByLabel('Description').fill('Test description');

      await expect(page.getByRole('button', { name: 'Create' })).toBeDisabled();
    });
  });

  test.describe('Edge Cases', () => {
    test('TC-006: Cancel program creation', async ({ page }) => {
      const programName = generateUniqueName('Cancel Test');

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.keyboard.press('Escape');

      await expect(page.getByLabel('Program Name')).not.toBeVisible();
      await expect(page.getByText(programName)).not.toBeVisible();
    });

    test('TC-007: Create program with special characters in name', async ({ page }) => {
      const programName = `Test & Special - Chars @ ${Date.now()}`;

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(programName)).toBeVisible();
    });
  });
});
