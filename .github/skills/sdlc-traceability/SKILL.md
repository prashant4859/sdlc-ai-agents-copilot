---
name: sdlc-traceability
description: >
  Canonical traceability rules for the controlled Agentic SDLC. Use this skill
  when creating, validating, or following relationships between source stories,
  requirements, acceptance criteria, architecture components and decisions,
  Design Review findings, implementation tasks, implementation evidence,
  Code Review findings, verification cases and findings, or Pull Request
  evidence. Ensures IDs remain valid, permanent, non-invented, and traceable
  across lifecycle phases.
---

# Agentic SDLC Traceability

This skill defines the shared traceability contract for the controlled Agentic
Software Development Life Cycle.

Its purpose is to preserve an auditable chain from source requirement through
architecture, implementation, review, verification, and Pull Request evidence.

The canonical lifecycle traceability chain is:

`Source Story`
→ `Requirements`
→ `Architecture`
→ `Design Review`
→ `Implementation Plan`
→ `Implementation`
→ `Code Review`
→ `Verification`
→ `Pull Request`

This skill does NOT perform specialist lifecycle work.

It defines how lifecycle artifacts reference one another.

For the canonical identifier schema and reference matrix, also read:

`traceability-schema.md`

when detailed ID relationships or output-table structure is required.

---

# 1. Core Traceability Principle

Never claim a lifecycle relationship that cannot be supported by an
authoritative artifact or actual implementation evidence.

Traceability must be:

- explicit
- stable
- verifiable
- non-invented
- bidirectionally understandable where practical

Prefer an honest missing relationship over fabricated traceability.

---

# 2. Canonical Delivery Chain

The primary delivery chain is:

`Source`
→ `FR / BR / NFR / AC`
→ `CMP / AD`
→ `DR`
→ `TASK`
→ `Code / Tests`
→ `CR`
→ `VC / VR`
→ `PR Evidence`

Not every item must necessarily have an identifier at every intermediate layer.

However, every material approved requirement must eventually have sufficient
implementation and verification evidence.

---

# 3. Requirement Identifiers

Canonical requirement identifiers include:

## Functional Requirements

`FR-###`

Example:

`FR-001`

## Business Rules

`BR-###`

Example:

`BR-004`

## Non-Functional Requirements

Use domain-specific prefixes.

Approved categories include:

`NFR-SEC-###`

`NFR-PERF-###`

`NFR-REL-###`

`NFR-OBS-###`

`NFR-ACC-###`

`NFR-MNT-###`

`NFR-COMP-###`

Examples:

`NFR-SEC-002`

`NFR-PERF-001`

## Acceptance Criteria

`AC-###`

Example:

`AC-007`

## Requirements Clarification Questions

`RQ-###`

Example:

`RQ-003`

RQ identifiers support requirements clarification.

They are not substitutes for approved requirements.

---

# 4. Architecture Identifiers

Canonical architecture identifiers include:

## Components

`CMP-###`

Example:

`CMP-002`

## Architecture Decisions

`AD-###`

Example:

`AD-005`

## Architecture Risks

`ARISK-###`

Example:

`ARISK-002`

## Architecture Questions

`AQ-###`

Example:

`AQ-001`

AQ identifiers represent unresolved architectural questions.

They are not architecture decisions.

---

# 5. Design Review Identifiers

Design Review findings use:

`DR-###`

Example:

`DR-004`

A DR finding should reference applicable:

- Requirement IDs
- CMP IDs
- AD IDs
- architecture sections

when those relationships genuinely exist.

Do not invent a requirement relationship merely because the finding is
architectural.

Use an explicit value such as:

`Not directly mapped`

when appropriate.

---

# 6. Implementation Planning Identifiers

Implementation tasks use:

`TASK-###`

Example:

`TASK-006`

Planning questions use:

`PQ-###`

Example:

`PQ-002`

Every material implementation TASK should identify applicable:

- Requirement IDs
- Acceptance Criteria
- CMP IDs
- AD IDs
- DR IDs

according to the approved plan.

Do not force irrelevant references.

---

# 7. Implementation Evidence

Production source code and tests do not require artificial lifecycle IDs.

Use actual evidence such as:

- file paths
- modules
- classes
- functions
- test names
- migration names
- configuration files
- commit SHA
- executed commands

Implementation evidence should connect back to:

`TASK-###`

and from there to the approved upstream traceability chain.

Where useful, implementation-log.md may also reference requirements,
architecture, and Design Review IDs directly.

---

# 8. Code Review Identifiers

Code Review findings use:

`CR-###`

Example:

`CR-003`

A CR finding should reference applicable:

- Requirement IDs
- Acceptance Criteria
- TASK IDs
- CMP IDs
- AD IDs
- DR IDs
- actual files / locations

Do not invent upstream references.

For a code-quality issue with no direct approved requirement relationship, use:

`Not directly mapped`

where the Code Review contract permits it.

---

# 9. Verification Identifiers

Verification cases use:

`VC-###`

Example:

`VC-012`

Verification findings use:

`VR-###`

Example:

`VR-002`

Verification cases should reference applicable:

- FR IDs
- BR IDs
- NFR IDs
- AC IDs
- TASK IDs

Verification findings should additionally reference applicable:

- CR IDs
- DR IDs
- architecture references

when relevant.

---

# 10. External Source Identifiers

External source identifiers may include:

- Jira issue keys
- Confluence page identifiers
- user-story identifiers
- external document names
- approved source URLs
- document headings or sections

Examples:

`SP-1`

`SCRUM-6`

External identifiers are source references.

Do not rename them into FR/TASK/etc. identifiers.

Requirements extraction should preserve source traceability.

Example:

`SP-1`
→ `FR-001`
→ `AC-001`

---

# 11. Permanent Identifier Rule

Once a lifecycle identifier has been published into a governed artifact:

do not casually renumber it.

Never reuse an old identifier for a different concept.

Examples:

If:

`DR-003`

is rejected,

the next finding is NOT another DR-003.

Use:

`DR-004`

or the next available permanent identifier.

The same rule applies to:

- requirements
- architecture decisions
- components
- architecture risks
- review findings
- tasks
- verification cases
- verification findings

---

# 12. Deleted or Superseded Work

If governed work is removed or superseded after its ID has entered lifecycle
history:

do not reuse that identifier.

Preserve sufficient history in the owning artifact to explain the change.

Do not renumber remaining identifiers merely to remove gaps.

Identifier gaps are acceptable.

Audit ambiguity is not.

---

# 13. No Invented References

Before writing:

`FR-012`

verify that FR-012 exists in the authoritative requirements artifact.

Before writing:

`AD-004`

verify that AD-004 exists in architecture.md.

Before writing:

`DR-002`

verify that DR-002 exists in design-review.md.

Before writing:

`TASK-009`

verify that TASK-009 exists in impl-plan.md.

Before writing:

`CR-003`

verify that CR-003 exists in code-review.md.

Before writing:

`VR-002`

verify that VR-002 exists in verification.md.

If the reference cannot be found:

do not invent it.

Report the broken traceability relationship.

---

# 14. Artifact Authority

Use the authoritative artifact for each identifier namespace.

| Identifier | Authoritative Artifact |
|---|---|
| RQ / FR / BR / NFR / AC | requirements.md |
| AQ / CMP / AD / ARISK | architecture.md |
| DR | design-review.md |
| PQ / TASK | impl-plan.md |
| implementation evidence | implementation-log.md + actual repository |
| CR | code-review.md |
| VC / VR | verification.md |

Actual source code and tests remain authoritative evidence of what was
implemented.

implementation-log.md is evidence of claimed execution, not a replacement for
actual code.

---

# 15. Requirements to Architecture

Architecture must account for applicable approved requirements.

Traceability may map one requirement to:

- one component
- multiple components
- an Architecture Decision
- a combination of components and decisions

Example:

`NFR-SEC-001`
→ `AD-003`
→ `CMP-002`

Do not force every requirement to have both a CMP and AD when one is genuinely
not applicable.

---

# 16. Requirements to Acceptance Criteria

Acceptance Criteria describe observable evidence for approved behavior.

An AC may reference:

- one functional requirement
- multiple requirements
- business rules
- applicable NFRs

Avoid orphan ACs that cannot be related to approved scope.

Avoid material requirements that have no acceptance or verification path where
testability is expected.

---

# 17. Architecture to Design Review

Design Review findings should identify the architecture element being reviewed.

Preferred mappings include:

`DR`
→ `CMP`

`DR`
→ `AD`

`DR`
→ architecture section

and, where applicable:

`DR`
→ `Requirement`

Example:

`DR-002`
→ `NFR-SEC-001`
→ `AD-004`
→ `CMP-003`

---

# 18. Design Review to Planning

Accepted/resolved Design Review obligations must not disappear during
Implementation Planning.

When a DR finding creates an implementation obligation:

at least one TASK should preserve the required outcome.

Example:

`DR-003`
→ `TASK-005`

If the finding changed Architecture:

trace through the resulting architecture element where practical.

---

# 19. Requirements and Architecture to TASKs

Every material implementation task must be justified by governed scope.

TASKs should reference applicable:

- FR
- BR
- NFR
- AC
- CMP
- AD
- DR

A TASK with no meaningful upstream justification should be inspected for
scope creep.

Do not treat purely administrative planning tasks as invalid merely because
they have fewer requirement references.

---

# 20. Task to Implementation Evidence

For every completed TASK:

implementation-log.md should identify:

- TASK ID
- files added
- files modified
- files removed
- tests added or updated
- verification commands
- completion criteria
- result

The actual repository must support those claims.

If implementation-log.md claims a file changed but Git/source evidence does not
support the claim:

record the inconsistency.

---

# 21. TASK to Code Review

Code Review should identify which TASKs contributed to the reviewed
implementation.

When a CR finding affects specific implementation work:

reference the applicable TASK.

Example:

`TASK-004`
→ `src/api/profile.ts`
→ `CR-002`

Do not assign an unrelated TASK merely to populate the field.

---

# 22. Requirements to Code Review

Code Review correctness findings should reference applicable approved
requirements whenever possible.

Example:

`FR-005`
requires authorization.

Implementation violates that requirement.

Trace:

`FR-005`
→ `TASK-008`
→ implementation
→ `CR-003`

This supports remediation ownership and regression verification.

---

# 23. Requirements to Verification

Verification must establish sufficient evidence for material approved
requirements.

Preferred relationship:

`Requirement`
→ `TASK`
→ `VC`
→ `Evidence`
→ `PASS / FAIL`

Example:

`FR-004`
→ `TASK-006`
→ `VC-011`
→ integration test
→ `PASS`

---

# 24. Acceptance Criteria to Verification

Every applicable material AC must be accounted for in Verification.

Preferred matrix:

| Acceptance Criterion | Verification Case | Evidence | Result |
|---|---|---|---|

Allowed outcomes follow the Verification Agent contract.

Do not silently omit an AC.

---

# 25. CR Remediation Traceability

When Implementation remediates:

`CR-###`

the remediation evidence should retain:

- CR ID
- related TASK
- related requirements
- affected files
- focused verification

The Implementation Agent must not create a new CR ID.

The Code Review Agent owns CR resolution.

---

# 26. VR Remediation Traceability

When Implementation remediates:

`VR-###`

retain:

- VR ID
- related VC where applicable
- affected Requirement IDs
- related TASK
- applicable CR references
- affected files
- focused checks

The Implementation Agent must not create a replacement VR ID merely because it
performed remediation.

The Verification Agent owns final VR resolution.

---

# 27. Requirement Coverage

A material approved requirement is considered sufficiently traceable when
there is a defensible chain to:

- architecture where architecture is relevant
- implementation scope
- actual implementation evidence
- verification evidence

A requirement does NOT need a finding.

DR, CR, and VR identifiers exist only when findings actually exist.

Do not create artificial findings merely to fill a traceability chain.

---

# 28. Orphan Detection

Look for orphaned lifecycle objects.

Examples:

## Orphan Requirement

An approved material requirement with no implementation or verification path.

## Orphan Architecture Decision

An AD that affects implementation but maps to no task.

## Orphan Design Finding

An accepted implementation-relevant DR finding with no remediation/task
coverage.

## Orphan TASK

A task with no defensible upstream scope.

## Orphan CR

A finding referencing a nonexistent TASK or requirement.

## Orphan Verification Case

A VC with no requirement, AC, risk, or explicit verification purpose.

When an orphan is material:

report the traceability gap.

Do not manufacture relationships to hide it.

---

# 29. Broken Reference Detection

A broken reference exists when an artifact references an ID absent from the
owning authoritative artifact.

Example:

impl-plan.md references:

`FR-019`

but requirements.md contains only:

`FR-001` through `FR-010`.

This is a traceability defect.

Do not silently reinterpret FR-019 as another requirement.

---

# 30. Many-to-Many Relationships

Traceability is naturally many-to-many.

One requirement may map to several TASKs.

One TASK may satisfy several requirements.

One verification case may validate several related requirements.

One requirement may need multiple verification cases.

Do not force artificial one-to-one mappings.

---

# 31. Traceability Granularity

Use enough granularity to answer:

- Why does this implementation exist?
- Which requirement authorizes it?
- Which architecture element governs it?
- Which task delivered it?
- Which test or verification evidence proves it?
- Which review finding affected it?

Do not create excessive IDs that add no audit value.

---

# 32. Traceability and Scope Control

Traceability is also a scope-control mechanism.

When proposed implementation work cannot be connected to:

- approved requirement
- approved architecture obligation
- accepted review remediation
- approved implementation task

inspect whether the work is:

`OUT_OF_SCOPE`

or requires an upstream lifecycle change.

Do not use traceability IDs to disguise unauthorized scope expansion.

---

# 33. Traceability During Upstream Change

When a requirement or architecture baseline materially changes:

re-evaluate affected downstream references.

Do not assume old:

- DR mappings
- TASK mappings
- CR mappings
- VC mappings

remain valid.

Use the SDLC governance skill to determine required downstream replay.

Use this skill to repair traceability during that replay.

---

# 34. Human Decisions and Traceability

Human decisions should preserve the IDs they concern.

Examples:

`RQ-004 answered`

`DR-002 ACCEPTED`

`CR-003 REJECTED`

Do not record ambiguous decisions such as:

`Second finding accepted`

when a stable ID exists.

---

# 35. Evidence Is Not an ID

Commands and outputs are evidence, not lifecycle identifiers.

Examples:

`npm test`

`42 tests passed`

`src/api/app.ts`

`commit abc123`

do not need artificial identifiers.

Reference them as evidence under the appropriate TASK, CR, VC, or VR.

---

# 36. PR Traceability

The PR is the final delivery package.

The PR should be generated from:

- actual Git diff
- implementation evidence
- Code Review evidence
- Verification evidence

It does not need to dump every lifecycle identifier into the PR description.

However, when repository policy or reviewer usefulness warrants it, the PR may
include:

- story ID
- important requirement IDs
- relevant TASK IDs
- material resolved CR/VR references

Do not overload the PR description with internal IDs that provide no reviewer
value.

---

# 37. Validation Procedure

When asked to validate traceability:

1. identify PROJECT_ROOT
2. locate authoritative SDLC artifacts
3. extract defined IDs from each artifact
4. extract cross-artifact references
5. verify every reference exists
6. identify material orphaned objects
7. inspect actual implementation evidence when needed
8. inspect verification evidence
9. classify gaps
10. report gaps without inventing fixes

Use read-only behavior unless an owning specialist explicitly authorizes
modification.

---

# 38. Traceability Result Vocabulary

Use:

`VALID`

when the required traceability relationship is sufficiently supported.

Use:

`MISSING`

when a required mapping does not exist.

Use:

`BROKEN_REFERENCE`

when a referenced ID does not exist.

Use:

`NOT_APPLICABLE`

when the relationship genuinely does not apply.

Use:

`NOT_VERIFIED`

when sufficient evidence cannot be obtained.

Do not treat NOT_VERIFIED as VALID.

---

# 39. Specialist Ownership

This skill provides traceability rules.

The owning specialist remains responsible for writing its artifact.

Examples:

Requirements Agent owns requirement identifiers.

Architecture Agent owns CMP/AD/AQ/ARISK identifiers.

Design Review Agent owns DR identifiers.

Implementation Planning Agent owns TASK/PQ identifiers.

Code Review Agent owns CR identifiers.

Verification Agent owns VC/VR identifiers.

The skill does not create IDs on behalf of another specialist.

---

# 40. Final Rule

The purpose of traceability is not to maximize the number of references.

The purpose is to make the following chain provable:

`Why was this built?`

`How was it designed?`

`What work implemented it?`

`What code changed?`

`Who/what reviewed it?`

`How was it verified?`

If that chain cannot be answered for material approved behavior:

traceability is incomplete.