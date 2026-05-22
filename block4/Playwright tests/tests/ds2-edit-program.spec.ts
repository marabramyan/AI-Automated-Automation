import { test, expect } from '@playwright/test';
import { login, createProgram, generateUniqueName, generateLongString, openEditForm } from './helpers/test-helpers';

// Environment variables for read-only user (TC-010)
const READONLY_EMAIL = process.env.READONLY_EMAIL || '';
const READONLY_PASSWORD = process.env.READONLY_PASSWORD || '';

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

    // TC-010 requires read-only user credentials - skip if not configured
    test('TC-010: Edit icon not visible for unauthorized users', async ({ browser }) => {
      test.skip(!READONLY_EMAIL || !READONLY_PASSWORD, 'Read-only user credentials not configured');

      const context = await browser.newContext();
      const page = await context.newPage();

      // Login as read-only user
      await page.goto('/login');
      await page.getByLabel('Email').fill(READONLY_EMAIL);
      await page.getByLabel('Password').fill(READONLY_PASSWORD);
      await page.getByRole('button', { name: 'Sign In' }).click();
      await page.waitForURL('**/');

      // Navigate to Programs page
      await page.locator('nav').getByText('Programs').click();
      await page.waitForURL('**/programs');

      // Verify edit button is NOT visible for read-only user
      const programRow = page.locator('tr').first();
      await expect(programRow.getByRole('button', { name: '✏️' })).not.toBeVisible();

      await context.close();
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

    test('TC-013: Edit program name exceeding maximum length', async ({ page }) => {
      const exceedingName = generateLongString(256);

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill(exceedingName);

      // Input should be truncated to 255 chars OR validation error should appear
      const inputValue = await page.getByLabel('Program Name').inputValue();
      const saveButton = page.getByRole('button', { name: 'Save' });

      // Either input is truncated to max length
      const isTruncated = inputValue.length <= 255;
      // Or save button should be disabled / error message visible
      const isDisabled = await saveButton.isDisabled().catch(() => false);
      const hasError = await page.getByText(/too long|maximum|exceed/i).isVisible().catch(() => false);

      expect(isTruncated || isDisabled || hasError).toBeTruthy();
    });

    test('TC-014: Edit form handles leading/trailing whitespace', async ({ page }) => {
      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill('  Trimmed Name  ');
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText('Trimmed Name')).toBeVisible();
    });

    test('TC-015: Concurrent edit conflict handling', async ({ browser }) => {
      // Create two separate browser contexts to simulate concurrent users
      const contextA = await browser.newContext();
      const contextB = await browser.newContext();
      const pageA = await contextA.newPage();
      const pageB = await contextB.newPage();

      // Both users login
      await login(pageA);
      await login(pageB);

      // Create a program for this test
      const programName = generateUniqueName('Concurrent Test');
      await createProgram(pageA, programName, 'Original');

      // Refresh page B to see the new program
      await pageB.reload();

      // Both users open the edit form for the same program
      await openEditForm(pageA, programName);
      await openEditForm(pageB, programName);

      // User A saves changes first
      await pageA.getByLabel('Program Name').clear();
      await pageA.getByLabel('Program Name').fill(`${programName} - User A`);
      await pageA.getByRole('button', { name: 'Save' }).click();
      await expect(pageA.getByText(`${programName} - User A`)).toBeVisible();

      // User B attempts to save changes
      await pageB.getByLabel('Program Name').clear();
      await pageB.getByLabel('Program Name').fill(`${programName} - User B`);
      await pageB.getByRole('button', { name: 'Save' }).click();

      // Either User B gets a conflict warning OR the system accepts both edits
      // (depends on implementation - but data integrity should be maintained)
      const hasConflict = await pageB.getByText(/conflict|modified|changed|stale/i).isVisible().catch(() => false);
      const savedSuccessfully = await pageB.getByText(`${programName} - User B`).isVisible().catch(() => false);

      expect(hasConflict || savedSuccessfully).toBeTruthy();

      await contextA.close();
      await contextB.close();
    });
  });

  test.describe('Robustness & Performance', () => {
    test('TC-016: Double-click Save button protection', async ({ page }) => {
      const newName = generateUniqueName('Double Click Test');

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill(newName);

      const saveButton = page.getByRole('button', { name: 'Save' });

      // Rapidly double-click the Save button
      await saveButton.dblclick();

      // Wait for modal to close or error to appear
      await page.waitForTimeout(1000);

      // Modal should close normally - no stuck state
      await expect(page.getByLabel('Program Name')).not.toBeVisible({ timeout: 5000 });

      // Only one program with this name should exist
      const matchingRows = page.locator('tr').filter({ hasText: newName });
      await expect(matchingRows).toHaveCount(1);
    });

    test('TC-017: Duplicate name validation on edit (case-insensitive)', async ({ page }) => {
      // Create another program with a specific name
      const existingName = generateUniqueName('Case Test');
      await createProgram(page, existingName, 'Existing program');

      // Try to rename our test program to the same name with different case
      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill(existingName.toUpperCase());
      await page.getByRole('button', { name: 'Save' }).click();

      // Should show duplicate/exists error (case-insensitive check)
      await expect(page.getByText(/already exists|duplicate/i)).toBeVisible();
    });

    test('TC-018: Maximum length name performance', async ({ page }) => {
      const maxLengthName = generateLongString(255);
      const startTime = Date.now();

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill(maxLengthName);
      await page.getByRole('button', { name: 'Save' }).click();

      // Wait for modal to close (success) with a reasonable timeout
      await expect(page.getByLabel('Program Name')).not.toBeVisible({ timeout: 5000 });

      const elapsedTime = Date.now() - startTime;

      // Save should complete within 5 seconds (not timeout at 30s like bug DS-40)
      expect(elapsedTime).toBeLessThan(5000);
    });

    test('TC-019: Human-paced double-click on Save', async ({ page }) => {
      const newName = generateUniqueName('Human Click Test');

      const programRow = page.locator('tr').filter({ hasText: testProgramName });
      await programRow.getByRole('button', { name: '✏️' }).click();
      await page.getByLabel('Program Name').clear();
      await page.getByLabel('Program Name').fill(newName);

      const saveButton = page.getByRole('button', { name: 'Save' });

      // First click
      await saveButton.click();

      // Wait ~400ms (simulating human double-click speed)
      await page.waitForTimeout(400);

      // Second click (if button still exists)
      const buttonStillVisible = await saveButton.isVisible().catch(() => false);
      if (buttonStillVisible) {
        await saveButton.click().catch(() => {
          // Button may have become disabled or removed - this is acceptable
        });
      }

      // Modal should close normally without getting stuck
      await expect(page.getByLabel('Program Name')).not.toBeVisible({ timeout: 5000 });

      // No error should be displayed
      await expect(page.getByText(/error|failed/i)).not.toBeVisible();

      // Program should be saved with the new name
      await expect(page.getByText(newName)).toBeVisible();
    });
  });
});
