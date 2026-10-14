# Agentic SDLC Traceability Schema

This reference defines the canonical identifier namespaces and relationships
used by the controlled Agentic SDLC.

---

# 1. Identifier Namespace

| Namespace | Purpose | Owner |
|---|---|---|
| RQ-### | Requirements clarification question | Requirements Agent |
| FR-### | Functional Requirement | Requirements Agent |
| BR-### | Business Rule | Requirements Agent |
| NFR-SEC-### | Security NFR | Requirements Agent |
| NFR-PERF-### | Performance NFR | Requirements Agent |
| NFR-REL-### | Reliability NFR | Requirements Agent |
| NFR-OBS-### | Observability NFR | Requirements Agent |
| NFR-ACC-### | Accessibility NFR | Requirements Agent |
| NFR-MNT-### | Maintainability NFR | Requirements Agent |
| NFR-COMP-### | Compatibility NFR | Requirements Agent |
| AC-### | Acceptance Criterion | Requirements Agent |
| AQ-### | Architecture Question | Architecture Agent |
| CMP-### | Architecture Component | Architecture Agent |
| AD-### | Architecture Decision | Architecture Agent |
| ARISK-### | Architecture Risk | Architecture Agent |
| DR-### | Design Review Finding | Design Review Agent |
| PQ-### | Implementation Planning Question | Implementation Planning Agent |
| TASK-### | Implementation Task | Implementation Planning Agent |
| CR-### | Code Review Finding | Code Review Agent |
| VC-### | Verification Case | Verification Agent |
| VR-### | Verification Finding | Verification Agent |

---

# 2. Primary Delivery Relationship

```text
External Story
     │
     ▼
Requirements
FR / BR / NFR / AC
     │
     ▼
Architecture
CMP / AD / ARISK
     │
     ▼
Design Review
DR
     │
     ▼
Implementation Plan
TASK
     │
     ▼
Implementation
Files / Tests / Commits
     │
     ▼
Code Review
CR
     │
     ▼
Verification
VC / VR
     │
     ▼
Pull Request
```

Review findings are conditional.

Do not create DR, CR, or VR identifiers merely to complete the diagram.

---

# 3. Canonical Relationship Matrix

| From | To | Relationship |
|---|---|---|
| Source Story | FR/BR/NFR/AC | requirement derived from source |
| FR/BR/NFR | AC | acceptance evidence definition |
| FR/BR/NFR | CMP | architecture responsibility |
| FR/BR/NFR | AD | architecture decision supports requirement |
| CMP/AD | DR | architecture element reviewed |
| DR | CMP/AD | finding affects architecture element |
| FR/BR/NFR/AC | TASK | implementation work satisfies requirement |
| CMP/AD | TASK | implementation realizes architecture |
| DR | TASK | accepted review obligation implemented |
| TASK | Code/Test | implementation evidence |
| TASK | CR | code finding affects task implementation |
| FR/BR/NFR/AC | CR | finding violates or risks requirement |
| FR/BR/NFR/AC | VC | verification case proves behavior |
| TASK | VC | verification case proves implemented work |
| CR | VC | regression case verifies remediation |
| DR | VC | verification proves implemented design control |
| VC | VR | failed verification case may produce finding |
| VR | TASK | remediation may return to implementation |

---

# 4. Requirements Traceability Matrix

Recommended form:

| Requirement | Source | Acceptance Criteria | Architecture | Implementation Tasks | Verification |
|---|---|---|---|---|---|

Do not populate downstream columns before those lifecycle artifacts exist unless
the value is explicitly planned and identified as such.

---

# 5. Architecture Traceability Matrix

Recommended form:

| Requirement | Components | Architecture Decisions | Notes |
|---|---|---|---|

---

# 6. Design Review Traceability

Recommended form:

| DR Finding | Requirement | Component / Decision | Decision | Remediation |
|---|---|---|---|---|

---

# 7. Implementation Planning Requirements Matrix

Recommended form:

| Requirement | Acceptance Criteria | TASKs | Coverage |
|---|---|---|---|

Coverage values:

`COVERED`

`PARTIAL`

`MISSING`

`NOT_APPLICABLE`

---

# 8. Implementation Planning Architecture Matrix

Recommended form:

| Component / Decision | TASKs | Coverage |
|---|---|---|

---

# 9. Implementation Evidence

Recommended task evidence:

```text
TASK-###
├── Requirements
├── Acceptance Criteria
├── Components
├── Architecture Decisions
├── Design Review Findings
├── Files Added
├── Files Modified
├── Files Removed
├── Tests
├── Commands / Checks
└── Result
```

---

# 10. Code Review Traceability

Recommended form:

| CR Finding | Requirement | TASK | Architecture | DR | File / Location |
|---|---|---|---|---|---|

Use:

`Not directly mapped`

only when a direct lifecycle relationship genuinely does not exist.

---

# 11. Verification Requirements Matrix

Recommended form:

| Requirement | TASK | Verification Case | Evidence | Result |
|---|---|---|---|---|

---

# 12. Verification Acceptance Criteria Matrix

Recommended form:

| Acceptance Criterion | Verification Case | Evidence | Result |
|---|---|---|---|

---

# 13. Verification Finding Traceability

Recommended form:

| VR Finding | Verification Case | Requirement | TASK | CR | Expected | Actual |
|---|---|---|---|---|---|---|

---

# 14. Traceability Quality Conditions

A healthy lifecycle should have:

- no invented identifiers
- no reused identifiers
- no broken cross-artifact references
- no material orphan requirements
- no unauthorized orphan TASKs
- accepted DR obligations carried into implementation where required
- resolved CR fixes covered by suitable tests/verification where material
- all applicable ACs represented in Verification
- implementation-log claims supported by actual repository evidence

---

# 15. Missing Relationship Guidance

Do not fill gaps with guessed IDs.

Instead use:

`MISSING`

`NOT_APPLICABLE`

`NOT_VERIFIED`

or:

`Not directly mapped`

according to the owning artifact contract.

A visible gap is safer than false audit evidence.