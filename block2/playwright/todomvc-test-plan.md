# Test Plan: TodoMVC Application

## Role
Senior QA Engineer reviewing the TodoMVC demo application.

## Feature Overview
TodoMVC is a todo list application that allows users to create, edit, complete, filter, and delete todo items.

**Application URL:** https://demo.playwright.dev/todomvc/#/

## Acceptance Criteria

1. User can add a new todo item by typing in the input field and pressing Enter
2. User can mark a todo as completed by clicking the checkbox
3. User can edit a todo by double-clicking on it
4. User can delete a todo by clicking the destroy (X) button
5. User can filter todos by All, Active, or Completed
6. User can clear all completed todos at once
7. User can toggle all todos complete/incomplete
8. Todo count displays number of items left
9. Todos persist after page refresh (localStorage)

---

# Test Cases

## Positive Flows

### TC-001: Add a new todo item
**Priority:** High
**Preconditions:** Application is loaded, todo list is empty
**Steps:**
1. Click on the input field with placeholder "What needs to be done?"
2. Type "Buy groceries"
3. Press Enter key

**Expected Result:** New todo item "Buy groceries" appears in the list, input field is cleared, items left counter shows "1 item left"

---

### TC-002: Add multiple todo items
**Priority:** High
**Preconditions:** Application is loaded
**Steps:**
1. Enter "Task 1" and press Enter
2. Enter "Task 2" and press Enter
3. Enter "Task 3" and press Enter

**Expected Result:** All three todos appear in order, counter shows "3 items left"

---

### TC-003: Mark a todo as completed
**Priority:** High
**Preconditions:** One active todo "Buy groceries" exists
**Steps:**
1. Click the checkbox next to "Buy groceries"

**Expected Result:** Todo text shows strikethrough styling, checkbox is checked, items left counter decrements to "0 items left"

---

### TC-004: Unmark a completed todo
**Priority:** High
**Preconditions:** One completed todo "Buy groceries" exists
**Steps:**
1. Click the checked checkbox next to "Buy groceries"

**Expected Result:** Strikethrough is removed, checkbox is unchecked, items left counter increments

---

### TC-005: Edit a todo by double-clicking
**Priority:** High
**Preconditions:** Todo "Buy groceries" exists
**Steps:**
1. Double-click on "Buy groceries" text
2. Clear the text and type "Buy milk"
3. Press Enter

**Expected Result:** Todo text updates to "Buy milk"

---

### TC-006: Edit a todo and press Escape to cancel
**Priority:** Medium
**Preconditions:** Todo "Buy groceries" exists
**Steps:**
1. Double-click on "Buy groceries" text
2. Clear text and type "New text"
3. Press Escape key

**Expected Result:** Edit is cancelled, todo text remains "Buy groceries"

---

### TC-007: Edit a todo and blur to save
**Priority:** Medium
**Preconditions:** Todo "Buy groceries" exists
**Steps:**
1. Double-click on "Buy groceries" text
2. Change text to "Buy milk"
3. Click outside the input field

**Expected Result:** Todo text updates to "Buy milk"

---

### TC-008: Delete a todo using destroy button
**Priority:** High
**Preconditions:** Todo "Buy groceries" exists
**Steps:**
1. Hover over "Buy groceries" todo
2. Click the X (destroy) button

**Expected Result:** Todo is removed from the list, counter updates accordingly

---

### TC-009: Filter todos - show Active only
**Priority:** High
**Preconditions:** 2 active todos and 1 completed todo exist
**Steps:**
1. Click "Active" filter link

**Expected Result:** Only active (uncompleted) todos are displayed, URL changes to #/active

---

### TC-010: Filter todos - show Completed only
**Priority:** High
**Preconditions:** 2 active todos and 1 completed todo exist
**Steps:**
1. Click "Completed" filter link

**Expected Result:** Only completed todos are displayed, URL changes to #/completed

---

### TC-011: Filter todos - show All
**Priority:** High
**Preconditions:** Filtered view is active (Active or Completed)
**Steps:**
1. Click "All" filter link

**Expected Result:** All todos (active and completed) are displayed, URL changes to #/

---

### TC-012: Clear all completed todos
**Priority:** High
**Preconditions:** At least one completed todo exists
**Steps:**
1. Click "Clear completed" button

**Expected Result:** All completed todos are removed, active todos remain, "Clear completed" button disappears if no completed todos remain

---

### TC-013: Toggle all todos complete
**Priority:** High
**Preconditions:** 3 active todos exist
**Steps:**
1. Click the toggle-all checkbox (chevron icon)

**Expected Result:** All todos are marked as completed, all checkboxes are checked, counter shows "0 items left"

---

### TC-014: Toggle all todos incomplete
**Priority:** High
**Preconditions:** 3 completed todos exist, toggle-all is checked
**Steps:**
1. Click the toggle-all checkbox

**Expected Result:** All todos are marked as active, all checkboxes are unchecked, counter updates

---

### TC-015: Todos persist after page refresh
**Priority:** High
**Preconditions:** 2 todos exist (1 active, 1 completed)
**Steps:**
1. Refresh the browser page

**Expected Result:** All todos remain with their completion state preserved

---

### TC-016: Items left counter grammar - singular
**Priority:** Medium
**Preconditions:** Exactly 1 active todo exists
**Steps:**
1. Observe the items left counter

**Expected Result:** Counter displays "1 item left" (singular)

---

### TC-017: Items left counter grammar - plural
**Priority:** Medium
**Preconditions:** 2 or more active todos exist
**Steps:**
1. Observe the items left counter

**Expected Result:** Counter displays "X items left" (plural)

---

## Negative Flows

### TC-018: Cannot add empty todo
**Priority:** High
**Preconditions:** Application is loaded
**Steps:**
1. Click on the input field
2. Press Enter without typing anything

**Expected Result:** No todo is created, list remains unchanged

---

### TC-019: Cannot add whitespace-only todo
**Priority:** High
**Preconditions:** Application is loaded
**Steps:**
1. Click on the input field
2. Type "     " (only spaces)
3. Press Enter

**Expected Result:** No todo is created, input is cleared

---

### TC-020: Cannot save empty edit
**Priority:** Medium
**Preconditions:** Todo "Buy groceries" exists
**Steps:**
1. Double-click on "Buy groceries"
2. Clear all text
3. Press Enter

**Expected Result:** Todo is deleted (standard TodoMVC behavior) OR edit is cancelled

---

### TC-021: Clear completed button not visible when no completed todos
**Priority:** Medium
**Preconditions:** Only active todos exist (no completed)
**Steps:**
1. Observe the footer area

**Expected Result:** "Clear completed" button is not visible

---

### TC-022: Footer not visible when no todos
**Priority:** Medium
**Preconditions:** Todo list is empty
**Steps:**
1. Observe the page

**Expected Result:** Footer with filters and counter is not visible

---

### TC-023: Main section not visible when no todos
**Priority:** Medium
**Preconditions:** Todo list is empty
**Steps:**
1. Observe the page

**Expected Result:** Main todo list section and toggle-all are not visible

---

## Edge Cases

### TC-024: Add todo with special characters
**Priority:** Medium
**Preconditions:** Application is loaded
**Steps:**
1. Enter "<script>alert('xss')</script>" and press Enter

**Expected Result:** Todo is created with literal text displayed (no script execution), characters are escaped properly

---

### TC-025: Add todo with very long text
**Priority:** Medium
**Preconditions:** Application is loaded
**Steps:**
1. Enter a string of 500 characters
2. Press Enter

**Expected Result:** Todo is created, text may be truncated in display or wrapped appropriately

---

### TC-026: Add todo with unicode/emoji characters
**Priority:** Low
**Preconditions:** Application is loaded
**Steps:**
1. Enter "Buy groceries 🛒✅" and press Enter

**Expected Result:** Todo is created with emoji displayed correctly

---

### TC-027: Add todo with leading/trailing whitespace
**Priority:** Medium
**Preconditions:** Application is loaded
**Steps:**
1. Enter "   Buy groceries   " and press Enter

**Expected Result:** Todo is created with trimmed text "Buy groceries"

---

### TC-028: Add duplicate todo
**Priority:** Low
**Preconditions:** Todo "Buy groceries" exists
**Steps:**
1. Enter "Buy groceries" and press Enter

**Expected Result:** Duplicate todo is created (duplicates are allowed)

---

### TC-029: Rapid toggle of completion state
**Priority:** Low
**Preconditions:** Todo "Buy groceries" exists
**Steps:**
1. Rapidly click the checkbox 10 times

**Expected Result:** Final state is consistent, no UI glitches

---

### TC-030: Navigate directly to filter URL
**Priority:** Medium
**Preconditions:** Todos exist
**Steps:**
1. Navigate directly to https://demo.playwright.dev/todomvc/#/active

**Expected Result:** Page loads with Active filter applied

---

### TC-031: Navigate to invalid filter URL
**Priority:** Low
**Preconditions:** Application is loaded
**Steps:**
1. Navigate to https://demo.playwright.dev/todomvc/#/invalid

**Expected Result:** Application handles gracefully, shows all todos or redirects to valid route

---

### TC-032: Delete todo while in filtered view
**Priority:** Medium
**Preconditions:** 1 completed todo exists, Completed filter is active
**Steps:**
1. Delete the completed todo

**Expected Result:** Todo is removed, if no more completed todos exist, list appears empty in Completed view

---

### TC-033: Complete todo while in Active filter
**Priority:** Medium
**Preconditions:** 1 active todo exists, Active filter is active
**Steps:**
1. Click checkbox to complete the todo

**Expected Result:** Todo disappears from Active view (since it's now completed)

---

### TC-034: localStorage cleared - todos should disappear
**Priority:** Low
**Preconditions:** Todos exist in the application
**Steps:**
1. Open browser DevTools
2. Clear localStorage
3. Refresh the page

**Expected Result:** Todo list is empty

---

### TC-035: Counter shows 0 items left
**Priority:** Medium
**Preconditions:** All todos are completed
**Steps:**
1. Observe the counter

**Expected Result:** Counter displays "0 items left"

---

---

## Ambiguities and Gaps in Requirements

1. **Maximum todo length:** No specification for maximum character limit for todo text
2. **Duplicate handling:** Not specified whether duplicate todos are allowed
3. **Edit behavior on empty:** Unclear if emptying a todo during edit deletes it or cancels edit
4. **Keyboard navigation:** No requirements for Tab/keyboard accessibility
5. **Mobile/touch support:** No specifications for touch interactions
6. **Error handling:** No requirements for handling localStorage quota exceeded
7. **Concurrent sessions:** Behavior when same todo list is open in multiple tabs not specified
8. **Performance:** No requirements for maximum number of todos supported
