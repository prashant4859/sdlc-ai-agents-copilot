import { afterEach, describe, expect, it } from "vitest";
import { checkDatabaseConnection, createDatabasePool } from "./pool.js";

describe("database pool", () => {
  const pools: ReturnType<typeof createDatabasePool>[] = [];

  afterEach(async () => {
    await Promise.all(pools.splice(0).map((pool) => pool.end()));
  });

  it("rejects missing connection configuration", () => {
    expect(() => createDatabasePool("  ")).toThrow("DATABASE_URL is required");
  });

  it("reports unavailable PostgreSQL with an actionable error", async () => {
    const pool = createDatabasePool(
      "postgres://test-user:test-password@127.0.0.1:1/test-database",
    );
    pools.push(pool);

    await expect(checkDatabaseConnection(pool)).rejects.toThrow(
      "Database connectivity check failed; verify DATABASE_URL and that PostgreSQL is running.",
    );
  });
});
