# Test Plan: Edit Program Feature (DS-2)

---

## 📋 Overview

| Item | Details |
|------|---------|
| **Feature** | Edit Program |
| **Ticket** | DS-2 |
| **Total Test Cases** | 15 |
| **Priority Breakdown** | High: 6 · Medium: 5 · Low: 4 |

---

## ✅ Positive Test Cases

### TC-001: Edit form opens with pre-populated data
| Field | Value |
|-------|-------|
| **Title** | Edit form displays current program data when opened |
| **Preconditions** | User is logged in; Program "Web Development 2026" exists |
| **Steps** | 1. Navigate to Programs page<br>2. Locate "Web Development 2026" in the list<br>3. Click the edit icon |
| **Expected Result** | Edit form/modal opens with Name, Description, and other fields pre-populated with current program data |
| **Priority** | High |

---

### TC-002: Successfully update program name
| Field | Value |
|-------|-------|
| **Title** | Program name updates successfully after edit |
| **Preconditions** | User is editing "Web Development 2026" |
| **Steps** | 1. Clear the Name field<br>2. Enter "Web Development 2026 - Updated"<br>3. Click Save |
| **Expected Result** | Modal closes; Program list immediately displays "Web Development 2026 - Updated" |
| **Priority** | High |

---

### TC-003: Unchanged fields are preserved after edit
| Field | Value |
|-------|-------|
| **Title** | Unmodified fields retain original values after save |
| **Preconditions** | Program exists with Name: "Test Program", Description: "Original description" |
| **Steps** | 1. Click edit icon on the program<br>2. Modify only the Description to "New description"<br>3. Click Save |
| **Expected Result** | Name remains "Test Program"; Only Description is updated to "New description" |
| **Priority** | High |

---

### TC-004: Edit program description only
| Field | Value |
|-------|-------|
| **Title** | Program description can be updated independently |
| **Preconditions** | Program "Web Development 2026" exists |
| **Steps** | 1. Open edit form for the program<br>2. Change Description to "Updated course description for 2026"<br>3. Click Save |
| **Expected Result** | Description updates successfully; Name and other fields unchanged |
| **Priority** | Medium |

---

### TC-005: Edit multiple fields simultaneously
| Field | Value |
|-------|-------|
| **Title** | Multiple fields can be updated in a single edit |
| **Preconditions** | Program exists with initial values |
| **Steps** | 1. Open edit form<br>2. Change Name to "New Program Name"<br>3. Change Description to "New Description"<br>4. Click Save |
| **Expected Result** | All modified fields are updated; Modal closes; List reflects changes |
| **Priority** | Medium |

---

### TC-006: Cancel edit without saving
| Field | Value |
|-------|-------|
| **Title** | Canceling edit preserves original program data |
| **Preconditions** | Program "Web Development 2026" exists |
| **Steps** | 1. Open edit form<br>2. Change Name to "Modified Name"<br>3. Click Cancel (or close modal) |
| **Expected Result** | Modal closes; Program name remains "Web Development 2026" (unchanged) |
| **Priority** | Medium |

---

## ❌ Negative Test Cases

### TC-007: Reject empty program name
| Field | Value |
|-------|-------|
| **Title** | Edit fails when program name is cleared |
| **Preconditions** | User is editing an existing program |
| **Steps** | 1. Open edit form<br>2. Clear the Name field completely<br>3. Click Save |
| **Expected Result** | Form displays validation error; Save is blocked; Modal remains open |
| **Priority** | High |

---

### TC-008: Reject whitespace-only program name
| Field | Value |
|-------|-------|
| **Title** | Edit fails when name contains only spaces |
| **Preconditions** | User is editing an existing program |
| **Steps** | 1. Open edit form<br>2. Enter "     " (spaces only) in Name field<br>3. Click Save |
| **Expected Result** | Form rejects submission; Validation error displayed |
| **Priority** | High |

---

### TC-009: Reject duplicate program name
| Field | Value |
|-------|-------|
| **Title** | Cannot rename program to an existing program name |
| **Preconditions** | Programs "Program A" and "Program B" exist |
| **Steps** | 1. Open edit form for "Program B"<br>2. Change Name to "Program A"<br>3. Click Save |
| **Expected Result** | Error message: "Program name already exists"; Save is blocked |
| **Priority** | High |

---

### TC-010: Edit icon not visible for unauthorized users
| Field | Value |
|-------|-------|
| **Title** | Users without edit permissions cannot see edit icon |
| **Preconditions** | User is logged in with read-only permissions |
| **Steps** | 1. Navigate to Programs page<br>2. Locate any program |
| **Expected Result** | Edit icon is not displayed for the user |
| **Priority** | Medium |

---

## 🔶 Edge Cases

### TC-011: Edit program name with special characters
| Field | Value |
|-------|-------|
| **Title** | Program name accepts special characters |
| **Preconditions** | User is editing an existing program |
| **Steps** | 1. Open edit form<br>2. Change Name to "Développement & IA - Niveau 2"<br>3. Click Save |
| **Expected Result** | Program saves successfully with special characters intact |
| **Priority** | Medium |

---

### TC-012: Edit program name at maximum length
| Field | Value |
|-------|-------|
| **Title** | Program name accepts maximum allowed characters |
| **Preconditions** | Maximum name length is 255 characters |
| **Steps** | 1. Open edit form<br>2. Enter a 255-character name<br>3. Click Save |
| **Expected Result** | Program saves successfully with full 255-character name |
| **Priority** | Low |

---

### TC-013: Edit program name exceeding maximum length
| Field | Value |
|-------|-------|
| **Title** | Program name is rejected when exceeding max length |
| **Preconditions** | Maximum name length is 255 characters |
| **Steps** | 1. Open edit form<br>2. Attempt to enter 256+ characters in Name<br>3. Click Save |
| **Expected Result** | Input is truncated OR validation error is displayed |
| **Priority** | Low |

---

### TC-014: Edit form handles leading/trailing whitespace
| Field | Value |
|-------|-------|
| **Title** | Leading and trailing whitespace is trimmed from name |
| **Preconditions** | User is editing an existing program |
| **Steps** | 1. Open edit form<br>2. Enter "  Web Development  " (with spaces)<br>3. Click Save |
| **Expected Result** | Name is saved as "Web Development" (trimmed) |
| **Priority** | Low |

---

### TC-015: Concurrent edit conflict handling
| Field | Value |
|-------|-------|
| **Title** | System handles concurrent edits gracefully |
| **Preconditions** | Two users are editing the same program simultaneously |
| **Steps** | 1. User A opens edit form for "Program X"<br>2. User B opens edit form for "Program X"<br>3. User A saves changes<br>4. User B attempts to save changes |
| **Expected Result** | User B receives conflict warning or error; Data integrity is maintained |
| **Priority** | Low |

---

## ⚠️ Ambiguities & Gaps in Acceptance Criteria

| # | Issue | Recommendation |
|---|-------|----------------|
| 1 | **Maximum field lengths not specified** | Define max character limits for Name and Description |
| 2 | **Required fields not listed** | Clarify which fields are mandatory |
| 3 | **Duplicate name handling not defined** | Specify error behavior for duplicate names |
| 4 | **Cancel/close behavior not specified** | Define what happens when user closes modal without saving |
| 5 | **Permission requirements not stated** | Clarify who can edit programs (roles/permissions) |
| 6 | **Concurrent edit handling not addressed** | Define behavior when multiple users edit same program |
