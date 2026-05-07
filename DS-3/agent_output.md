# Test Plan: Program Name Validation Feature (DS-3)

---

## 📋 Overview

| Item | Details |
|------|---------|
| **Feature** | Program Name Validation |
| **Ticket** | DS-3 |
| **Total Test Cases** | 16 |
| **Priority Breakdown** | High: 5 · Medium: 6 · Low: 5 |

---

## ✅ Positive Test Cases

### TC-001: Create program with valid name
| Field | Value |
|-------|-------|
| **Title** | Program is created with a valid alphanumeric name |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Enter "Web Development 2026" as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Program is created successfully; Appears in program list |
| **Priority** | High |

---

### TC-002: Create program with special characters in name
| Field | Value |
|-------|-------|
| **Title** | Program name accepts special characters |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Enter "Informatique & IA - Niveau 2" as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Program is created successfully with special characters intact |
| **Priority** | High |

---

### TC-003: Create program with accented characters
| Field | Value |
|-------|-------|
| **Title** | Program name accepts accented and international characters |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Enter "Développement Économique" as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Program is created successfully with accented characters preserved |
| **Priority** | Medium |

---

### TC-004: Create program with numbers in name
| Field | Value |
|-------|-------|
| **Title** | Program name accepts numeric characters |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Enter "Program 101 - Fall 2026" as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Program is created successfully |
| **Priority** | Medium |

---

### TC-005: Create program with hyphen and underscore
| Field | Value |
|-------|-------|
| **Title** | Program name accepts hyphens and underscores |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Enter "Web_Dev-2026_Advanced" as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Program is created successfully |
| **Priority** | Low |

---

## ❌ Negative Test Cases

### TC-006: Reject empty program name
| Field | Value |
|-------|-------|
| **Title** | Form rejects submission with empty program name |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Leave program name field empty<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Form is not submitted; Validation error displayed: "Program name is required" |
| **Priority** | High |

---

### TC-007: Reject whitespace-only program name
| Field | Value |
|-------|-------|
| **Title** | Form rejects name containing only whitespace |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Enter "     " (spaces only) as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Name is trimmed and treated as empty; Form is not submitted; Validation error displayed |
| **Priority** | High |

---

### TC-008: Reject duplicate program name (exact match)
| Field | Value |
|-------|-------|
| **Title** | Cannot create program with existing name |
| **Preconditions** | Program "Web Development 2026" already exists |
| **Steps** | 1. Enter "Web Development 2026" as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Error displayed: "Program name already exists"; Form is not submitted |
| **Priority** | High |

---

### TC-009: Reject duplicate program name (case-insensitive)
| Field | Value |
|-------|-------|
| **Title** | Duplicate check is case-insensitive |
| **Preconditions** | Program "Web Development 2026" already exists |
| **Steps** | 1. Enter "WEB DEVELOPMENT 2026" as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Error displayed: "Program name already exists" (case-insensitive match) |
| **Priority** | Medium |

---

### TC-010: Reject duplicate with leading/trailing spaces
| Field | Value |
|-------|-------|
| **Title** | Duplicate check ignores leading/trailing whitespace |
| **Preconditions** | Program "Web Development 2026" already exists |
| **Steps** | 1. Enter "  Web Development 2026  " as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Error displayed: "Program name already exists" (trimmed match) |
| **Priority** | Medium |

---

### TC-011: Reject name exceeding maximum length
| Field | Value |
|-------|-------|
| **Title** | Form rejects name exceeding maximum character limit |
| **Preconditions** | Maximum name length is 255 characters |
| **Steps** | 1. Enter a 300-character program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Input is truncated OR validation error is displayed |
| **Priority** | Medium |

---

## 🔶 Edge Cases

### TC-012: Create program with single character name
| Field | Value |
|-------|-------|
| **Title** | Program name accepts minimum valid length (1 character) |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Enter "A" as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Program is created successfully |
| **Priority** | Low |

---

### TC-013: Create program with maximum length name
| Field | Value |
|-------|-------|
| **Title** | Program name accepts exactly maximum characters |
| **Preconditions** | Maximum name length is 255 characters |
| **Steps** | 1. Enter a 255-character program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Program is created successfully with full 255-character name |
| **Priority** | Low |

---

### TC-014: Handle name with emoji characters
| Field | Value |
|-------|-------|
| **Title** | System handles emoji characters appropriately |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Enter "Web Development 🚀 2026" as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Program is created with emoji OR validation error is displayed (based on requirements) |
| **Priority** | Low |

---

### TC-015: Handle name with HTML/script tags
| Field | Value |
|-------|-------|
| **Title** | System sanitizes or rejects HTML/script input |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Enter "\<script>alert('test')\</script>" as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Input is sanitized OR rejected; No XSS vulnerability |
| **Priority** | Medium |

---

### TC-016: Leading/trailing whitespace is trimmed
| Field | Value |
|-------|-------|
| **Title** | Program name is saved without leading/trailing spaces |
| **Preconditions** | User is on the program creation form |
| **Steps** | 1. Enter "  Web Development 2026  " as the program name<br>2. Fill all other required fields<br>3. Click Create |
| **Expected Result** | Program is created with name "Web Development 2026" (trimmed) |
| **Priority** | Low |

---

## ⚠️ Ambiguities & Gaps in Acceptance Criteria

| # | Issue | Recommendation |
|---|-------|----------------|
| 1 | **Case sensitivity not defined** | Clarify if "Program A" and "PROGRAM A" are considered duplicates |
| 2 | **Maximum name length not specified** | Define the maximum character limit for program names |
| 3 | **Minimum name length not specified** | Define if single-character names are allowed |
| 4 | **Allowed character set not defined** | Specify which special characters are permitted (emoji, unicode, etc.) |
| 5 | **Error message wording not specified** | Define exact error messages for each validation failure |
| 6 | **"Other required fields" not listed** | Specify what other fields are required for program creation |
| 7 | **XSS/injection handling not addressed** | Define how malicious input should be handled |
