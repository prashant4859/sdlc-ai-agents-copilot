# Local PostgreSQL and Schema Conventions

## Prerequisites and Configuration

Use Node.js 20.19.0 or later, npm, Docker Desktop with its Linux/WSL2 engine
running (or another compatible Docker Compose runtime), and make the Docker
CLI available on `PATH`. From the `Sports_Paradise` directory, copy
`.env.example` to `.env`, then replace both local password placeholders with
unique local values. Keep `.env` untracked; `.gitignore` excludes it.

`POSTGRES_USER` and `POSTGRES_PASSWORD` configure the local bootstrap
administrator used by the container initialization process; never use this
superuser account for application connections. The init script creates a
separate `POSTGRES_APP_USER` with `POSTGRES_APP_PASSWORD` for application and
migration access. The application role is not a PostgreSQL superuser. The
`DATABASE_URL` must contain the application role credentials and point to the
local database. URL-encode any reserved characters in the password component.
Never use production credentials or real user data in local development.

Compose binds PostgreSQL to `127.0.0.1` only, waits for `pg_isready`, and
persists data in the named `sports-paradise-postgres-data` volume. The
container initialization script and SQL create the app role and grant it
connect plus schema usage/create rights needed by versioned migrations. Do
not expose the database directly to browser code.

## Start and Stop

```powershell
Copy-Item .env.example .env
# Edit .env and replace both local password placeholders before starting.
npm run db:up
```

Inspect `docker compose ps` and `docker compose logs database` if the database
does not become healthy. Missing required Compose settings fail with an
actionable message. To stop services without deleting local data:

```powershell
npm run db:down
```

`docker compose down` retains the named database volume. Do not remove that
volume as a routine cleanup step; it contains local database state. The
foundation does not authorize destructive production operations.

## Application Database Access

Application processes connect using `DATABASE_URL` and the non-superuser
application role. The backend owns database access; the frontend receives no
database credentials. Backend code should create a bounded `pg.Pool` using
`createDatabasePool` from `apps/api/src/db/pool.ts` and check readiness using
`checkDatabaseConnection`. Do not log the connection URL. Connectivity
failures are surfaced with an actionable message and retained as an error
cause for diagnostics.

## Migrations and Schema Ownership

`node-pg-migrate` is the schema migration tool. Create a versioned TypeScript
migration from the project root with:

```powershell
npm run db:migration:create --workspace @sports-paradise/api -- add-description
```

Review each migration and its rollback before applying it. From the project
root, apply pending migrations using the `.env` configuration:

```powershell
npm run db:migrate --workspace @sports-paradise/api
```

The migration history is stored in PostgreSQL's `pgmigrations` table. Keep
migrations in `apps/api/migrations/` and commit them with the application code
that needs the schema. Do not make undocumented manual schema edits. The
application role owns objects it creates in the local `public` schema.

This foundation defines no sports-domain tables: domain entities, constraints,
personal-data classification, and retention require approved feature
requirements. No baseline/no-op migration is created solely to initialize an
empty project.

## Diagnostics and Limitations

If `npm run db:up` fails, confirm Docker Compose is installed and running,
`.env` exists and contains all required settings, and the configured local port
is available. If the app cannot connect, verify its `DATABASE_URL` uses the
application—not bootstrap—credentials and that `docker compose ps` reports a
healthy database. The application reports unavailable-database failures
explicitly rather than substituting in-memory storage.

Docker Desktop and Docker Compose are installed in the current verification
environment, but its Linux engine cannot start because Windows Subsystem for
Linux (WSL) is not installed. Compose configuration parsing succeeds, but
database startup and role initialization must be exercised with the Linux
engine running before TASK-003 can be marked verified.
