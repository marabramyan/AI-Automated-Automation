import { test, expect } from '@playwright/test';

const TODO_URL = 'https://demo.playwright.dev/todomvc/#/';

test.describe('TodoMVC - Positive Flows', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(TODO_URL);
  });

  test('TC-001: Add a new todo item', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-item')).toContainText('Buy groceries');
    await expect(input).toBeEmpty();
    await expect(page.getByTestId('todo-count')).toContainText('1 item left');
  });

  test('TC-002: Add multiple todo items', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(3);
    await expect(page.getByTestId('todo-count')).toContainText('3 items left');
  });

  test('TC-003: Mark a todo as completed', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.getByTestId('todo-item');
    await todoItem.getByRole('checkbox').check();

    await expect(todoItem).toHaveClass(/completed/);
    await expect(page.getByTestId('todo-count')).toContainText('0 items left');
  });

  test('TC-004: Unmark a completed todo', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.getByTestId('todo-item');
    const checkbox = todoItem.getByRole('checkbox');

    await checkbox.check();
    await expect(todoItem).toHaveClass(/completed/);

    await checkbox.uncheck();
    await expect(todoItem).not.toHaveClass(/completed/);
    await expect(page.getByTestId('todo-count')).toContainText('1 item left');
  });

  test('TC-005: Edit a todo by double-clicking', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.getByTestId('todo-item');
    await todoItem.dblclick();

    const editInput = todoItem.getByRole('textbox');
    await editInput.fill('Buy milk');
    await editInput.press('Enter');

    await expect(todoItem).toContainText('Buy milk');
  });

  test('TC-006: Edit a todo and press Escape to cancel', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.getByTestId('todo-item');
    await todoItem.dblclick();

    const editInput = todoItem.getByRole('textbox');
    await editInput.fill('New text');
    await editInput.press('Escape');

    await expect(todoItem).toContainText('Buy groceries');
  });

  test('TC-007: Edit a todo and blur to save', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.getByTestId('todo-item');
    await todoItem.dblclick();

    const editInput = todoItem.getByRole('textbox');
    await editInput.fill('Buy milk');
    await editInput.blur();

    await expect(todoItem).toContainText('Buy milk');
  });

  test('TC-008: Delete a todo using destroy button', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.getByTestId('todo-item');
    await todoItem.hover();
    await todoItem.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('TC-009: Filter todos - show Active only', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Active task 1');
    await input.press('Enter');
    await input.fill('Active task 2');
    await input.press('Enter');
    await input.fill('Completed task');
    await input.press('Enter');

    // Complete the third task
    await page.getByTestId('todo-item').nth(2).getByRole('checkbox').check();

    // Click Active filter
    await page.getByRole('link', { name: 'Active' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(2);
    await expect(page).toHaveURL(/#\/active$/);
  });

  test('TC-010: Filter todos - show Completed only', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Active task 1');
    await input.press('Enter');
    await input.fill('Active task 2');
    await input.press('Enter');
    await input.fill('Completed task');
    await input.press('Enter');

    // Complete the third task
    await page.getByTestId('todo-item').nth(2).getByRole('checkbox').check();

    // Click Completed filter
    await page.getByRole('link', { name: 'Completed' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-item')).toContainText('Completed task');
    await expect(page).toHaveURL(/#\/completed$/);
  });

  test('TC-011: Filter todos - show All', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    await page.getByTestId('todo-item').nth(0).getByRole('checkbox').check();
    await page.getByRole('link', { name: 'Active' }).click();

    // Now click All
    await page.getByRole('link', { name: 'All' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(2);
    await expect(page).toHaveURL(/#\/$/);
  });

  test('TC-012: Clear all completed todos', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');

    // Complete first two tasks
    await page.getByTestId('todo-item').nth(0).getByRole('checkbox').check();
    await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-item')).toContainText('Task 3');
  });

  test('TC-013: Toggle all todos complete', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');

    await page.getByLabel('Mark all as complete').check();

    const todoItems = page.getByTestId('todo-item');
    await expect(todoItems.nth(0)).toHaveClass(/completed/);
    await expect(todoItems.nth(1)).toHaveClass(/completed/);
    await expect(todoItems.nth(2)).toHaveClass(/completed/);
    await expect(page.getByTestId('todo-count')).toContainText('0 items left');
  });

  test('TC-014: Toggle all todos incomplete', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    // First toggle all complete
    const toggleAll = page.getByLabel('Mark all as complete');
    await toggleAll.check();

    // Then toggle all incomplete
    await toggleAll.uncheck();

    const todoItems = page.getByTestId('todo-item');
    await expect(todoItems.nth(0)).not.toHaveClass(/completed/);
    await expect(todoItems.nth(1)).not.toHaveClass(/completed/);
    await expect(page.getByTestId('todo-count')).toContainText('2 items left');
  });

  test('TC-015: Todos persist after page refresh', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Persistent task 1');
    await input.press('Enter');
    await input.fill('Persistent task 2');
    await input.press('Enter');

    // Complete first task
    await page.getByTestId('todo-item').nth(0).getByRole('checkbox').check();

    // Refresh page
    await page.reload();

    await expect(page.getByTestId('todo-item')).toHaveCount(2);
    await expect(page.getByTestId('todo-item').nth(0)).toHaveClass(/completed/);
    await expect(page.getByTestId('todo-item').nth(1)).not.toHaveClass(/completed/);
  });

  test('TC-016: Items left counter grammar - singular', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Single task');
    await input.press('Enter');

    await expect(page.getByTestId('todo-count')).toContainText('1 item left');
    await expect(page.getByTestId('todo-count')).not.toContainText('items');
  });

  test('TC-017: Items left counter grammar - plural', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    await expect(page.getByTestId('todo-count')).toContainText('2 items left');
  });
});

test.describe('TodoMVC - Negative Flows', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(TODO_URL);
  });

  test('TC-018: Cannot add empty todo', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('TC-019: Cannot add whitespace-only todo', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('     ');
    await input.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('TC-020: Cannot save empty edit - todo gets deleted', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.getByTestId('todo-item');
    await todoItem.dblclick();

    const editInput = todoItem.getByRole('textbox');
    await editInput.fill('');
    await editInput.press('Enter');

    // TodoMVC typically deletes the todo when emptied
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('TC-021: Clear completed button not visible when no completed todos', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Active task');
    await input.press('Enter');

    await expect(page.getByRole('button', { name: 'Clear completed' })).not.toBeVisible();
  });

  test('TC-022: Footer not visible when no todos', async ({ page }) => {
    await expect(page.locator('.footer')).not.toBeVisible();
    await expect(page.getByTestId('todo-count')).not.toBeVisible();
  });

  test('TC-023: Main section not visible when no todos', async ({ page }) => {
    await expect(page.locator('.main')).not.toBeVisible();
    await expect(page.getByLabel('Mark all as complete')).not.toBeVisible();
  });
});

test.describe('TodoMVC - Edge Cases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(TODO_URL);
  });

  test('TC-024: Add todo with special characters (XSS prevention)', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    const xssPayload = "<script>alert('xss')</script>";
    await input.fill(xssPayload);
    await input.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    // Text should be escaped, not executed
    await expect(page.getByTestId('todo-item')).toContainText(xssPayload);
  });

  test('TC-025: Add todo with very long text', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    const longText = 'A'.repeat(500);
    await input.fill(longText);
    await input.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-item')).toContainText(longText);
  });

  test('TC-026: Add todo with unicode/emoji characters', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    const emojiText = 'Buy groceries 🛒✅';
    await input.fill(emojiText);
    await input.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-item')).toContainText(emojiText);
  });

  test('TC-027: Add todo with leading/trailing whitespace gets trimmed', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('   Buy groceries   ');
    await input.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    // Should be trimmed
    const todoText = await page.getByTestId('todo-item').locator('label').textContent();
    expect(todoText).toBe('Buy groceries');
  });

  test('TC-028: Add duplicate todo', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');
    await input.fill('Buy groceries');
    await input.press('Enter');

    // Duplicates should be allowed
    await expect(page.getByTestId('todo-item')).toHaveCount(2);
  });

  test('TC-029: Rapid toggle of completion state', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const checkbox = page.getByTestId('todo-item').getByRole('checkbox');

    // Rapid toggles
    for (let i = 0; i < 10; i++) {
      await checkbox.click();
    }

    // After even number of clicks, should be unchecked
    await expect(checkbox).not.toBeChecked();
  });

  test('TC-030: Navigate directly to filter URL', async ({ page }) => {
    // First add some todos
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    // Complete one
    await page.getByTestId('todo-item').nth(0).getByRole('checkbox').check();

    // Navigate directly to active filter
    await page.goto(TODO_URL + 'active');

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-item')).toContainText('Task 2');
  });

  test('TC-031: Navigate to invalid filter URL', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');

    await page.goto(TODO_URL + 'invalid');

    // Should handle gracefully - typically shows all todos
    await expect(page.getByTestId('todo-item')).toHaveCount(1);
  });

  test('TC-032: Delete todo while in filtered view', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Completed task');
    await input.press('Enter');

    // Complete the task
    await page.getByTestId('todo-item').getByRole('checkbox').check();

    // Go to Completed filter
    await page.getByRole('link', { name: 'Completed' }).click();

    // Delete the todo
    const todoItem = page.getByTestId('todo-item');
    await todoItem.hover();
    await todoItem.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('TC-033: Complete todo while in Active filter', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Active task');
    await input.press('Enter');

    // Go to Active filter
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.getByTestId('todo-item')).toHaveCount(1);

    // Complete the todo - it should disappear from Active view
    // Use click() instead of check() since the item disappears immediately
    await page.getByTestId('todo-item').getByRole('checkbox').click();

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('TC-034: localStorage cleared - todos should disappear', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');

    // Clear localStorage
    await page.evaluate(() => localStorage.clear());

    // Refresh
    await page.reload();

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('TC-035: Counter shows 0 items left', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');

    // Complete the task
    await page.getByTestId('todo-item').getByRole('checkbox').check();

    await expect(page.getByTestId('todo-count')).toContainText('0 items left');
  });
});
