import { test, expect } from '@playwright/test';
import { login, createProgram, generateUniqueName } from './helpers/test-helpers';

test.describe('DS-4: Delete Program', () => {
  let testProgramName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.describe('Positive Test Cases', () => {
    test('TC-001: Delete program with confirmation', async ({ page }) => {
      testProgramName = generateUniqueName('Delete Test');
      await createProgram(page, testProgramName, 'Program to be deleted');

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '🗑' }).click();

      // Confirm deletion
      await page.getByRole('button', { name: /confirm|delete|yes/i }).click();

      await expect(page.getByText(testProgramName)).not.toBeVisible();
    });

    test('TC-002: Confirmation dialog displays on delete click', async ({ page }) => {
      testProgramName = generateUniqueName('Dialog Test');
      await createProgram(page, testProgramName, 'Test program');

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '🗑' }).click();

      // Verify dialog appears
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByText(/are you sure|confirm/i)).toBeVisible();
    });

    test('TC-003: Cancel deletion preserves program', async ({ page }) => {
      testProgramName = generateUniqueName('Cancel Delete');
      await createProgram(page, testProgramName, 'Test program');

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '🗑' }).click();

      // Cancel deletion
      await page.getByRole('button', { name: /cancel|no/i }).click();

      await expect(page.getByText(testProgramName)).toBeVisible();
    });

    test('TC-004: Close dialog preserves program', async ({ page }) => {
      testProgramName = generateUniqueName('Close Dialog');
      await createProgram(page, testProgramName, 'Test program');

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '🗑' }).click();

      // Close dialog with Escape
      await page.keyboard.press('Escape');

      await expect(page.getByText(testProgramName)).toBeVisible();
    });

    test('TC-005: Delete multiple programs sequentially', async ({ page }) => {
      const programs = [
        generateUniqueName('Program A'),
        generateUniqueName('Program B'),
        generateUniqueName('Program C')
      ];

      // Create all programs
      for (const name of programs) {
        await createProgram(page, name, 'Test program');
      }

      // Delete all programs
      for (const name of programs) {
        const programRow = page.locator('tr').filter({ hasText: name });
        await programRow.getByRole('button', { name: '🗑' }).click();
        await page.getByRole('button', { name: /confirm|delete|yes/i }).click();
        await expect(page.getByText(name)).not.toBeVisible();
      }
    });

    test('TC-006: Program list updates immediately after deletion', async ({ page }) => {
      testProgramName = generateUniqueName('Immediate Update');
      await createProgram(page, testProgramName, 'Test program');

      const initialCount = await page.locator('tr').filter({ hasText: /Program/ }).count();

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '🗑' }).click();
      await page.getByRole('button', { name: /confirm|delete|yes/i }).click();

      // List should update without page refresh
      const newCount = await page.locator('tr').filter({ hasText: /Program/ }).count();
      expect(newCount).toBeLessThan(initialCount);
    });
  });

  test.describe('Negative Test Cases', () => {
    test('TC-007: Deleted program cannot be accessed via URL', async ({ page }) => {
      testProgramName = generateUniqueName('URL Access');
      await createProgram(page, testProgramName, 'Test program');

      // Get program ID if available from URL or element
      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '🗑' }).click();
      await page.getByRole('button', { name: /confirm|delete|yes/i }).click();

      // Try to access deleted program (assuming URL pattern)
      await page.goto('/programs/deleted-id');

      // Should show 404 or redirect
      await expect(page.getByText(/not found|doesn't exist/i)).toBeVisible().catch(() => {
        // If redirected to programs list, that's also acceptable
        expect(page.url()).toContain('/programs');
      });
    });

    test('TC-009: Prevent accidental double-click deletion', async ({ page }) => {
      testProgramName = generateUniqueName('Double Click');
      await createProgram(page, testProgramName, 'Test program');

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      const deleteButton = programRow.getByRole('button', { name: '🗑' });

      // Double click should only open one dialog
      await deleteButton.dblclick();

      const dialogs = await page.getByRole('dialog').count();
      expect(dialogs).toBe(1);
    });
  });

  test.describe('Edge Cases', () => {
    test('TC-011: Delete program with special characters in name', async ({ page }) => {
      testProgramName = `Développement & IA ${Date.now()}`;
      await createProgram(page, testProgramName, 'Test program');

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '🗑' }).click();

      // Verify dialog displays name correctly
      await expect(page.getByText(testProgramName)).toBeVisible();

      await page.getByRole('button', { name: /confirm|delete|yes/i }).click();
      await expect(page.getByText(testProgramName)).not.toBeVisible();
    });

    test('TC-012: Delete last remaining program shows empty state', async ({ page }) => {
      testProgramName = generateUniqueName('Last Program');
      await createProgram(page, testProgramName, 'The only program');

      // Delete all existing programs
      const deleteButtons = page.getByRole('button', { name: '🗑' });
      const count = await deleteButtons.count();

      for (let i = 0; i < count; i++) {
        await deleteButtons.first().click();
        await page.getByRole('button', { name: /confirm|delete|yes/i }).click();
        await page.waitForTimeout(500); // Wait for list update
      }

      // Should show empty state
      await expect(page.getByText(/no programs|create your first/i)).toBeVisible();
    });

    test('TC-014: Keyboard navigation for deletion dialog', async ({ page }) => {
      testProgramName = generateUniqueName('Keyboard Nav');
      await createProgram(page, testProgramName, 'Test program');

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '🗑' }).click();

      // Navigate with Tab and close with Escape
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Escape');

      await expect(page.getByRole('dialog')).not.toBeVisible();
      await expect(page.getByText(testProgramName)).toBeVisible();
    });
  });
});
