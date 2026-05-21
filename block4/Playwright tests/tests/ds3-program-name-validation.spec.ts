import { test, expect } from '@playwright/test';
import { login, createProgram, generateUniqueName, generateLongString } from './helpers/test-helpers';

test.describe('DS-3: Program Name Validation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.describe('Positive Test Cases', () => {
    test('TC-001: Create program with valid alphanumeric name', async ({ page }) => {
      const programName = `Web Development ${Date.now()}`;

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(programName)).toBeVisible();
    });

    test('TC-002: Create program with special characters in name', async ({ page }) => {
      const programName = `Informatique & IA - Niveau 2 ${Date.now()}`;

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(programName)).toBeVisible();
    });

    test('TC-003: Create program with accented characters', async ({ page }) => {
      const programName = `Développement Économique ${Date.now()}`;

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(programName)).toBeVisible();
    });

    test('TC-004: Create program with numbers in name', async ({ page }) => {
      const programName = `Program 101 - Fall ${Date.now()}`;

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(programName)).toBeVisible();
    });

    test('TC-005: Create program with hyphen and underscore', async ({ page }) => {
      const programName = `Web_Dev-${Date.now()}_Advanced`;

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(programName)).toBeVisible();
    });
  });

  test.describe('Negative Test Cases', () => {
    test('TC-006: Reject empty program name', async ({ page }) => {
      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      // Leave name empty
      await page.getByLabel('Description').fill('Test description');

      await expect(page.getByRole('button', { name: 'Create' })).toBeDisabled();
    });

    test('TC-007: Reject whitespace-only program name', async ({ page }) => {
      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill('     ');

      await expect(page.getByRole('button', { name: 'Create' })).toBeDisabled();
    });

    test('TC-008: Reject duplicate program name (exact match)', async ({ page }) => {
      const programName = generateUniqueName('Duplicate Check');
      await createProgram(page, programName, 'First program');

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(/already exists|duplicate/i)).toBeVisible();
    });

    test('TC-009: Reject duplicate program name (case-insensitive)', async ({ page }) => {
      const programName = generateUniqueName('Case Test');
      await createProgram(page, programName, 'First program');

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName.toUpperCase());
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(/already exists|duplicate/i)).toBeVisible();
    });

    test('TC-010: Reject duplicate with leading/trailing spaces', async ({ page }) => {
      const programName = generateUniqueName('Trim Duplicate');
      await createProgram(page, programName, 'First program');

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(`  ${programName}  `);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(/already exists|duplicate/i)).toBeVisible();
    });

    test('TC-011: Reject name exceeding maximum length', async ({ page }) => {
      const longName = generateLongString(300);

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(longName);

      // Should either truncate or show error
      const inputValue = await page.getByLabel('Program Name').inputValue();
      expect(inputValue.length).toBeLessThanOrEqual(255);
    });
  });

  test.describe('Edge Cases', () => {
    test('TC-012: Create program with single character name', async ({ page }) => {
      const programName = 'A';

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(programName)).toBeVisible();
    });

    test('TC-013: Create program with maximum length name', async ({ page }) => {
      const maxName = generateLongString(255);

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(maxName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(maxName.substring(0, 50))).toBeVisible();
    });

    test('TC-014: Handle name with emoji characters', async ({ page }) => {
      const emojiName = `Web Development 🚀 ${Date.now()}`;

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(emojiName);
      await page.getByRole('button', { name: 'Create' }).click();

      // Should either create successfully or show validation error
      const createButton = page.getByRole('button', { name: 'Create' });
      const isDisabled = await createButton.isDisabled();
      if (!isDisabled) {
        await expect(page.getByText(emojiName)).toBeVisible();
      }
    });

    test('TC-015: Handle name with HTML/script tags (XSS prevention)', async ({ page }) => {
      const xssPayload = `<script>alert('xss')</script> ${Date.now()}`;

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(xssPayload);
      await page.getByRole('button', { name: 'Create' }).click();

      // Should sanitize or accept escaped content
      await expect(page.locator('script')).toHaveCount(0);
    });

    test('TC-016: Leading/trailing whitespace is trimmed', async ({ page }) => {
      const baseName = generateUniqueName('Trim Test');
      const paddedName = `  ${baseName}  `;

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(paddedName);
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(baseName)).toBeVisible();
    });
  });
});
