---
name: sdlc-governance
description: >
  Canonical governance rules for the controlled Agentic SDLC. Use this skill
  whenever determining lifecycle phase order, validating SDLC artifact gates,
  deciding whether a phase may advance, handling human approval gates,
  routing upstream changes, determining stale downstream phases, resolving
  artifact ownership, or deciding the next valid SDLC phase.
---

# Agentic SDLC Governance

This skill defines the shared lifecycle governance contract for the controlled
Agentic Software Development Life Cycle.

It does NOT replace specialist agent responsibilities.

It defines:

- lifecycle phase order
- authoritative artifacts
- phase success gates
- artifact ownership
- human approval gates
- escalation routing
- downstream invalidation
- stale-state behavior
- advancement rules

Specialist agents remain responsible for performing their own domain work.

---

# 1. Mandatory Lifecycle

The controlled lifecycle is:

`STEP 1 — REQUIREMENTS`

→

`STEP 2 — ARCHITECTURE`

→

`STEP 3 — DESIGN REVIEW`

→

`STEP 4 — IMPLEMENTATION PLANNING`

→

`STEP 5 — IMPLEMENTATION`

→

`STEP 6 — CODE REVIEW`

→

`STEP 7 — VERIFICATION`

→

`STEP 8 — PULL REQUEST`

No phase may be silently skipped.

---

# 2. Canonical Phase Gates

## Step 1 — Requirements

Authoritative artifact:

`<PROJECT_ROOT>/docs/sdlc/requirements.md`

Successful gate:

`Requirements Status: APPROVED`

---

## Step 2 — Architecture

Authoritative artifact:

`<PROJECT_ROOT>/docs/sdlc/architecture.md`

Initial successful architecture output:

`Architecture Status: READY_FOR_DESIGN_REVIEW`

After successful independent Design Review:

`Architecture Status: DESIGN_REVIEW_APPROVED`

---

## Step 3 — Design Review

Authoritative artifact:

`<PROJECT_ROOT>/docs/sdlc/design-review.md`

Successful gate:

`Design Review Status: DESIGN_REVIEW_APPROVED`

---

## Step 4 — Implementation Planning

Authoritative artifact:

`<PROJECT_ROOT>/docs/sdlc/impl-plan.md`

Technical planning gate:

`Implementation Plan Status: READY_FOR_IMPLEMENTATION`

Human execution authorization:

`Implementation Plan Approval: APPROVED`

Both are required before Step 5.

---

## Step 5 — Implementation

Authoritative execution evidence:

`<PROJECT_ROOT>/docs/sdlc/implementation-log.md`

Successful overall implementation state:

`Implementation Status: READY_FOR_CODE_REVIEW`

This is the correct terminal Step 5 state.

Do NOT require implementation-log.md to contain CODE_REVIEW_APPROVED.

Code Review approval belongs to Step 6.

---

## Step 6 — Code Review

Authoritative artifact:

`<PROJECT_ROOT>/docs/sdlc/code-review.md`

Successful gate:

`Code Review Status: CODE_REVIEW_APPROVED`

---

## Step 7 — Verification

Authoritative artifact:

`<PROJECT_ROOT>/docs/sdlc/verification.md`

Successful gate:

`Verification Status: VERIFICATION_PASSED`

---

## Step 8 — Pull Request

Authoritative outputs:

- repository changelog / release-note mechanism
- GitHub Pull Request

Successful state:

`PR Status: PR_CREATED`

or:

`PR Status: PR_UPDATED`

Final lifecycle state:

`Agentic SDLC Status: COMPLETE`

---

# 3. Artifact Ownership

Each governed artifact has exactly one owning specialist.

| Artifact | Owning Specialist |
|---|---|
| requirements.md | requirements |
| architecture.md | architecture |
| design-review.md | design-review |
| impl-plan.md | implementation-planning |
| implementation-log.md | implementation |
| code-review.md | code-review |
| verification.md | verification |
| changelog / release note | pr |
| Pull Request | pr |
| orchestration-state.md | sdlc-orchestrator |

An agent must not silently modify another specialist's authoritative artifact.

If another artifact requires a material correction:

route work to its owning specialist.

---

# 4. Project Root Rule

All lifecycle phases must operate against one canonical:

`PROJECT_ROOT`

For:

`NEW_PROJECT`

the project root is established during Requirements processing.

For:

`EXISTING_PROJECT`

reuse the existing project/repository root.

Do not create duplicate nested project directories.

All SDLC documents belong under:

`<PROJECT_ROOT>/docs/sdlc/`

unless a governed project convention explicitly says otherwise.

---

# 5. Source-of-Truth Rule

When determining lifecycle state:

prefer the authoritative specialist artifact over:

- agent prose summaries
- orchestration-state.md
- chat history
- implementation assumptions

Example:

If an agent says:

`CODE_REVIEW_APPROVED`

but code-review.md says:

`AWAITING_HUMAN_DECISIONS`

the Code Review gate is NOT approved.

The artifact wins.

Route back to the owning specialist.

---

# 6. Earliest Unsatisfied Gate

When starting or resuming the SDLC:

find the earliest mandatory lifecycle gate that is:

- missing
- incomplete
- inconsistent
- blocked
- stale

Resume from that phase.

Do not advance simply because a later artifact exists.

Example:

Requirements = APPROVED

Architecture = DESIGN_REVIEW_APPROVED

Design Review = DESIGN_REVIEW_APPROVED

Implementation Plan = READY_FOR_IMPLEMENTATION / APPROVED

Implementation = READY_FOR_CODE_REVIEW

Code Review = CODE_REVIEW_APPROVED

Verification = missing

Correct next phase:

`STEP 7 — VERIFICATION`

---

# 7. Never Skip Forward

A later successful artifact does not override an invalid earlier gate.

Example:

verification.md says:

`VERIFICATION_PASSED`

but code-review.md does not contain:

`CODE_REVIEW_APPROVED`

Step 8 must NOT proceed.

Return to:

`STEP 6 — CODE REVIEW`

or the earlier invalid phase.

---

# 8. Human Decision Rule

Never fabricate a human decision.

Human input is mandatory when the owning specialist requires an explicit
decision.

Examples include:

- requirement clarification
- Requirements approval
- material architecture question
- Design Review finding disposition
- implementation-planning question
- Implementation Plan approval
- Code Review finding disposition
- explicit governance exception
- external authentication or environment action requiring a human

Allowed reviewer decisions where applicable include:

`ACCEPTED`

`REJECTED`

`DEFERRED`

Silence is not approval.

---

# 9. Automatic Advancement

When:

- current phase gate is satisfied
- no human decision is pending
- no blocker exists
- no remediation is required
- no upstream artifact is stale

the lifecycle may advance automatically to the next phase.

Do not add unnecessary human gates between technically complete phases.

---

# 10. Requirements Change Routing

When a specialist reports:

`REQUIREMENTS_CHANGE_REQUIRED`

return ownership to:

`requirements`

A material Requirements change makes the following downstream states stale:

- Architecture
- Design Review
- Implementation Planning
- affected Implementation
- Code Review
- Verification
- PR readiness

Required lifecycle replay:

Requirements
→ Architecture
→ Design Review
→ Implementation Planning
→ Implementation
→ Code Review
→ Verification
→ PR

Only affected implementation work must be repeated when scope can be safely
identified.

---

# 11. Architecture Change Routing

When a specialist reports:

`ARCHITECTURE_CHANGE_REQUIRED`

return ownership to:

`architecture`

A material Architecture change makes stale:

- Design Review
- Implementation Planning
- affected Implementation
- Code Review
- Verification
- PR readiness

Required replay:

Architecture
→ Design Review
→ Implementation Planning
→ Implementation
→ Code Review
→ Verification
→ PR

---

# 12. Implementation Plan Change Routing

When a specialist reports:

`IMPLEMENTATION_PLAN_CHANGE_REQUIRED`

return ownership to:

`implementation-planning`

A material planning change makes stale:

- affected Implementation
- Code Review
- Verification
- PR readiness

Required replay:

Implementation Planning
→ Implementation
→ Code Review
→ Verification
→ PR

---

# 13. Implementation Change Invalidation

Any material tracked implementation change after Code Review approval may
invalidate:

`CODE_REVIEW_APPROVED`

and:

`VERIFICATION_PASSED`

Examples:

- production source
- persistent tests
- migrations
- dependency manifests
- runtime configuration
- security controls
- API behavior
- data behavior

Required flow:

Implementation
→ Code Review
→ Verification
→ PR

---

# 14. Code Review Remediation

Accepted Code Review findings requiring code changes must be remediated by:

`implementation`

The Code Review agent must independently re-review the change.

Required flow:

Code Review finding
→ Implementation remediation
→ Code Review re-review

The Implementation Agent must not mark a CR finding RESOLVED.

---

# 15. Verification Remediation

Verification findings owned by the Implementation Agent must be remediated by:

`implementation`

When remediation changes tracked implementation:

required flow is:

Verification finding
→ Implementation remediation
→ Code Review
→ Verification

The Implementation Agent must not mark a VR finding RESOLVED.

Verification independently determines resolution.

---

# 16. Design Review Remediation

Accepted Design Review findings requiring Architecture changes return to:

`architecture`

Required flow:

Design Review finding
→ Architecture remediation
→ Design Review re-review

The Architecture Agent must not independently declare the finding resolved.

---

# 17. Stale State

A phase is STALE when its previous result was produced against an upstream
baseline that has materially changed.

STALE is not equivalent to failure.

STALE means:

the phase must run again before its previous approval may be trusted.

Do not automatically rewrite another specialist's artifact merely to place a
STALE status inside it.

An orchestrator may record stale coordination state separately.

---

# 18. Contradictory Artifact State

If an authoritative artifact contains contradictory lifecycle status:

STOP forward progression.

Example:

Metadata:

`Code Review Status: AWAITING_HUMAN_DECISIONS`

Final Decision:

`CODE_REVIEW_APPROVED`

Do not choose the value that permits advancement.

Return the artifact to its owning specialist for reconciliation.

---

# 19. Specialist Stop Boundaries

Specialist execution limits remain mandatory.

Examples:

Implementation normal mode:

one `TASK-###` per invocation.

Code Review remediation:

one eligible `CR-###` per controlled remediation invocation unless explicitly
allowed by its specialist contract.

Verification remediation:

one eligible `VR-###` per controlled remediation invocation unless explicitly
allowed by its specialist contract.

The orchestrator may invoke the specialist repeatedly.

It must not ask a specialist to violate its own execution contract.

---

# 20. Blocked Is Not Passed

Never treat any of the following as PASS:

`BLOCKED`

`NOT_VERIFIED`

`CLARIFICATION_REQUIRED`

`AWAITING_HUMAN_DECISIONS`

`REMEDIATION_REQUIRED`

`REQUIREMENTS_CHANGE_REQUIRED`

`ARCHITECTURE_CHANGE_REQUIRED`

`IMPLEMENTATION_PLAN_CHANGE_REQUIRED`

Forward progression requires the actual phase success gate.

---

# 21. Governance Exceptions

A governance exception must be explicit.

Do not infer one.

An exception must identify:

- affected lifecycle rule
- reason
- approving authority or human decision where required
- residual risk
- effect on downstream gates

Do not use exceptions merely to bypass a failing phase.

---

# 22. PR Readiness

Step 8 may begin only when:

`Requirements Status: APPROVED`

`Architecture Status: DESIGN_REVIEW_APPROVED`

`Design Review Status: DESIGN_REVIEW_APPROVED`

`Implementation Plan Status: READY_FOR_IMPLEMENTATION`

`Implementation Plan Approval: APPROVED`

`Implementation Status: READY_FOR_CODE_REVIEW`

`Code Review Status: CODE_REVIEW_APPROVED`

`Verification Status: VERIFICATION_PASSED`

and the verified Git baseline remains current.

---

# 23. Final Lifecycle Completion

The Agentic SDLC is complete only when:

1. Requirements are APPROVED.
2. Architecture is DESIGN_REVIEW_APPROVED.
3. Design Review is DESIGN_REVIEW_APPROVED.
4. Implementation Plan is READY_FOR_IMPLEMENTATION.
5. Implementation Plan Approval is APPROVED.
6. Implementation is READY_FOR_CODE_REVIEW.
7. Code Review is CODE_REVIEW_APPROVED.
8. Verification is VERIFICATION_PASSED.
9. PR is PR_CREATED or PR_UPDATED.
10. no required human decision remains.
11. no blocking escalation remains.
12. no affected downstream approval is stale.

Final lifecycle state:

`Agentic SDLC Status: COMPLETE`

PR merge is outside this lifecycle unless a separately governed process is
explicitly introduced.

---

# 24. Non-Goals

This skill does NOT:

- analyze requirements
- design architecture
- perform Design Review
- create implementation tasks
- write production code
- perform Code Review
- perform Verification
- create a Pull Request
- merge code
- decide human approvals

Those responsibilities remain with their specialist agents.

This skill only governs lifecycle coordination and phase validity.