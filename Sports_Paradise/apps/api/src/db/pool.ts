import { Pool } from "pg";

export function createDatabasePool(databaseUrl: string): Pool {
  if (databaseUrl.trim().length === 0) {
    throw new Error(
      "DATABASE_URL is required to connect to the PostgreSQL database.",
    );
  }

  return new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    max: 10,
  });
}

export async function checkDatabaseConnection(pool: Pool): Promise<void> {
  try {
    await pool.query("SELECT 1");
  } catch (error) {
    throw new Error(
      "Database connectivity check failed; verify DATABASE_URL and that PostgreSQL is running.",
      { cause: error },
    );
  }
}
