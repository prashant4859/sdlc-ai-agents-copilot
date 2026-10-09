---
name: review-findings
description: >
  Shared finding-management rules for the controlled Agentic SDLC. Use this
  skill when creating, classifying, prioritizing, deciding, remediating,
  re-reviewing, resolving, rejecting, or deferring Design Review, Code Review,
  or Verification findings. Standardizes permanent IDs, severity, human
  decisions, finding statuses, remediation ownership, evidence requirements,
  re-review behavior, and blocking rules without replacing specialist domain
  judgment.
---

# Agentic SDLC Review Finding Management

This skill defines the shared lifecycle for structured findings across:

- Design Review
- Code Review
- Verification

It standardizes:

- finding identity
- severity
- evidence
- human decisions
- remediation state
- independent re-review
- resolution
- rejection
- deferral
- audit history

It does NOT decide whether something is:

- an architecture defect
- a code defect
- a verification failure

Those judgments remain with the owning specialist agent.

For the canonical state machine and decision matrix, also read:

`finding-lifecycle.md`

when detailed transition guidance is required.

---

# 1. Finding Namespaces

Each specialist owns its own finding namespace.

## Design Review

`DR-###`

Owned by:

`design-review`

## Code Review

`CR-###`

Owned by:

`code-review`

## Verification

`VR-###`

Owned by:

`verification`

Never create a finding using another specialist's namespace.

---

# 2. Permanent Identifier Rule

Finding IDs are permanent.

Once created:

- do not renumber
- do not reuse
- do not delete merely because resolved
- do not recycle rejected/deferred identifiers

Examples:

If:

`CR-003`

is rejected,

the next finding must not reuse CR-003.

Use the next available identifier.

Lifecycle history is more important than contiguous numbering.

---

# 3. One Finding, One Material Concern

A finding should represent one coherent material concern.

Avoid combining unrelated defects into a single finding.

Bad:

`CR-004 — validation, performance, logging, naming and database migration are all wrong`

Better:

separate independent material concerns into distinct findings.

However, do not artificially split one underlying defect into many findings
simply to increase finding count.

---

# 4. Evidence Requirement

Every material finding must be grounded in evidence.

Applicable evidence may include:

- approved requirement
- architecture section
- Architecture Decision
- source file
- code location
- test
- command output
- failed verification case
- observed result
- document content
- repository state

Do not create findings based only on vague preference.

---

# 5. Core Finding Structure

Every material finding should contain, as applicable:

- Finding ID
- Severity
- Category
- Requirement reference
- lifecycle references
- implementation / architecture location
- Finding
- Evidence
- Risk / Impact
- Recommendation or Required Outcome
- Decision
- Change Required?
- Remediation Owner
- Status

Specialist agents may add domain-specific fields.

---

# 6. Severity Vocabulary

Use exactly:

`CRITICAL`

`HIGH`

`MEDIUM`

`LOW`

`INFO`

Severity represents risk or impact.

It does NOT represent:

- reviewer confidence
- personal preference
- amount of code
- how difficult the fix is

---

# 7. CRITICAL

Use CRITICAL only for severe material risks such as:

- major security compromise
- destructive data loss
- severe compliance violation
- catastrophic correctness failure
- systemic release-blocking defect
- equivalent high-impact condition

CRITICAL findings block approval.

Do not defer CRITICAL findings merely to make a lifecycle phase pass.

---

# 8. HIGH

Use HIGH for material problems such as:

- major correctness defect
- authorization/security weakness
- significant reliability failure
- material architecture violation
- serious data-integrity risk
- major regression
- critical acceptance behavior missing

HIGH findings normally block approval until resolved.

Any exception must be explicitly governed.

---

# 9. MEDIUM

Use MEDIUM for meaningful defects or risks that:

- should generally be corrected
- materially reduce maintainability/reliability
- create moderate correctness risk
- create significant but non-critical test/documentation gaps

The owning specialist determines blocking behavior according to its contract.

---

# 10. LOW

Use LOW for limited-impact issues.

Examples:

- localized maintainability issue
- minor code clarity issue
- non-critical documentation weakness
- small improvement with limited operational risk

LOW findings should not be inflated into blocking findings without evidence.

---

# 11. INFO

Use INFO for:

- observations
- improvement opportunities
- non-blocking notes
- useful review context

INFO should not be used to hide an actual defect that warrants higher severity.

---

# 12. Human Decision Vocabulary

Where a human finding decision is required, use:

`PENDING`

`ACCEPTED`

`REJECTED`

`DEFERRED`

Do not invent additional decision states unless the specialist contract
explicitly requires them.

---

# 13. PENDING

`PENDING`

means:

a human disposition has not yet been recorded.

Do not infer acceptance from:

- silence
- later implementation activity
- passing tests
- reviewer comments
- agent assumptions

---

# 14. ACCEPTED

`ACCEPTED`

means:

the finding is agreed to be valid and the required disposition has been
approved.

ACCEPTED does NOT automatically mean:

`RESOLVED`

If implementation or architecture changes are still required, the finding
remains unresolved.

This distinction is mandatory.

---

# 15. REJECTED

`REJECTED`

means:

the human/governance decision determined that the finding will not be acted
upon as a valid required change.

Record:

- rationale
- decision
- final status

Do not delete the finding.

The expected terminal status is normally:

`CLOSED_REJECTED`

---

# 16. DEFERRED

`DEFERRED`

means:

the finding is accepted or acknowledged but intentionally postponed according
to an explicit governance decision.

Record:

- rationale
- residual risk
- scope of deferral
- any future action when known

Do not silently convert DEFERRED into RESOLVED.

A deferred finding remains a known residual risk.

---

# 17. Finding Status Vocabulary

Shared statuses are:

`OPEN`

`AWAITING_DECISION`

`REMEDIATION_REQUIRED`

`READY_FOR_REREVIEW`

`RESOLVED`

`CLOSED_REJECTED`

`DEFERRED`

Specialist agents may additionally have phase-level statuses.

Do not confuse:

`Finding Status`

with:

`Phase Status`

---

# 18. OPEN

Use:

`OPEN`

when a finding exists but has not yet reached a formal decision workflow.

Where the specialist immediately requires human disposition, it may move
directly to:

`AWAITING_DECISION`

---

# 19. AWAITING_DECISION

Use:

`AWAITING_DECISION`

when:

- the finding has been identified
- evidence is recorded
- human disposition is required
- no decision has been recorded yet

Do not remediate a human-decision finding while it remains
AWAITING_DECISION unless the governing workflow explicitly permits it.

---

# 20. REMEDIATION_REQUIRED

Use:

`REMEDIATION_REQUIRED`

when:

- Decision = ACCEPTED
- a material change is still required
- the finding has not been independently re-reviewed after that change

Examples:

DR finding requires architecture change.

CR finding requires code change.

VR finding requires implementation remediation.

---

# 21. READY_FOR_REREVIEW

Use:

`READY_FOR_REREVIEW`

when the remediation owner has completed the requested change and provided
sufficient evidence for the owning reviewer/verifier to evaluate it.

The remediation owner does not mark the finding RESOLVED.

---

# 22. RESOLVED

Use:

`RESOLVED`

only after the owning independent specialist verifies that:

- the required outcome was achieved
- sufficient evidence exists
- no blocking portion of the original finding remains

Examples:

Architecture Agent fixes DR-002.

Design Review Agent re-reviews and marks DR-002 RESOLVED.

Implementation Agent fixes CR-004.

Code Review Agent re-reviews and marks CR-004 RESOLVED.

Implementation Agent fixes VR-003.

Verification Agent re-verifies and marks VR-003 RESOLVED.

---

# 23. CLOSED_REJECTED

Use:

`CLOSED_REJECTED`

when:

`Decision: REJECTED`

The finding remains in history.

Do not remove it from the artifact.

---

# 24. DEFERRED Status

When:

`Decision: DEFERRED`

use:

`Status: DEFERRED`

unless the governing specialist contract defines a more specific accepted
deferred state.

Record residual risk.

Do not present deferred risk as resolved.

---

# 25. Change Required

Findings should explicitly state whether a governed artifact or implementation
change is required.

Typical fields may include:

Design Review:

`Architecture Change Required: YES / NO`

Code Review:

`Code Change Required: YES / NO`

Verification:

`Remediation Owner: Implementation Agent / other owner`

Do not infer remediation solely from severity.

---

# 26. Remediation Ownership

The agent that discovered a finding should normally NOT fix the thing it is
independently reviewing.

Canonical ownership:

## DR

Finding owner:

`design-review`

Remediation owner when Architecture change required:

`architecture`

Re-review owner:

`design-review`

## CR

Finding owner:

`code-review`

Remediation owner when implementation change required:

`implementation`

Re-review owner:

`code-review`

## VR

Finding owner:

`verification`

Common remediation owner:

`implementation`

Re-verification owner:

`verification`

Other upstream owners may apply where the finding reveals a Requirements,
Architecture, or Planning gap.

---

# 27. Independence Principle

A remediation owner must not independently declare the review finding resolved
when resolution belongs to another specialist.

Examples:

Architecture Agent MUST NOT mark DR-004 RESOLVED.

Implementation Agent MUST NOT mark CR-002 RESOLVED.

Implementation Agent MUST NOT mark VR-005 RESOLVED.

The owning reviewer/verifier independently determines resolution.

---

# 28. Remediation Handoff

A remediation handoff should preserve:

- Finding ID
- Severity
- Category
- applicable Requirement IDs
- applicable TASK IDs
- architecture references
- relevant review references
- affected files/areas
- problem
- required outcome
- verification expectation

Do not require the remediation owner to rediscover the finding from scratch.

---

# 29. Remediation Must Preserve Upstream Contracts

A remediation must not silently change:

- approved requirements
- approved architecture
- approved implementation scope
- verification expectation

If the finding cannot be resolved without changing an upstream governed
contract:

use the applicable escalation:

`REQUIREMENTS_CHANGE_REQUIRED`

`ARCHITECTURE_CHANGE_REQUIRED`

`IMPLEMENTATION_PLAN_CHANGE_REQUIRED`

Do not weaken the finding to avoid escalation.

---

# 30. Re-review Requirement

After remediation:

the owning independent specialist must re-evaluate the actual changed state.

Do not resolve based only on:

- remediation summary
- implementation-log claim
- architecture-agent claim
- developer statement

Inspect the relevant authoritative artifact, code, tests, or verification
evidence.

---

# 31. Re-review Outcomes

After re-review, a finding may become:

`RESOLVED`

or remain:

`REMEDIATION_REQUIRED`

If remediation exists but needs formal evaluation first:

`READY_FOR_REREVIEW`

may be used.

If remediation introduces a distinct new problem:

create a NEW finding ID.

Do not rewrite the original finding into a different issue.

---

# 32. Finding Scope Stability

The original finding should remain conceptually stable.

Do not change:

`CR-002`

from:

authorization bypass

into:

dependency vulnerability

during re-review.

Those are separate concerns.

Create a new CR identifier for the new defect.

---

# 33. Duplicate Findings

Before creating a new finding:

check whether the same material issue already exists.

If the same unresolved issue already exists:

update its evidence/status when appropriate.

Do not create duplicate findings simply because:

- a new review cycle ran
- a different file exposes the same root defect
- remediation failed

Create a new finding only for a materially distinct issue.

---

# 34. Recurrence After Resolution

If a previously resolved defect returns after a later material implementation
change:

preserve the original resolved finding.

Create a new finding if the recurrence represents a new lifecycle event.

Reference the previous finding when useful.

Do not reopen historical evidence in a way that obscures lifecycle history.

---

# 35. Blocking Rules

At minimum:

CRITICAL unresolved findings block phase approval.

Blocking HIGH findings block phase approval.

Accepted required remediation that has not been independently re-reviewed
blocks approval.

Material upstream gaps block approval.

The specialist contract may define additional blocking conditions.

---

# 36. Decision Does Not Override Evidence

A human decision changes finding disposition.

It does not change factual evidence.

For example:

A human may REJECT a Code Review finding.

Record that decision and rationale.

Do not rewrite the evidence to pretend the observed code was different.

---

# 37. Deferred Risk Reporting

Deferred findings must remain visible in:

- the owning review artifact
- downstream risk/limitation reporting where applicable
- PR Known Limitations when materially relevant

Do not hide accepted residual risk from later lifecycle phases.

---

# 38. Traceability

Use the repository's SDLC traceability rules when referencing:

- Requirements
- Architecture
- TASKs
- other review findings
- Verification Cases

Never invent references simply to populate finding fields.

---

# 39. Finding Quality

A high-quality finding answers:

1. What is wrong?
2. Where is the evidence?
3. Why does it matter?
4. What governed requirement/design/task is affected?
5. What outcome is required?
6. Who owns remediation?
7. What state is the finding currently in?

If those questions cannot be answered, improve the finding before treating it
as a formal material issue.

---

# 40. Recommendation Quality

Recommendations should define the required outcome.

Avoid over-prescribing implementation details when multiple valid solutions
exist.

Good:

`Enforce authorization before returning another user's profile data.`

Overly prescriptive without need:

`Create exactly a class called ProfileAuthorizationService with three methods
and place it in src/security/profile.ts.`

The remediation owner retains implementation-level design freedom within the
approved architecture.

---

# 41. Evidence Preservation

Keep enough evidence to understand why the finding existed.

Do not remove original evidence after remediation.

Re-review evidence should be added separately.

This preserves the lifecycle audit trail:

finding
→ decision
→ remediation
→ re-review
→ final status

---

# 42. Finding Summary Tables

When an artifact includes a findings table, recommended common fields are:

| Finding ID | Severity | Category | Finding | Decision | Change Required? | Status |
|---|---|---|---|---|---|---|

The specialist may include additional traceability columns.

Detailed finding sections may follow the summary.

---

# 43. Human Decision Recording

When a human decision occurs, record:

- Finding ID
- Decision
- rationale when relevant
- residual risk for deferred/rejected findings where appropriate

Do not invent decision-maker identity.

Do not infer decisions from chat silence.

---

# 44. Rejected Finding Reappearance

Do not repeatedly recreate the identical rejected finding without new material
evidence.

If new evidence materially changes risk:

create or reopen through the specialist's approved process and explain what
changed.

---

# 45. Deferred Finding Remediation

A previously DEFERRED finding may later return to remediation only through a
valid human/governance transition.

Do not silently change:

`DEFERRED`

to:

`REMEDIATION_REQUIRED`

without an explicit decision or applicable governing rule.

---

# 46. Upstream Gap Detection

Sometimes a review finding reveals that the defect is not properly owned by the
current phase.

Examples:

Code Review discovers missing business behavior in requirements.

Verification discovers an architecture limitation.

In such cases:

preserve the finding/evidence as appropriate

and invoke the SDLC governance escalation rule.

Do not force all defects into implementation remediation.

---

# 47. Phase Approval Integrity

A phase must not be marked approved merely because:

- all findings were assigned IDs
- all findings have decisions
- remediation was started
- remediation owner claims completion

Approval requires satisfaction of the owning specialist's final gate.

---

# 48. Audit History

Never erase lifecycle history merely to make the final artifact shorter.

Resolved, rejected, and deferred material findings remain visible.

The artifact may summarize older cycles, but the decisions must remain
auditable.

---

# 49. Finding Validation Procedure

When validating findings:

1. identify the owning specialist
2. verify namespace correctness
3. verify permanent ID uniqueness
4. verify severity
5. verify required fields
6. verify evidence
7. verify traceability references
8. verify human decision
9. verify status transition
10. verify remediation owner
11. verify independent re-review when RESOLVED
12. verify blocking findings are handled before phase approval

Do not modify the artifact unless the owning specialist has authority to do so.

---

# 50. Final Rule

A finding is not complete when somebody fixes something.

A finding is complete when:

`Issue identified`
→ `Evidence recorded`
→ `Decision governed`
→ `Remediation performed when required`
→ `Independent re-review performed`
→ `Final state recorded`

The distinction between:

`ACCEPTED`

and:

`RESOLVED`

must always be preserved.