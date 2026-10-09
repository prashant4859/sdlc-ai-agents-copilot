import { describe, expect, it } from "vitest";
import { buildApiApp } from "./app.js";
import { buildAppConfig } from "./config.js";

describe("backend API foundation", () => {
  it("validates required configuration values", () => {
    expect(() => buildAppConfig({} as NodeJS.ProcessEnv)).toThrow(
      "DATABASE_URL is required.",
    );
  });

  it("binds the API to loopback by default", () => {
    expect(
      buildAppConfig({
        DATABASE_URL: "postgresql://localhost/sports_paradise",
      } as NodeJS.ProcessEnv).host,
    ).toBe("127.0.0.1");
  });

  it("rejects malformed port configuration", () => {
    expect(() =>
      buildAppConfig({
        DATABASE_URL: "postgresql://localhost/sports_paradise",
        PORT: "3e3",
      } as NodeJS.ProcessEnv),
    ).toThrow("PORT must be a valid integer between 1 and 65535.");
  });

  it("returns a healthy readiness state when the database check succeeds", async () => {
    const app = buildApiApp(
      {
        host: "127.0.0.1",
        port: 3000,
        databaseUrl: "postgresql://user:pass@127.0.0.1:5432/sports_paradise",
        environment: "test",
      },
      {
        databaseHealthCheck: async () => {
          return;
        },
      },
    );

    const response = await app.inject({
      method: "GET",
      url: "/ready",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: "ready",
      database: "connected",
    });
  });

  it("returns a non-ready status when the database dependency fails", async () => {
    const app = buildApiApp(
      {
        host: "127.0.0.1",
        port: 3000,
        databaseUrl: "postgresql://user:pass@127.0.0.1:5432/sports_paradise",
        environment: "test",
      },
      {
        databaseHealthCheck: async () => {
          throw new Error(
            "Database connectivity check failed; verify DATABASE_URL and that PostgreSQL is running.",
          );
        },
      },
    );

    const response = await app.inject({
      method: "GET",
      url: "/ready",
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      status: "not_ready",
      database: "unavailable",
    });
    expect(response.json().error).toContain(
      "Database connectivity check failed",
    );
  });

  it("does not expose database credentials in dependency errors", async () => {
    const secret = "synthetic-password-sentinel";
    const app = buildApiApp(
      {
        host: "127.0.0.1",
        port: 3000,
        databaseUrl:
          "postgresql://app:synthetic-password-sentinel@localhost/db",
        environment: "test",
      },
      {
        databaseHealthCheck: async () => {
          throw new Error(
            `Connection failed for postgresql://app:${secret}@localhost/db`,
          );
        },
      },
    );

    const response = await app.inject({
      method: "GET",
      url: "/ready",
    });

    expect(response.statusCode).toBe(503);
    expect(response.body).not.toContain(secret);
    expect(response.body).toContain("[REDACTED]");
    await app.close();
  });

  it("allows the local frontend origin to read the readiness contract", async () => {
    const app = buildApiApp({
      host: "127.0.0.1",
      port: 3000,
      databaseUrl: "postgresql://localhost/sports_paradise",
      environment: "test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/ready",
      headers: {
        origin: "http://localhost:5173",
      },
    });

    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
    expect(response.headers.vary).toContain("Origin");
    await app.close();
  });

  it("does not allow other browser origins", async () => {
    const app = buildApiApp({
      host: "127.0.0.1",
      port: 3000,
      databaseUrl: "postgresql://localhost/sports_paradise",
      environment: "test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/ready",
      headers: {
        origin: "https://untrusted.example",
      },
    });

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    await app.close();
  });

  it("rejects invalid echo payloads with a validation error", async () => {
    const app = buildApiApp({
      host: "127.0.0.1",
      port: 3000,
      databaseUrl: "postgresql://user:pass@127.0.0.1:5432/sports_paradise",
      environment: "test",
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/echo",
      payload: {
        notAMessage: "invalid",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe("VALIDATION_ERROR");
  });

  it("exposes the OpenAPI contract for the foundation endpoints", async () => {
    const app = buildApiApp({
      host: "127.0.0.1",
      port: 3000,
      databaseUrl: "postgresql://user:pass@127.0.0.1:5432/sports_paradise",
      environment: "test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/openapi.json",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      openapi: "3.0.3",
      info: {
        title: "Sports_Paradise API",
      },
    });
    expect(response.json().paths).toHaveProperty("/ready");

    const echoSchema =
      response.json().paths["/api/echo"].post.requestBody.content[
        "application/json"
      ].schema;

    expect(echoSchema).toMatchObject({
      type: "object",
      required: ["message"],
      additionalProperties: false,
      properties: {
        message: {
          type: "string",
          minLength: 1,
          maxLength: 200,
        },
      },
    });
  });

  it("rejects extra fields in echo requests as described by OpenAPI", async () => {
    const app = buildApiApp({
      host: "127.0.0.1",
      port: 3000,
      databaseUrl: "******127.0.0.1:5432/sports_paradise",
      environment: "test",
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/echo",
      payload: {
        message: "valid",
        extra: "not allowed by the contract",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe("VALIDATION_ERROR");
    await app.close();
  });
});
