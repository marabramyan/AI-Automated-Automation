---
name: jira-ticket-analyzer
description: Analyzes Jira tickets, compares them against test plans, identifies gaps, and creates/updates related bug tickets
version: 1.0.0
author: Marina Abramyan
triggers:
  - analyze jira ticket
  - compare tests with jira
  - create bugs from jira
  - validate test coverage
inputs:
  - name: ticket_key
    description: The Jira ticket key (e.g., DS-2)
    required: true
  - name: test_plan_path
    description: Path to the test plan document
    required: false
  - name: playwright_test_path
    description: Path to the Playwright test file
    required: false
outputs:
  - name: gap_analysis
    description: List of gaps found between ticket and tests
  - name: bug_tickets
    description: List of bug tickets created
tools:
  - mcp__atlassian__jira_get_issue
  - mcp__atlassian__jira_search
  - mcp__atlassian__jira_create_issue
  - mcp__atlassian__jira_create_issue_link
  - Read
  - Glob
  - Grep
---

# Jira Ticket Analyzer Skill

## Overview

This skill automates the analysis of Jira tickets against test plans and Playwright test suites. It identifies coverage gaps, missing test cases, and can automatically create bug tickets for issues found.

## Capabilities

1. **Retrieve Jira Ticket Data** - Fetches complete ticket information including description, acceptance criteria, comments, and linked issues

2. **Compare Against Test Plans** - Analyzes test plan documents to ensure all acceptance criteria are covered

3. **Validate Playwright Tests** - Checks that automated tests exist for all test cases in the plan

4. **Identify Gaps** - Reports missing test cases, untested scenarios, and coverage holes

5. **Create Bug Tickets** - Automatically creates Jira bug tickets for issues found during analysis, with proper linking to parent tickets

## Usage

### Basic Analysis
```
Analyze Jira ticket DS-2 and compare against the test plan
```

### Full Validation
```
Validate DS-2 tests from block2 against the Jira ticket and update if gaps found
```

### Create Bugs
```
Create bug tickets for DS-2 issues with my name Marina in the title
```

## Workflow

1. Fetch the Jira ticket using the provided key
2. Extract acceptance criteria and requirements
3. Locate related test plan and Playwright test files
4. Compare test coverage against requirements
5. Identify any gaps or missing test cases
6. Optionally create bug tickets for issues found
7. Link all created tickets to the parent story

## Example Output

```
Gap Analysis for DS-2:
- TC-010: Missing in Playwright (unauthorized user test)
- TC-013: Missing in Playwright (max length exceeded)
- TC-016-019: Missing robustness tests

Bugs Created:
- DS-46: Test execution failures
- DS-47: Duplicate name validation missing
- DS-48: Max length validation missing
```
