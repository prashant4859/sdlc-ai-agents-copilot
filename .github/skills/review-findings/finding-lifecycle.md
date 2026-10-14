# Review Finding Lifecycle

This document defines the canonical finding state machine shared by Design
Review, Code Review, and Verification.

---

# 1. Canonical State Machine

```text
Finding identified
       │
       ▼
AWAITING_DECISION
       │
       ├──────── REJECTED ────────► CLOSED_REJECTED
       │
       ├──────── DEFERRED ────────► DEFERRED
       │
       └──────── ACCEPTED
                     │
                     ├── no change required
                     │       │
                     │       ▼
                     │    RESOLVED
                     │
                     └── change required
                             │
                             ▼
                    REMEDIATION_REQUIRED
                             │
                             ▼
                      remediation owner
                             │
                             ▼
                      READY_FOR_REREVIEW
                             │
                             ▼
                     independent reviewer
                         /           \
                        /             \
                 sufficient        insufficient
                    │                  │
                    ▼                  ▼
                RESOLVED      REMEDIATION_REQUIRED
```

---

# 2. Decision / Status Matrix

| Decision | Change Required | Valid Status |
|---|---:|---|
| PENDING | Unknown | AWAITING_DECISION |
| ACCEPTED | YES | REMEDIATION_REQUIRED |
| ACCEPTED | NO | RESOLVED after agreed action is complete |
| REJECTED | YES/NO | CLOSED_REJECTED |
| DEFERRED | YES/NO | DEFERRED |

Do not use:

`Decision: ACCEPTED`

with:

`Status: RESOLVED`

when required remediation has not yet been independently checked.

---

# 3. DR Lifecycle

```text
DR-###
  │
  ├── Decision: REJECTED
  │       └── CLOSED_REJECTED
  │
  ├── Decision: DEFERRED
  │       └── DEFERRED
  │
  └── Decision: ACCEPTED
          │
          ├── Architecture Change Required: NO
          │       └── Design Review determines completion
          │
          └── Architecture Change Required: YES
                  │
                  ▼
          REMEDIATION_REQUIRED
                  │
                  ▼
           Architecture Agent
                  │
                  ▼
          READY_FOR_REREVIEW
                  │
                  ▼
          Design Review Agent
                  │
                  ▼
               RESOLVED
```

The Architecture Agent never self-resolves DR findings.

---

# 4. CR Lifecycle

```text
CR-###
  │
  ├── Decision: REJECTED
  │       └── CLOSED_REJECTED
  │
  ├── Decision: DEFERRED
  │       └── DEFERRED
  │
  └── Decision: ACCEPTED
          │
          ├── Code Change Required: NO
          │       └── Code Review determines completion
          │
          └── Code Change Required: YES
                  │
                  ▼
          REMEDIATION_REQUIRED
                  │
                  ▼
          Implementation Agent
                  │
                  ▼
          READY_FOR_REREVIEW
                  │
                  ▼
           Code Review Agent
                  │
                  ▼
               RESOLVED
```

The Implementation Agent never self-resolves CR findings.

---

# 5. VR Lifecycle

```text
VR-###
   │
   ├── governed non-remediation outcome where explicitly allowed
   │
   └── REMEDIATION_REQUIRED
              │
              ▼
       Remediation Owner
              │
              ▼
       focused remediation
              │
              ▼
      Code Review if tracked
      implementation changed
              │
              ▼
        Verification Agent
              │
          /         \
         /           \
      passes        fails
        │             │
        ▼             ▼
    RESOLVED   REMEDIATION_REQUIRED
```

The Implementation Agent never self-resolves VR findings.

---

# 6. Design Review Ownership

Finding creator:

`design-review`

Typical remediation owner:

`architecture`

Resolution owner:

`design-review`

---

# 7. Code Review Ownership

Finding creator:

`code-review`

Typical remediation owner:

`implementation`

Resolution owner:

`code-review`

---

# 8. Verification Ownership

Finding creator:

`verification`

Possible remediation owners include:

- implementation
- requirements
- architecture
- implementation-planning
- environment/human prerequisite

Resolution owner:

`verification`

---

# 9. Severity and Blocking

| Severity | Default Blocking Expectation |
|---|---|
| CRITICAL | Always blocks |
| HIGH | Normally blocks |
| MEDIUM | Specialist/governance decision |
| LOW | Normally non-blocking |
| INFO | Non-blocking |

A lower severity may still block when it prevents required evidence.

Example:

A MEDIUM test-environment problem may block Verification if a mandatory
integration test cannot run.

---

# 10. New Finding During Re-review

If re-review discovers a separate defect:

retain the original finding.

Create a new identifier.

Example:

CR-003 authorization defect is fixed.

During re-review, an unrelated SQL injection defect is found.

Result:

CR-003 → RESOLVED

CR-004 → new finding

Do not rewrite CR-003.

---

# 11. Failed Remediation

If remediation does not satisfy the original required outcome:

retain the same finding ID.

Example:

CR-003 remains:

`REMEDIATION_REQUIRED`

Add re-review evidence describing what remains.

Do not create CR-004 simply because CR-003 was not fixed correctly.

---

# 12. Rejected Findings

Rejected findings remain part of lifecycle history.

Required minimum:

```text
Finding ID: CR-###
Decision: REJECTED
Status: CLOSED_REJECTED
Rationale: <recorded rationale>
```

Do not delete them.

---

# 13. Deferred Findings

Deferred findings remain visible as residual risk.

Required minimum:

```text
Finding ID: DR/CR/VR-###
Decision: DEFERRED
Status: DEFERRED
Rationale: <reason>
Residual Risk: <risk>
```

Where materially relevant, later phases should carry the deferred risk forward.

---

# 14. Remediation Evidence

Recommended remediation evidence includes:

- finding ID
- affected requirement
- task
- files/architecture sections changed
- focused checks
- result
- upstream escalation if any

The remediation owner records work completed.

The reviewer records whether it was sufficient.

---

# 15. Illegal Transitions

Examples of invalid transitions:

```text
AWAITING_DECISION
→ RESOLVED
```

without a required human decision.

```text
REMEDIATION_REQUIRED
→ RESOLVED
```

performed by the remediation owner when independent re-review is required.

```text
DEFERRED
→ REMEDIATION_REQUIRED
```

without a valid governance decision.

```text
CLOSED_REJECTED
→ RESOLVED
```

without new governed reconsideration.

---

# 16. Accepted Is Not Resolved

This rule applies across all finding types:

```text
ACCEPTED ≠ RESOLVED
```

Accepted means:

the finding disposition has been agreed.

Resolved means:

the required outcome has been independently confirmed.

Never collapse these states.

---

# 17. Finding History Model

A complete audit trail should allow reconstruction of:

```text
Finding
→ Evidence
→ Severity
→ Human Decision
→ Remediation Owner
→ Remediation
→ Re-review
→ Final Status
```

Do not overwrite history in a way that prevents this reconstruction.

---

# 18. Re-review Result Template

Recommended structure:

```text
Finding:
DR/CR/VR-###

Previous Status:
REMEDIATION_REQUIRED

Remediation Reviewed:
<summary>

Evidence:
<actual evidence>

Required Outcome:
<expected outcome>

Observed Outcome:
<observed result>

Result:
PASS / FAIL

Final Finding Status:
RESOLVED / REMEDIATION_REQUIRED
```

---

# 19. Finding Integrity Check

Before approving a review phase confirm:

- all CRITICAL findings have final governed disposition
- no unresolved blocking HIGH remains
- accepted required changes were independently re-reviewed
- rejected findings retain rationale
- deferred findings retain residual risk
- no finding was silently deleted
- finding IDs remain permanent
- no remediation owner self-approved its own required independent resolution

---

# 20. Governing Principle

Review independence must survive remediation.

The actor who makes the correction is not automatically the actor who proves
the correction is sufficient.