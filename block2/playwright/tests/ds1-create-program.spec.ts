import { test, expect } from '@playwright/test';

test.describe('DS-1: Create Program', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.DIDAXIS_EMAIL!);
    await page.getByLabel('Password').fill(process.env.DIDAXIS_PASSWORD!);
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for dashboard to load, then navigate to Programs
    await page.getByText('Programs', { exact: true }).first().click();
    await page.waitForURL('**/programs');
  });

  test('should create a new program successfully', async ({ page }) => {
    const uniqueName = `Test Program ${Date.now()}`;
    const description = `Test description created at ${Date.now()}`;

    // Click New Program button
    await page.getByRole('button', { name: 'New Program' }).click();

    // Fill in the modal form
    await page.getByLabel('Program Name').fill(uniqueName);
    await page.getByLabel('Description').fill(description);

    // Submit the form
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify the program was created
    await expect(page.getByText(uniqueName)).toBeVisible();
  });

  test('should show validation error for empty program name', async ({ page }) => {
    // Click New Program button
    await page.getByRole('button', { name: 'New Program' }).click();

    // Leave Program Name empty, fill only description
    await page.getByLabel('Description').fill('Test description');

    // Verify Create button is disabled when Program Name is empty
    await expect(page.getByRole('button', { name: 'Create' })).toBeDisabled();
  });

  test('should cancel program creation', async ({ page }) => {
    // Click New Program button
    await page.getByRole('button', { name: 'New Program' }).click();

    // Fill in some data
    await page.getByLabel('Program Name').fill(`Cancel Test ${Date.now()}`);

    // Close the modal (press Escape or click cancel/close button)
    await page.keyboard.press('Escape');

    // Verify modal is closed
    await expect(page.getByLabel('Program Name')).not.toBeVisible();
  });
});
