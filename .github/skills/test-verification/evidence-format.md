# Test and Verification Evidence Format

This reference defines reusable evidence structures for Implementation,
Code Review, Verification, and Pull Request reporting.

---

# 1. Single Check Record

```text
Validation Category:
<UNIT_TEST / INTEGRATION_TEST / BUILD / etc.>

Scope:
<focused or full scope>

Command:
<actual command>

Command Source:
<package.json / Makefile / documentation / CI / other repository source>

Environment:
<only relevant environment information>

Result:
<PASS / FAIL / BLOCKED / NOT_APPLICABLE / NOT_VERIFIED>

Exit Status:
<actual status when available>

Tests / Assertions:
<actual counts when available>

Important Evidence:
<concise result>

Traceability:
<FR / BR / NFR / AC / TASK / CR / VR when applicable>

Notes:
<important limitation, rerun, warning, or context>
```

---

# 2. Test Suite Summary

Recommended table:

| Category | Scope | Command | Result | Evidence |
|---|---|---|---|---|
| Unit | Full | `<command>` | PASS | `<summary>` |
| Integration | Full | `<command>` | PASS | `<summary>` |
| Build | Full | `<command>` | PASS | `<summary>` |
| Typecheck | Full | `<command>` | PASS | `<summary>` |
| Lint | Full | `<command>` | PASS | `<summary>` |

Only include applicable checks.

---

# 3. Focused Implementation Evidence

Recommended structure:

```text
TASK:
TASK-###

Checks:

1. <category>
   Command:
   Result:
   Evidence:

2. <category>
   Command:
   Result:
   Evidence:

Task Verification:
PASS / FAIL / BLOCKED
```

Do not represent focused checks as full release Verification.

---

# 4. CR Remediation Evidence

```text
Finding:
CR-###

Focused Checks:

- Command:
- Scope:
- Result:
- Evidence:

Regression Checks:

- Command:
- Result:
- Evidence:

Implementation Remediation Result:
REMEDIATION_COMPLETE / BLOCKED
```

Code Review owns final CR resolution.

---

# 5. VR Remediation Evidence

```text
Finding:
VR-###

Related Verification Case:
VC-### / Not Applicable

Expected Outcome:
<from verification.md>

Focused Remediation Checks:

- Command:
- Scope:
- Result:
- Evidence:

Regression Checks:

- Command:
- Result:
- Evidence:

Implementation Remediation Result:
REMEDIATION_COMPLETE / BLOCKED
```

Verification owns final VR resolution.

---

# 6. Formal Verification Summary

Recommended structure:

```text
Unit Tests:
Result:
Command:
Evidence:

Integration Tests:
Result:
Command:
Evidence:

Build:
Result:
Command:
Evidence:

Type / Static Validation:
Result:
Command:
Evidence:

Security:
Result:
Command / Method:
Evidence:

Dependency Validation:
Result:
Command / Method:
Evidence:

Regression:
Result:
Command / Method:
Evidence:

Migration / Data:
Result:
Command / Method:
Evidence:

Acceptance Criteria:
Result:
Evidence:

Overall Technical Verification:
PASS / FAIL / BLOCKED / NOT_VERIFIED
```

Only applicable categories should be included.

---

# 7. Acceptance Criteria Evidence

Recommended table:

| Acceptance Criterion | Evidence Type | Command / Observation | Result |
|---|---|---|---|

Use one or more rows per AC when necessary.

---

# 8. Requirements Evidence

Recommended table:

| Requirement | Verification Evidence | Result |
|---|---|---|

Use the SDLC traceability skill to validate identifiers.

---

# 9. PR Test Evidence

The Pull Request should contain a concise summary, for example:

```text
Verification Status: VERIFICATION_PASSED

Unit Tests:
PASS — <actual summary>

Integration Tests:
PASS — <actual summary>

Build:
PASS — <actual summary>

Typecheck:
PASS — <actual summary>

Lint:
PASS — <actual summary>

Security / Dependency:
<actual result>

Additional Verification:
<actual result>
```

Do not copy large raw logs when a concise truthful summary is sufficient.

---

# 10. Failure Record

For a failing validation:

```text
Command:
<actual command>

Result:
FAIL

Failure:
<concise failing test/check>

Important Evidence:
<safe relevant error>

Affected Scope:
<component/task/requirement>

Rerun:
<not run / reproduced / inconsistent / passed after remediation>

Required Action:
<remediation or upstream escalation>
```

---

# 11. Blocked Record

```text
Check:
<required check>

Result:
BLOCKED

Reason:
<environment/service/tool prerequisite>

Evidence:
<safe factual evidence>

Required Prerequisite:
<what must become available>

Lifecycle Impact:
<determined by owning specialist>
```

Never rewrite BLOCKED as PASS.

---

# 12. Not Verified Record

```text
Check:
<check>

Result:
NOT_VERIFIED

Reason:
<why sufficient evidence could not be obtained>

Attempted Evidence:
<what was inspected or attempted>

Risk:
<what remains unknown>
```

---

# 13. Flaky Result Record

When a test has inconsistent outcomes:

```text
Check:
<check>

Run 1:
FAIL — <summary>

Run 2:
PASS — <summary>

Classification:
INTERMITTENT / FLAKY SUSPECTED

Conclusion:
Do not treat the initial failure as erased.

Required Follow-up:
<diagnosis/remediation decision>
```

---

# 14. Pre-existing Failure Record

```text
Check:
<check>

Result:
FAIL

Classification:
PRE_EXISTING

Evidence:
<why it predates the controlled change>

Current Change Impact:
<none / worsened / unknown>

Lifecycle Impact:
<determined by owning specialist>
```

---

# 15. Evidence Freshness Record

Where revision evidence matters:

```text
Evidence Revision:
<commit / working-tree baseline>

Current Revision:
<commit / candidate>

Freshness:
CURRENT / STALE / UNKNOWN
```

Use the Git baseline safety skill to determine freshness.

---

# 16. Evidence Quality Rules

Evidence must be:

- factual
- concise
- reproducible where practical
- associated with the correct candidate
- free of exposed secrets
- explicit about unavailable checks
- explicit about reruns and intermittent failures

Do not optimize evidence for appearance.

Optimize it for trustworthy review.