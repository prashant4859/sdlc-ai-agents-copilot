---
name: git-baseline-safety
description: >
  Shared Git repository and lifecycle-baseline safety procedure for the
  controlled Agentic SDLC. Use this skill when resolving a repository root,
  inspecting branch/worktree state, establishing base/head revisions,
  determining whether changes are committed or uncommitted, comparing Code
  Review or Verification revisions with the current implementation, detecting
  stale approvals, classifying changed files, checking protected/default branch
  safety, or deciding whether implementation, review, verification, or PR work
  may safely proceed.
---

# Git Baseline Safety

This skill defines the shared Git and release-baseline safety procedure for the
controlled Agentic SDLC.

It is used to determine:

- which repository is being operated on
- which branch is active
- which revision represents the current candidate
- whether the worktree is clean or dirty
- what kind of files changed
- whether a reviewed or verified baseline is still current
- whether a phase may safely continue
- whether re-review or re-verification is required

This skill does NOT perform specialist lifecycle work.

---

# 1. Core Principle

Never carry an SDLC approval across a materially changed implementation
baseline without validating that the approval still applies.

Git state is evidence.

Artifact status alone does not prove that the current working tree or HEAD is
the same implementation that was reviewed or verified.

---

# 2. Safe Inspection Only

Use non-destructive Git inspection commands when available.

Typical commands include:

`git rev-parse --show-toplevel`

`git branch --show-current`

`git status --short`

`git rev-parse HEAD`

`git log --oneline`

`git diff`

`git diff --stat`

`git diff --name-status`

`git diff --cached`

`git diff --cached --name-status`

`git show`

`git remote -v`

Use only the commands needed for the current decision.

---

# 3. Prohibited Git Operations

Do NOT use this skill as authorization for destructive repository changes.

Never automatically use:

`git reset --hard`

destructive:

`git clean`

`git checkout -- <file>`

history rewriting

force push

branch deletion

discarding user work

overwriting uncommitted human changes

This skill inspects and classifies.

It does not destroy repository state.

---

# 4. Repository Root Resolution

Before making a Git-baseline decision, establish the repository root.

Preferred command:

`git rev-parse --show-toplevel`

Distinguish:

`GIT_REPOSITORY_ROOT`

from:

`PROJECT_ROOT`

They may be the same directory.

They may also differ when the actual project is contained inside a larger
repository.

Example:

Git repository:

`/workspace/sdlc-ai-agents-copilot`

Project root:

`/workspace/sdlc-ai-agents-copilot/Sports_Paradise`

Do not assume these are identical.

All lifecycle artifact paths must continue to use the governed PROJECT_ROOT.

---

# 5. Baseline Snapshot

When Git state matters, establish a baseline snapshot containing available:

- Git Repository Root
- Project Root
- Current Branch
- HEAD Revision
- Base Branch when known
- Base Revision when known
- Working Tree State
- Staged Changes
- Unstaged Changes
- Untracked Files
- Relevant Reviewed Revision
- Relevant Verified Revision

Do not invent values that cannot be determined.

---

# 6. Working Tree Classification

Classify the working tree as:

`CLEAN`

or:

`DIRTY`

CLEAN means no relevant staged, unstaged, or untracked files are present.

DIRTY means one or more such changes exist.

A DIRTY worktree is not automatically invalid.

The changes must be classified.

---

# 7. Change Classification

Classify changed files into applicable categories.

## PRODUCTION_SOURCE

Examples:

- application source
- backend services
- frontend components
- runtime business logic
- libraries used by production behavior

## PERSISTENT_TEST

Examples:

- unit tests
- integration tests
- contract tests
- regression tests
- test fixtures committed to the repository

## MIGRATION_OR_SCHEMA

Examples:

- database migrations
- schema definitions
- persistent data migration scripts

## DEPENDENCY

Examples:

- package.json dependency changes
- package-lock.json
- pnpm-lock.yaml
- yarn.lock
- requirements.txt
- poetry.lock
- pom.xml
- Gradle dependency files
- go.mod
- go.sum
- NuGet dependency files

## RUNTIME_CONFIGURATION

Examples:

- environment configuration
- application configuration
- security configuration
- runtime feature configuration

## DEPLOYMENT_OR_INFRASTRUCTURE

Examples:

- Docker/runtime composition
- Kubernetes manifests
- Terraform
- deployment scripts
- CI/CD behavior affecting the release candidate

## GENERATED_PRODUCTION_ARTIFACT

Generated files required by the production deliverable.

## PRODUCT_DOCUMENTATION

Examples:

- README
- API documentation
- operational runbook
- user documentation

## SDLC_ARTIFACT

Examples:

- requirements.md
- architecture.md
- design-review.md
- impl-plan.md
- implementation-log.md
- code-review.md
- verification.md
- orchestration-state.md

## AGENT_FRAMEWORK

Examples:

- `.github/agents/*.agent.md`
- `.github/skills/**`
- Copilot framework instructions

## PR_PACKAGING

Examples:

- CHANGELOG.md
- release-note fragment
- approved changeset
- PR-only metadata

## UNRELATED_OR_UNKNOWN

Any changed file that cannot safely be associated with the intended work.

Do not silently classify an unknown file as harmless.

---

# 8. Material Implementation Change

The following normally represent a material implementation-baseline change:

- PRODUCTION_SOURCE
- PERSISTENT_TEST
- MIGRATION_OR_SCHEMA
- DEPENDENCY
- RUNTIME_CONFIGURATION
- DEPLOYMENT_OR_INFRASTRUCTURE
- GENERATED_PRODUCTION_ARTIFACT

Such changes can invalidate prior Code Review and Verification baselines.

---

# 9. Documentation Change Materiality

Documentation changes require context.

A PRODUCT_DOCUMENTATION change may be material when it changes or corrects:

- public behavior
- configuration instructions
- security behavior
- API contract
- operational behavior
- migration instructions
- required final output content

Do not automatically consider all documentation changes harmless.

A typo-only or packaging-only documentation change may be non-material.

Use the specialist phase contract to determine whether re-review is required.

---

# 10. SDLC Artifact Changes

An SDLC_ARTIFACT change does not automatically mean production implementation
changed.

However, it may change lifecycle state.

Examples:

Changing:

`Code Review Status`

may affect whether Verification may run.

Changing:

`Verification Status`

may affect PR readiness.

Therefore distinguish:

`implementation baseline changed`

from:

`governance baseline changed`

Both can block advancement for different reasons.

---

# 11. Agent Framework Changes

Changes under:

`.github/agents/`

or:

`.github/skills/`

normally modify the SDLC framework rather than the application implementation.

Do not automatically treat those files as production implementation.

However:

if the Pull Request itself is intended to deliver agent-framework changes,
those files are legitimate PR content and must be reviewed according to that
project's scope.

Always use approved scope.

---

# 12. Unrelated Changes

When a working tree contains unrelated human/developer changes:

preserve them.

Do not:

- stage them accidentally
- include them in a task commit
- discard them
- claim they belong to the selected TASK

If unrelated changes overlap files required by the current controlled work and
cannot safely be separated:

BLOCK the modifying operation.

Report:

`CONFLICTING_WORKTREE_CHANGES`

---

# 13. Branch Safety

Determine the current branch before modification or PR preparation.

Examples of commonly protected/default branches:

- main
- master
- production
- release branches

Do not assume a branch is protected solely because of its name.

Use repository policy when available.

If the specialist contract prohibits direct implementation on the current
branch:

STOP before modification.

Do not automatically move work to another branch when doing so would alter or
invalidate the reviewed baseline.

---

# 14. Base and Head

For review and PR operations distinguish:

`BASE`

from:

`HEAD`

HEAD is the candidate being reviewed or proposed.

BASE is the target branch or revision against which the candidate is compared.

When possible use the three-dot comparison for PR-style change discovery:

`git diff <base>...HEAD`

Do not invent a base branch.

Resolve it from:

1. explicit project/repository policy
2. known PR configuration
3. repository default branch
4. human instruction

---

# 15. Reviewed Revision

Code Review should establish a reviewed implementation baseline.

Preferred representation:

`Reviewed Revision: <commit SHA>`

When review necessarily includes uncommitted changes, record that explicitly.

Example:

`Reviewed Revision: uncommitted working-tree candidate based on <SHA>`

Do not pretend the base SHA alone identifies the complete reviewed candidate
when material uncommitted changes were included.

---

# 16. Verified Revision

Verification should establish a verified implementation baseline.

Preferred representation:

`Verified Revision: <commit SHA>`

When verification includes uncommitted implementation changes, record that
explicitly.

Do not later treat only the underlying commit SHA as representing those
uncommitted verified changes.

---

# 17. Preferred Release Candidate

The safest release candidate is:

- all intended implementation changes committed
- current HEAD identifies the complete candidate
- Code Review reviewed that committed candidate
- Verification verified that committed candidate
- no material implementation changes occurred afterward

Preferred state:

`Reviewed Revision == Verified Revision == current implementation HEAD`

where repository workflow permits this model.

---

# 18. Code Review Staleness

A previous:

`CODE_REVIEW_APPROVED`

must be treated as potentially stale when material implementation changes occur
after the reviewed baseline.

Examples:

- production code changed
- persistent tests changed
- dependency changed
- migration changed
- runtime configuration changed
- security behavior changed

Required routing:

Implementation
→ Code Review

If Verification had already run against the older implementation:

Verification is also stale.

---

# 19. Verification Staleness

A previous:

`VERIFICATION_PASSED`

must be treated as stale when material implementation changes occur after the
verified candidate.

Required routing normally becomes:

Implementation
→ Code Review
→ Verification

Do not carry the previous VERIFICATION_PASSED state onto a different material
candidate.

---

# 20. Code Review / Verification Revision Comparison

Before final Verification or PR preparation compare:

- current HEAD
- current worktree
- Reviewed Revision
- Verified Revision

Possible outcomes:

## MATCH

Current implementation corresponds to the approved reviewed/verified baseline.

## MATERIAL_CHANGE_AFTER_REVIEW

Current implementation differs materially from Code Review baseline.

Required:

Code Review again.

## MATERIAL_CHANGE_AFTER_VERIFICATION

Current implementation differs materially from Verification baseline.

Required:

Code Review when implementation changed
then Verification again.

## GOVERNANCE_ONLY_CHANGE

Only lifecycle/governance evidence changed.

Evaluate artifact consistency before advancing.

## PACKAGING_ONLY_CHANGE

Only explicitly allowed Step 8 packaging files changed.

Apply the PR packaging exception only when the PR Agent contract permits it.

## UNKNOWN

Baseline cannot be proven.

Do not assume MATCH.

Block the affected downstream gate until reconciled.

---

# 21. Uncommitted Release Candidate

A working tree may have been reviewed or verified while uncommitted.

That state is possible but fragile.

Before PR creation, the final implementation should normally be represented in
Git history.

If the recorded Verified Revision identifies only a base commit but material
verified changes remain uncommitted:

the commit does NOT identify the full release candidate.

Do not create a PR claiming that commit alone is the verified candidate.

Reconcile the candidate first.

---

# 22. Commit Safety

A specialist may create a commit only when its own contract authorizes commits.

Before any controlled commit:

- identify exactly which files belong to the controlled work
- ensure unrelated files are excluded
- ensure required checks passed
- ensure the commit does not silently include human work outside scope

Do not use:

`git add .`

blindly when unrelated files may exist.

Prefer explicitly scoped staging.

---

# 23. Commit Does Not Equal Approval

A commit SHA is evidence of repository state.

It is NOT equivalent to:

- Requirements approval
- Design Review approval
- Implementation Plan approval
- Code Review approval
- Verification pass

Lifecycle artifact gates remain independently required.

---

# 24. Packaging-Only Exception

Step 8 may introduce a packaging-only change after Verification only when the
PR Agent contract explicitly permits it.

Typical examples:

- CHANGELOG.md
- release-note fragment
- approved changeset

The packaging exception must NOT include:

- production source
- persistent tests
- migration
- dependency
- runtime configuration
- deployment behavior
- security behavior

If any such material file changes:

the exception does not apply.

Return to the required review/verification flow.

---

# 25. Unknown Files

If an untracked or modified file cannot be confidently classified:

do not ignore it.

Record:

`UNRELATED_OR_UNKNOWN`

and determine whether it affects the controlled operation.

For commits, review, verification, or PR packaging:

unknown material files must be understood before proceeding.

---

# 26. Sensitive Files

Treat potentially sensitive files carefully.

Examples:

- `.env`
- secret stores
- credentials
- private keys
- token files
- generated sensitive logs

Do not print secret contents merely to classify Git state.

Filename/status information may be sufficient.

Never include secrets in:

- implementation logs
- Code Review findings
- Verification reports
- PR descriptions

---

# 27. Safe Baseline Decision

A specialist may proceed only when the Git state required by its own phase is
understood sufficiently to preserve lifecycle integrity.

When baseline uncertainty could make an approval invalid:

prefer:

`BLOCK`

over:

guessing.

---

# 28. Recommended Baseline Report

When a phase needs Git baseline evidence, use a concise structure:

Git Repository Root:
Project Root:
Branch:
HEAD:
Base:
Working Tree:
Staged Changes:
Unstaged Changes:
Untracked Files:
Relevant Reviewed Revision:
Relevant Verified Revision:
Change Classification:
Baseline Result:
Required Routing:

Avoid dumping unnecessary full diffs into lifecycle artifacts.

---

# 29. Specialist Responsibilities

This skill supplies shared Git safety logic.

The specialist still owns the phase-specific decision.

Examples:

Implementation Agent decides whether it may edit.

Code Review Agent decides what revision is reviewed.

Verification Agent decides whether Code Review baseline is current.

PR Agent decides whether the verified candidate is ready for packaging.

Orchestrator decides which specialist must run next.

This skill does not replace those responsibilities.

---

# 30. Final Rule

When there is a conflict between:

`moving forward quickly`

and:

`being able to prove which implementation was reviewed and verified`

preserve the provable baseline.

Do not advance an SDLC approval onto an implementation candidate that cannot be
reliably identified.