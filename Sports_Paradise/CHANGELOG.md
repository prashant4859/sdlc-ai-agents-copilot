# Changelog

## Unreleased

### Added

- Established the Sports_Paradise application foundation with a React/Vite web
  app, Node.js/Fastify API, PostgreSQL database, and reproducible local
  development environment.
- Added project requirements, architecture, implementation, verification, and
  contributor documentation with automated quality checks.

### Fixed

- Hardened database-role provisioning so failures do not disclose configured
  credentials in PostgreSQL logs.
- Made database startup wait for the configured database to accept queries and
  improved provisioning-test failure diagnostics with credential redaction.
