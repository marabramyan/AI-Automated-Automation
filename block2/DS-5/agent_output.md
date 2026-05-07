# Test Plan: Display Program List Feature (DS-5)

---

## 📋 Overview

| Item | Details |
|------|---------|
| **Feature** | Display Program List |
| **Ticket** | DS-5 |
| **Total Test Cases** | 15 |
| **Priority Breakdown** | High: 4 · Medium: 6 · Low: 5 |

---

## ✅ Positive Test Cases

### TC-001: Display program list with name and description
| Field | Value |
|-------|-------|
| **Title** | Program list displays all programs with key details |
| **Preconditions** | Multiple programs exist in the system |
| **Steps** | 1. Log in to the application<br>2. Navigate to the Programs page |
| **Expected Result** | List displays showing each program's Name and Description |
| **Priority** | High |

---

### TC-002: Empty state displays when no programs exist
| Field | Value |
|-------|-------|
| **Title** | Empty state message shown when program list is empty |
| **Preconditions** | No programs exist in the system |
| **Steps** | 1. Navigate to the Programs page |
| **Expected Result** | Message displayed: "No programs have been created"; Prompt to create first program is visible |
| **Priority** | High |

---

### TC-003: Create program prompt in empty state
| Field | Value |
|-------|-------|
| **Title** | Empty state includes actionable prompt to create program |
| **Preconditions** | No programs exist in the system |
| **Steps** | 1. Navigate to the Programs page<br>2. Observe the empty state |
| **Expected Result** | "Create your first program" button/link is displayed and clickable |
| **Priority** | High |

---

### TC-004: Display single program in list
| Field | Value |
|-------|-------|
| **Title** | List correctly displays when only one program exists |
| **Preconditions** | One program "Web Development 2026" exists |
| **Steps** | 1. Navigate to the Programs page |
| **Expected Result** | Single program displayed with Name and Description |
| **Priority** | Medium |

---

### TC-005: Display multiple programs in list
| Field | Value |
|-------|-------|
| **Title** | List displays all programs when multiple exist |
| **Preconditions** | Programs "Program A", "Program B", "Program C" exist |
| **Steps** | 1. Navigate to the Programs page |
| **Expected Result** | All three programs displayed with their Names and Descriptions |
| **Priority** | Medium |

---

### TC-006: Program with special characters displays correctly
| Field | Value |
|-------|-------|
| **Title** | Special characters render properly in program list |
| **Preconditions** | Program "Développement & IA - Niveau 2" exists |
| **Steps** | 1. Navigate to the Programs page |
| **Expected Result** | Program name displays with special characters and accents intact |
| **Priority** | Medium |

---

### TC-007: List updates after creating new program
| Field | Value |
|-------|-------|
| **Title** | Newly created program appears in list immediately |
| **Preconditions** | User is on Programs page; Some programs may exist |
| **Steps** | 1. Create a new program "New Test Program"<br>2. Return to/refresh the Programs page |
| **Expected Result** | "New Test Program" appears in the list with its description |
| **Priority** | Medium |

---

## ❌ Negative Test Cases

### TC-008: Unauthorized user cannot access program list
| Field | Value |
|-------|-------|
| **Title** | Unauthenticated users are redirected from Programs page |
| **Preconditions** | User is not logged in |
| **Steps** | 1. Attempt to navigate directly to Programs page URL |
| **Expected Result** | User is redirected to login page OR access denied message displayed |
| **Priority** | High |

---

### TC-009: Handle server error gracefully
| Field | Value |
|-------|-------|
| **Title** | Error message displayed when program list fails to load |
| **Preconditions** | Server/API is temporarily unavailable |
| **Steps** | 1. Navigate to the Programs page |
| **Expected Result** | User-friendly error message displayed: "Unable to load programs. Please try again." |
| **Priority** | Medium |

---

### TC-010: Handle slow network connection
| Field | Value |
|-------|-------|
| **Title** | Loading indicator shown during slow data fetch |
| **Preconditions** | Network connection is slow |
| **Steps** | 1. Navigate to the Programs page |
| **Expected Result** | Loading spinner/indicator displayed while programs are being fetched |
| **Priority** | Medium |

---

## 🔶 Edge Cases

### TC-011: Display program with empty description
| Field | Value |
|-------|-------|
| **Title** | Program with no description displays gracefully |
| **Preconditions** | Program "Test Program" exists with empty description |
| **Steps** | 1. Navigate to the Programs page |
| **Expected Result** | Program displays with name; Description area is blank or shows placeholder text |
| **Priority** | Low |

---

### TC-012: Display program with very long name
| Field | Value |
|-------|-------|
| **Title** | Long program names are handled without breaking layout |
| **Preconditions** | Program with 200-character name exists |
| **Steps** | 1. Navigate to the Programs page |
| **Expected Result** | Name is truncated with ellipsis (...) OR wrapped; Layout remains intact |
| **Priority** | Low |

---

### TC-013: Display program with very long description
| Field | Value |
|-------|-------|
| **Title** | Long descriptions are handled without breaking layout |
| **Preconditions** | Program with 1000-character description exists |
| **Steps** | 1. Navigate to the Programs page |
| **Expected Result** | Description is truncated with ellipsis or "Read more" link; Layout remains intact |
| **Priority** | Low |

---

### TC-014: Large number of programs displays correctly
| Field | Value |
|-------|-------|
| **Title** | List handles large number of programs (pagination/scrolling) |
| **Preconditions** | 100+ programs exist in the system |
| **Steps** | 1. Navigate to the Programs page |
| **Expected Result** | Programs display with pagination OR infinite scroll; Performance is acceptable |
| **Priority** | Low |

---

### TC-015: Program list is sorted consistently
| Field | Value |
|-------|-------|
| **Title** | Programs are displayed in a consistent order |
| **Preconditions** | Multiple programs exist |
| **Steps** | 1. Navigate to Programs page<br>2. Note the order<br>3. Refresh page |
| **Expected Result** | Programs appear in same order (alphabetical, by date, or other defined sort) |
| **Priority** | Low |

---

## ⚠️ Ambiguities & Gaps in Acceptance Criteria

| # | Issue | Recommendation |
|---|-------|----------------|
| 1 | **Sort order not specified** | Define how programs are sorted (alphabetical, by creation date, etc.) |
| 2 | **Pagination not addressed** | Specify behavior when many programs exist (pagination, infinite scroll, etc.) |
| 3 | **Empty description handling not defined** | Clarify display when program has no description |
| 4 | **Truncation rules not specified** | Define max display length for name/description in list view |
| 5 | **Additional columns not mentioned** | Clarify if other fields should display (created date, status, etc.) |
| 6 | **Search/filter capability not addressed** | Specify if users can search or filter the program list |
| 7 | **Loading state not mentioned** | Define what user sees while program list is loading |
| 8 | **Error handling not specified** | Define behavior when program list fails to load |
| 9 | **Empty state message wording not defined** | Specify exact text for "no programs" message |
| 10 | **Responsive design not addressed** | Clarify how list displays on mobile/tablet devices |
