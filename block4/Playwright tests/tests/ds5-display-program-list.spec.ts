import { test, expect } from '@playwright/test';
import { login, createProgram, generateUniqueName, generateLongString } from './helpers/test-helpers';

test.describe('DS-5: Display Program List', () => {
  test.describe('Positive Test Cases', () => {
    test('TC-001: Display program list with name and description', async ({ page }) => {
      await login(page);

      const programName = generateUniqueName('List Display');
      const description = 'Test description for list display';
      await createProgram(page, programName, description);

      await expect(page.getByText(programName)).toBeVisible();
      await expect(page.getByText(description)).toBeVisible();
    });

    test('TC-002: Empty state displays when no programs exist', async ({ page }) => {
      await login(page);

      // Delete all programs first
      const deleteButtons = page.getByRole('button', { name: '🗑' });
      let count = await deleteButtons.count();

      while (count > 0) {
        await deleteButtons.first().click();
        await page.getByRole('button', { name: /confirm|delete|yes/i }).click();
        await page.waitForTimeout(500);
        count = await deleteButtons.count();
      }

      await expect(page.getByText(/no programs|empty/i)).toBeVisible();
    });

    test('TC-003: Create program prompt in empty state', async ({ page }) => {
      await login(page);

      // Delete all programs
      const deleteButtons = page.getByRole('button', { name: '🗑' });
      let count = await deleteButtons.count();

      while (count > 0) {
        await deleteButtons.first().click();
        await page.getByRole('button', { name: /confirm|delete|yes/i }).click();
        await page.waitForTimeout(500);
        count = await deleteButtons.count();
      }

      // Should show create prompt
      await expect(page.getByRole('button', { name: /new program|create/i })).toBeVisible();
    });

    test('TC-004: Display single program in list', async ({ page }) => {
      await login(page);

      const programName = generateUniqueName('Single Program');
      await createProgram(page, programName, 'Single program description');

      const programRows = page.locator('tr').filter({ hasText: programName });
      await expect(programRows).toHaveCount(1);
    });

    test('TC-005: Display multiple programs in list', async ({ page }) => {
      await login(page);

      const programs = [
        { name: generateUniqueName('Program A'), desc: 'Description A' },
        { name: generateUniqueName('Program B'), desc: 'Description B' },
        { name: generateUniqueName('Program C'), desc: 'Description C' }
      ];

      for (const prog of programs) {
        await createProgram(page, prog.name, prog.desc);
      }

      for (const prog of programs) {
        await expect(page.getByText(prog.name)).toBeVisible();
        await expect(page.getByText(prog.desc)).toBeVisible();
      }
    });

    test('TC-006: Program with special characters displays correctly', async ({ page }) => {
      await login(page);

      const programName = `Développement & IA - Niveau 2 ${Date.now()}`;
      await createProgram(page, programName, 'Description with spëcîàl chars');

      await expect(page.getByText(programName)).toBeVisible();
    });

    test('TC-007: List updates after creating new program', async ({ page }) => {
      await login(page);

      const initialCount = await page.locator('tr').count();

      const newProgram = generateUniqueName('New List Item');
      await createProgram(page, newProgram, 'New program description');

      const newCount = await page.locator('tr').count();
      expect(newCount).toBeGreaterThan(initialCount);
      await expect(page.getByText(newProgram)).toBeVisible();
    });
  });

  test.describe('Negative Test Cases', () => {
    test('TC-008: Unauthorized user cannot access program list', async ({ page }) => {
      // Try to access programs page without login
      await page.goto('/programs');

      // Should redirect to login or show access denied
      await expect(page).toHaveURL(/login/);
    });

    test('TC-009: Handle server error gracefully', async ({ page }) => {
      await login(page);

      // Simulate network error by intercepting
      await page.route('**/api/programs', route => route.abort());

      await page.reload();

      // Should show error message
      await expect(page.getByText(/error|unable to load|try again/i)).toBeVisible();
    });

    test('TC-010: Handle slow network connection', async ({ page }) => {
      await login(page);

      // Slow down network
      await page.route('**/api/programs', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.reload();

      // Should show loading indicator
      await expect(page.getByRole('progressbar').or(page.getByText(/loading/i))).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('TC-011: Display program with empty description', async ({ page }) => {
      await login(page);

      const programName = generateUniqueName('No Description');

      await page.getByRole('button', { name: 'New Program' }).click();
      await page.getByLabel('Program Name').waitFor();
      await page.getByLabel('Program Name').fill(programName);
      // Don't fill description
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText(programName)).toBeVisible();
      // Description area should be empty or show placeholder
    });

    test('TC-012: Display program with very long name', async ({ page }) => {
      await login(page);

      const longName = generateLongString(200);
      await createProgram(page, longName, 'Description');

      // Name should be visible (possibly truncated)
      const programText = page.getByText(longName.substring(0, 50));
      await expect(programText).toBeVisible();
    });

    test('TC-013: Display program with very long description', async ({ page }) => {
      await login(page);

      const programName = generateUniqueName('Long Desc');
      const longDescription = generateLongString(1000);
      await createProgram(page, programName, longDescription);

      await expect(page.getByText(programName)).toBeVisible();
      // Description should be truncated or have "read more"
    });

    test('TC-014: Large number of programs displays correctly', async ({ page }) => {
      await login(page);

      // Create 10 programs for performance testing
      const programs = [];
      for (let i = 0; i < 10; i++) {
        const name = generateUniqueName(`Bulk Program ${i}`);
        programs.push(name);
        await createProgram(page, name, `Description ${i}`);
      }

      // All programs should be visible (possibly with pagination)
      for (const name of programs.slice(0, 5)) {
        await expect(page.getByText(name)).toBeVisible();
      }
    });

    test('TC-015: Program list is sorted consistently', async ({ page }) => {
      await login(page);

      // Get initial order
      const programNames = await page.locator('tr').allTextContents();

      // Refresh page
      await page.reload();

      // Order should be consistent
      const newProgramNames = await page.locator('tr').allTextContents();
      expect(programNames).toEqual(newProgramNames);
    });
  });
});
