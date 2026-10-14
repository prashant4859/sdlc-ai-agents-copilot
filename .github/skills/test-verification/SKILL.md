---
name: test-verification
description: >
  Shared testing, validation, and evidence procedure for the controlled
  Agentic SDLC. Use this skill when discovering project-native test commands,
  running unit or integration tests, build/type/lint/static checks, security
  or dependency checks, migration and smoke tests, interpreting failures,
  distinguishing blocked or unavailable verification from success, assessing
  test adequacy, or recording normalized evidence for Implementation, Code
  Review, Verification, and Pull Request reporting.
---

# Agentic SDLC Test and Verification

This skill defines the shared procedure for discovering, executing,
interpreting, and recording technical validation evidence.

It applies to:

- Implementation task checks
- Code Review targeted validation
- formal Verification
- Pull Request Test Evidence

It does NOT decide whether an SDLC phase is approved.

The owning specialist agent makes that decision according to its lifecycle
contract.

For the canonical evidence structure, also read:

`evidence-format.md`

when recording validation results.

---

# 1. Core Principle

Use the project's existing native validation mechanisms before introducing new
tools.

Do not assume a technology stack.

Discover it.

Do not claim a check passed unless the check actually ran and produced
sufficient evidence.

---

# 2. Validation Categories

Applicable validation categories include:

`UNIT_TEST`

`INTEGRATION_TEST`

`CONTRACT_TEST`

`COMPONENT_TEST`

`END_TO_END_TEST`

`SMOKE_TEST`

`BUILD`

`TYPECHECK`

`LINT`

`STATIC_ANALYSIS`

`FORMAT_CHECK`

`SECURITY_CHECK`

`DEPENDENCY_AUDIT`

`MIGRATION_CHECK`

`DATABASE_CHECK`

`CONFIGURATION_CHECK`

`REGRESSION_CHECK`

`ACCEPTANCE_CHECK`

Not every project requires every category.

Use:

`NOT_APPLICABLE`

when a category genuinely does not apply.

---

# 3. Result Vocabulary

Use these normalized result values:

`PASS`

`FAIL`

`BLOCKED`

`NOT_APPLICABLE`

`NOT_VERIFIED`

These meanings must remain consistent across Implementation, Code Review,
Verification, and PR evidence.

---

# 4. PASS

Use:

`PASS`

only when the required check actually executed successfully and sufficient
evidence supports success.

Examples:

- command completed successfully
- expected assertions passed
- required service behavior was observed
- required build completed

Do not infer PASS from:

- code inspection alone when execution was required
- an old unrelated CI result
- a previous branch
- absence of obvious errors
- a command that was never executed

---

# 5. FAIL

Use:

`FAIL`

when:

- the validation command executes and returns a failing result
- an assertion fails
- actual behavior differs from expected behavior
- the build fails
- static validation reports blocking violations
- a required test exposes a defect

Record the meaningful failure evidence.

Do not hide an initial failure merely because a later rerun succeeds.

---

# 6. BLOCKED

Use:

`BLOCKED`

when a required validation cannot execute because an external prerequisite is
unavailable.

Examples:

- required database unavailable
- required service unavailable
- missing approved credential
- required container runtime unavailable
- environment cannot start
- dependency service unreachable

BLOCKED is not PASS.

---

# 7. NOT_VERIFIED

Use:

`NOT_VERIFIED`

when sufficient evidence cannot be obtained.

Examples:

- required audit tool is not available
- test command cannot be determined reliably
- required environment cannot be reproduced and BLOCKED does not fully describe
  the situation
- security property cannot be practically tested with available tooling

NOT_VERIFIED is not PASS.

---

# 8. NOT_APPLICABLE

Use:

`NOT_APPLICABLE`

only when the check genuinely does not apply.

Example:

A project with no database migration mechanism may record:

`Migration Verification: NOT_APPLICABLE`

Do not use NOT_APPLICABLE to avoid a difficult required check.

---

# 9. Project-Native Command Discovery

Before executing tests, inspect project evidence.

Preferred discovery order:

1. repository/project documentation
2. package/build manifests
3. workspace configuration
4. CI workflow configuration
5. Makefile/task runner configuration
6. test framework configuration
7. existing scripts
8. source/test directory conventions

Do not invent commands before checking project configuration.

---

# 10. Common Discovery Files

Examples include:

Node.js / JavaScript / TypeScript:

- package.json
- package-lock.json
- pnpm-lock.yaml
- yarn.lock
- vitest.config.*
- jest.config.*
- vite.config.*
- eslint.config.*
- tsconfig.json

Python:

- pyproject.toml
- requirements.txt
- tox.ini
- pytest.ini
- setup.cfg

Java:

- pom.xml
- build.gradle
- build.gradle.kts

.NET:

- *.sln
- *.csproj

Go:

- go.mod
- go.sum

Rust:

- Cargo.toml
- Cargo.lock

General:

- Makefile
- Taskfile.yml
- Dockerfile
- compose.yaml
- docker-compose.yml
- CI workflows
- repository documentation

This list is illustrative, not exhaustive.

---

# 11. Script Precedence

When a repository defines an explicit project script, prefer it over invoking a
framework directly.

Example:

Prefer:

`npm test`

when package.json defines the intended test workflow.

Do not replace it with:

`npx vitest`

without reason.

Repository scripts may contain required setup, workspace behavior, environment,
or additional validation.

---

# 12. Workspace Awareness

Detect whether the project is:

- single package
- monorepo
- multi-module
- multi-service
- workspace-based

Use repository-level commands when they are designed to validate all relevant
workspaces.

Do not accidentally validate only one package while reporting whole-project
success.

---

# 13. Whole-Suite Versus Focused Checks

Distinguish:

`FOCUSED`

from:

`FULL`

Focused checks validate a specific task, remediation, component, or finding.

Full checks validate the broader release candidate.

Implementation may commonly use focused checks plus applicable regression
checks.

Formal Verification should run the complete required suite whenever practical.

Do not report a focused test as though the full project suite passed.

---

# 14. Unit Test Verification

Unit tests should validate isolated logic where appropriate.

Assess whether the suite covers applicable:

- happy paths
- validation
- business rules
- error handling
- boundary conditions
- invalid inputs
- missing values
- security-sensitive behavior

Do not invent a requirement for unit testing when the project architecture
makes another testing level more appropriate.

---

# 15. Integration Test Verification

Integration tests should validate interactions between applicable:

- modules
- services
- databases
- message queues
- file systems
- HTTP APIs
- external adapters
- configuration boundaries
- authentication/authorization boundaries

If required infrastructure cannot run:

record:

`BLOCKED`

or:

`NOT_VERIFIED`

as appropriate.

Never convert unavailable integration testing into PASS.

---

# 16. Contract and API Verification

Where contracts exist, validate applicable:

- request shape
- response shape
- status codes
- required fields
- validation errors
- compatibility expectations
- documented interfaces

Use existing contract tests or project-native validation where available.

---

# 17. End-to-End Verification

Run end-to-end checks when:

- required by approved scope
- supported by the project
- environment prerequisites are available
- the verification value justifies execution

Do not introduce a new permanent E2E framework solely to satisfy this skill.

Missing required persistent E2E coverage should be reported through the
appropriate SDLC process.

---

# 18. Build Verification

Where the project has a build or compile step:

run the project-native build command.

Examples:

`npm run build`

`mvn test/package`

`gradle build`

`dotnet build`

`go build`

`cargo build`

Use the repository's actual convention.

Do not claim build PASS based solely on unit tests.

---

# 19. Type Verification

When static typing is part of the project:

run the project-native type check.

Examples:

`npm run typecheck`

`tsc --noEmit`

`mypy`

`pyright`

`dotnet build`

Use repository configuration.

Do not introduce a type checker merely because one could theoretically be used.

---

# 20. Lint and Static Validation

Run configured lint/static checks when applicable.

Examples:

- ESLint
- Ruff
- Flake8
- Checkstyle
- SpotBugs
- Roslyn analyzers
- golangci-lint
- Clippy

Prefer existing repository scripts.

Do not install unrelated static-analysis tools during normal validation without
authorization.

---

# 21. Format Verification

When formatting is governed by the repository:

prefer a non-mutating check.

Examples:

`prettier --check`

rather than:

`prettier --write`

during review/verification.

Validation should not silently modify production files.

---

# 22. Security Validation

Use existing approved security validation where available.

Possible evidence includes:

- security-focused tests
- authorization tests
- input-validation tests
- secret scans
- static analysis
- dependency audit
- configuration checks

Do not claim:

`Security: PASS`

merely because unit tests passed.

Security evidence should match the approved security obligations.

---

# 23. Dependency Audit

Inspect repository-native dependency audit capability when applicable.

Examples may include:

`npm audit`

package-manager audit functions

language-native vulnerability checks

organization-provided scanning

CI dependency scanners

Do not install arbitrary security tools merely to manufacture an audit result.

If no reliable audit mechanism is available and one is required:

record:

`NOT_VERIFIED`

Do not record PASS.

---

# 24. Dependency Audit Scope

Distinguish between:

- direct dependencies
- transitive dependencies
- development dependencies
- production dependencies

Do not overstate what the audit command proves.

Record the actual command and meaningful result.

---

# 25. Database and Migration Verification

When data persistence or migrations are in scope, validate applicable:

- migration syntax
- migration execution
- forward migration
- required rollback behavior where governed
- schema compatibility
- application database connectivity
- startup/provisioning behavior
- failure handling

Do not run destructive migration tests against uncontrolled production data.

---

# 26. Configuration Verification

Validate applicable configuration behavior such as:

- required variables
- default values
- invalid values
- missing values
- secret handling
- local configuration
- environment-specific behavior

Do not expose secret values while recording evidence.

---

# 27. Smoke Verification

Smoke tests should confirm that the essential integrated application path can
start and respond.

A smoke test does not replace deeper unit or integration tests when those are
required.

Record the scope accurately.

---

# 28. Acceptance Verification

When verifying Acceptance Criteria:

map each applicable AC to actual evidence.

Evidence may include:

- automated test
- integration result
- API response
- UI behavior
- generated output
- controlled manual verification where allowed

Use the repository's SDLC traceability rules.

Do not mark an AC PASS without supporting evidence.

---

# 29. Regression Verification

After remediation or material implementation change:

identify behavior that could regress.

Run focused regression checks plus broader tests appropriate to the risk.

Resolved CR and VR findings should have regression evidence when practical.

---

# 30. Test Adequacy Versus Test Execution

Distinguish:

`the existing tests passed`

from:

`the existing test coverage is sufficient`

These are different questions.

Code Review and Verification may need to assess whether important scenarios are
missing even when every existing test passes.

---

# 31. Missing Persistent Tests

When durable automated coverage is required but missing:

do not silently create persistent test files during independent Code Review or
Verification if their specialist contracts prohibit implementation changes.

Instead create the appropriate finding or remediation requirement.

Implementation Agent may add persistent tests when authorized by:

- approved TASK scope
- accepted CR remediation
- eligible VR remediation

---

# 32. Temporary Verification Assets

Formal Verification may use temporary:

- input files
- ephemeral data
- one-off execution harnesses
- disposable test data

only when its agent contract permits them.

Temporary assets must not silently become production implementation.

Do not commit temporary verification material unless it becomes an authorized
persistent deliverable through Implementation.

---

# 33. Test Environment Integrity

Record important environment context when relevant:

- operating system
- runtime version
- package manager
- database/service version
- container runtime
- environment mode

Do not overwhelm the report with irrelevant machine details.

Include enough information to understand or reproduce the evidence.

---

# 34. Exit Codes

Where commands expose exit status:

capture whether the command completed successfully.

Exit code alone may not always prove behavioral correctness.

Use command output and test assertions where needed.

Do not ignore nonzero exits.

---

# 35. Failure Evidence

When a test/check fails, record enough information to understand:

- command
- failing test/check
- important error
- affected scope

Avoid dumping massive raw logs into lifecycle documents.

Preserve concise actionable evidence.

---

# 36. Secret Redaction

Before storing command output in SDLC artifacts:

remove or redact:

- passwords
- API keys
- tokens
- connection credentials
- private keys
- secret environment values

Do not make evidence more detailed at the expense of credential safety.

---

# 37. Flaky and Intermittent Failures

A failing first run followed by a passing rerun is NOT automatically clean PASS.

Record the initial failure.

Investigate whether it indicates:

- flakiness
- race condition
- environment instability
- startup timing problem
- shared state contamination
- genuine intermittent defect

A diagnostic rerun is allowed.

Do not erase the original failure evidence.

---

# 38. Rerun Policy

Reruns may be used to:

- confirm reproducibility
- diagnose intermittency
- verify remediation

Do not repeatedly rerun a failing test until it happens to pass and then report
only PASS.

If results are inconsistent:

report that inconsistency.

---

# 39. Pre-existing Failures

If a validation failure clearly predates the current controlled change:

record it as:

`PRE_EXISTING`

when evidence supports that classification.

Do not automatically blame the current task.

However:

a pre-existing failure may still block a release when the lifecycle requires a
clean validation gate.

The owning specialist determines the phase impact.

---

# 40. New Failures

If the current implementation introduces or exposes a new failure:

record it as related to the current candidate when evidence supports that
relationship.

Do not classify a failure as pre-existing without comparison evidence.

---

# 41. Warning Handling

Warnings are not automatically failures.

Assess whether a warning represents:

- accepted tool noise
- deprecated behavior
- security risk
- future compatibility risk
- configuration problem

Record material warnings.

Do not inflate harmless warnings into defects.

Do not suppress meaningful warnings merely to obtain a clean report.

---

# 42. Coverage Metrics

If the project already uses coverage measurement:

record relevant coverage evidence.

Do not invent a numeric coverage threshold that is absent from:

- approved requirements
- repository policy
- existing quality gates

If a threshold exists:

validate against that threshold.

---

# 43. Performance Tests

Run performance tests only when:

- an approved NFR requires them
- the repository includes relevant tooling
- the required environment exists

Do not invent performance thresholds.

A performance result without an approved expectation cannot prove an NFR.

---

# 44. Accessibility Tests

Run accessibility checks when:

- approved requirements require them
- project tooling supports them
- they are applicable to the changed surface

Do not claim accessibility PASS based only on visual inspection unless the
governing requirement permits manual verification.

---

# 45. Required Command Provenance

For every important check record where the command came from.

Examples:

`package.json script`

`Makefile target`

`CI workflow`

`project documentation`

`existing repository test framework`

Avoid arbitrary command invention.

---

# 46. Do Not Install Unapproved Tooling

Validation must not casually alter the project.

Do not:

- add dependencies
- upgrade dependencies
- rewrite lockfiles
- introduce new test frameworks
- install global tools into the repository workflow

solely to run a validation check unless explicitly authorized.

If required tooling is absent:

record:

`BLOCKED`

or:

`NOT_VERIFIED`

and route appropriately.

---

# 47. Dependency Installation

If project dependencies must be installed to execute existing validation:

use the repository's normal dependency-installation mechanism.

Examples:

`npm ci`

`pnpm install --frozen-lockfile`

project-specific equivalents

Avoid modifying lockfiles during validation.

If dependency installation would alter the governed candidate:

stop and evaluate the impact.

---

# 48. Network Dependence

Be explicit when validation depends on:

- external package registry
- remote API
- external test service
- cloud service
- unavailable network resource

Network failure is not proof that the implementation is defective.

Classify it appropriately.

---

# 49. Code Review Validation

Code Review may run:

- targeted tests
- static checks
- security checks
- dependency checks
- focused reproduction commands

These checks support review judgment.

Code Review should not silently implement fixes while validating.

---

# 50. Implementation Validation

Implementation should run tests/checks required by the selected TASK or
remediation.

Task completion requires the evidence defined by the approved implementation
plan and Implementation Agent contract.

Do not run unrelated expensive suites when they provide no value, unless the
plan requires them.

---

# 51. Formal Verification

Formal Verification should produce the broadest required evidence.

It should normally include applicable:

- unit tests
- integration tests
- build
- static/type/lint checks
- acceptance verification
- security validation
- dependency validation
- regression
- migration/data checks
- required smoke/E2E checks

The Verification Agent determines required scope from governed inputs.

---

# 52. PR Evidence

PR Test Evidence is a summary of already executed authoritative evidence.

The PR Agent should not fabricate or recreate passing results.

Preferred sources:

1. verification.md
2. relevant current CI result
3. implementation-log.md for supporting task evidence

Do not paste huge logs.

Use concise results.

---

# 53. Evidence Freshness

Evidence must apply to the implementation baseline being reported.

A test result from an older materially different candidate may be stale.

Use the Git baseline safety skill to determine whether evidence still applies.

---

# 54. CI Evidence

CI evidence may supplement local Verification.

When using CI:

record:

- workflow/check name
- observed result
- relevant revision/PR when known

Do not claim CI PASS while checks are pending.

Do not use an unrelated historical CI run as evidence for the current
candidate.

---

# 55. Validation Ordering

A reasonable default order is:

fast deterministic checks
→ unit tests
→ build/type/static checks
→ integration/dependency checks
→ broader smoke/E2E checks

However, follow project conventions when they specify a better order.

Do not rigidly apply this sequence when dependencies require otherwise.

---

# 56. Fail-Fast Versus Complete Evidence

During Implementation, fail-fast may be appropriate when an early mandatory
check fails.

During formal Verification, enough additional independent checks may still be
valuable to understand the full release state when safe.

Do not continue destructive or misleading tests after a fundamental
environment failure.

---

# 57. Result Aggregation

Do not collapse mixed results into PASS.

Example:

Unit Tests: PASS

Integration Tests: BLOCKED

Build: PASS

Overall required verification cannot be PASS if integration testing is
mandatory.

Aggregate according to required checks.

---

# 58. Test Evidence Traceability

Use the repository's SDLC traceability skill when associating evidence with:

- FR
- BR
- NFR
- AC
- TASK
- CR
- VR

Do not invent requirement mappings.

---

# 59. Validation Evidence Integrity

Evidence must remain factual.

Never fabricate:

- test counts
- command output
- duration
- exit status
- coverage percentage
- CI URL
- security result
- package vulnerability result

If information is unavailable:

say so.

---

# 60. Recommended Evidence Record

For every meaningful validation command record:

Check ID or Category:
Scope:
Command:
Command Source:
Environment:
Result:
Exit Status:
Tests / Assertions:
Important Output:
Related Requirements:
Related TASK:
Related CR / VR:
Evidence Freshness:
Notes:

Use only fields relevant to the check.

See:

`evidence-format.md`

for reusable report formats.

---

# 61. Final Rule

Passing tests are evidence.

They are not permission to bypass lifecycle governance.

A technically passing candidate must still satisfy:

- approved requirements
- approved architecture
- review gates
- verification gates
- baseline consistency

Use the SDLC governance skill for lifecycle advancement.

Use this skill only for technical validation and evidence quality.