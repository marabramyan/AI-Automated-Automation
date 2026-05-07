# Test Plan: Delete Program Feature (DS-4)

---

## 📋 Overview

| Item | Details |
|------|---------|
| **Feature** | Delete Program |
| **Ticket** | DS-4 |
| **Total Test Cases** | 14 |
| **Priority Breakdown** | High: 5 · Medium: 5 · Low: 4 |

---

## ✅ Positive Test Cases

### TC-001: Delete program with confirmation
| Field | Value |
|-------|-------|
| **Title** | Program is deleted after user confirms deletion |
| **Preconditions** | Program "Test Program" exists in the system |
| **Steps** | 1. Navigate to Programs page<br>2. Locate "Test Program" in the list<br>3. Click the delete icon<br>4. Confirmation dialog appears<br>5. Click Confirm/Delete |
| **Expected Result** | Dialog closes; "Test Program" is immediately removed from the program list |
| **Priority** | High |

---

### TC-002: Confirmation dialog displays on delete click
| Field | Value |
|-------|-------|
| **Title** | Confirmation dialog appears before program deletion |
| **Preconditions** | Program "Test Program" exists in the system |
| **Steps** | 1. Navigate to Programs page<br>2. Click the delete icon for "Test Program" |
| **Expected Result** | Confirmation dialog is displayed with program name and confirm/cancel options |
| **Priority** | High |

---

### TC-003: Cancel deletion preserves program
| Field | Value |
|-------|-------|
| **Title** | Program remains in list when deletion is cancelled |
| **Preconditions** | Program "Test Program" exists in the system |
| **Steps** | 1. Click the delete icon for "Test Program"<br>2. Confirmation dialog appears<br>3. Click Cancel |
| **Expected Result** | Dialog closes; "Test Program" still exists in the program list |
| **Priority** | High |

---

### TC-004: Close dialog preserves program
| Field | Value |
|-------|-------|
| **Title** | Program remains when dialog is closed without action |
| **Preconditions** | Program "Test Program" exists; Delete confirmation dialog is open |
| **Steps** | 1. Click the delete icon for "Test Program"<br>2. Confirmation dialog appears<br>3. Click the X button (close dialog) |
| **Expected Result** | Dialog closes; "Test Program" still exists in the program list |
| **Priority** | Medium |

---

### TC-005: Delete multiple programs sequentially
| Field | Value |
|-------|-------|
| **Title** | Multiple programs can be deleted one after another |
| **Preconditions** | Programs "Program A", "Program B", "Program C" exist |
| **Steps** | 1. Delete "Program A" (click delete → confirm)<br>2. Delete "Program B" (click delete → confirm)<br>3. Delete "Program C" (click delete → confirm) |
| **Expected Result** | All three programs are removed from the list |
| **Priority** | Medium |

---

### TC-006: Program list updates immediately after deletion
| Field | Value |
|-------|-------|
| **Title** | Program list refreshes without page reload after deletion |
| **Preconditions** | Program "Test Program" exists |
| **Steps** | 1. Delete "Test Program" and confirm<br>2. Observe the program list |
| **Expected Result** | List updates immediately; No page refresh required; "Test Program" no longer visible |
| **Priority** | Medium |

---

## ❌ Negative Test Cases

### TC-007: Deleted program cannot be accessed
| Field | Value |
|-------|-------|
| **Title** | Deleted program is no longer accessible via direct URL |
| **Preconditions** | Program "Test Program" existed with ID 123; Program was deleted |
| **Steps** | 1. Attempt to access /programs/123 directly via URL |
| **Expected Result** | 404 error OR redirect to programs list with "Program not found" message |
| **Priority** | High |

---

### TC-008: Delete icon not visible for unauthorized users
| Field | Value |
|-------|-------|
| **Title** | Users without delete permission cannot see delete icon |
| **Preconditions** | User is logged in with read-only permissions |
| **Steps** | 1. Navigate to Programs page<br>2. Locate any program |
| **Expected Result** | Delete icon is not displayed for the user |
| **Priority** | High |

---

### TC-009: Prevent accidental double-click deletion
| Field | Value |
|-------|-------|
| **Title** | Double-clicking delete does not skip confirmation |
| **Preconditions** | Program "Test Program" exists |
| **Steps** | 1. Rapidly double-click the delete icon for "Test Program" |
| **Expected Result** | Only one confirmation dialog appears; No unintended behavior |
| **Priority** | Medium |

---

### TC-010: Cannot delete already deleted program
| Field | Value |
|-------|-------|
| **Title** | System handles deletion of already-deleted program gracefully |
| **Preconditions** | Two users viewing same program; User A deletes program |
| **Steps** | 1. User A deletes "Test Program"<br>2. User B (stale view) clicks delete on "Test Program" |
| **Expected Result** | User B receives error message: "Program no longer exists" or similar |
| **Priority** | Medium |

---

## 🔶 Edge Cases

### TC-011: Delete program with special characters in name
| Field | Value |
|-------|-------|
| **Title** | Program with special characters can be deleted |
| **Preconditions** | Program "Développement & IA - Niveau 2" exists |
| **Steps** | 1. Click delete icon for the program<br>2. Confirm deletion |
| **Expected Result** | Program is deleted successfully; Confirmation dialog displays name correctly |
| **Priority** | Low |

---

### TC-012: Delete last remaining program
| Field | Value |
|-------|-------|
| **Title** | System handles deletion of the last program |
| **Preconditions** | Only one program "Final Program" exists in the system |
| **Steps** | 1. Click delete icon for "Final Program"<br>2. Confirm deletion |
| **Expected Result** | Program is deleted; Empty state message is displayed: "No programs exist" |
| **Priority** | Low |

---

### TC-013: Delete program with long name
| Field | Value |
|-------|-------|
| **Title** | Confirmation dialog handles long program names |
| **Preconditions** | Program with 200-character name exists |
| **Steps** | 1. Click delete icon for the program |
| **Expected Result** | Confirmation dialog displays properly (name truncated or wrapped); No UI breaking |
| **Priority** | Low |

---

### TC-014: Keyboard navigation for deletion
| Field | Value |
|-------|-------|
| **Title** | Confirmation dialog is accessible via keyboard |
| **Preconditions** | Delete confirmation dialog is open |
| **Steps** | 1. Press Tab to navigate between Cancel and Confirm buttons<br>2. Press Enter to select focused button<br>3. Press Escape |
| **Expected Result** | Tab navigates buttons; Enter activates focused button; Escape closes dialog (cancels) |
| **Priority** | Low |

---

## ⚠️ Ambiguities & Gaps in Acceptance Criteria

| # | Issue | Recommendation |
|---|-------|----------------|
| 1 | **Confirmation dialog content not specified** | Define exact message (e.g., "Are you sure you want to delete 'Program Name'?") |
| 2 | **Button labels not specified** | Clarify button text (e.g., "Delete" / "Cancel" vs "Yes" / "No") |
| 3 | **Cascade delete behavior not defined** | Specify what happens to related data (enrollments, courses, etc.) |
| 4 | **Undo/restore capability not addressed** | Define if soft delete or hard delete; Can deletion be undone? |
| 5 | **Permission requirements not stated** | Clarify who can delete programs (admin only? program owner?) |
| 6 | **Audit trail not mentioned** | Specify if deletion should be logged for audit purposes |
| 7 | **Bulk delete not addressed** | Clarify if multiple programs can be deleted at once |
| 8 | **Keyboard accessibility not specified** | Define keyboard navigation for confirmation dialog |
