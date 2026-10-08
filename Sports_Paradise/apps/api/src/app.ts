import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import type { Pool } from "pg";
import { checkDatabaseConnection, createDatabasePool } from "./db/pool.js";
import { redactConnectionString, type AppConfig } from "./config.js";

export interface AppDependencies {
  databaseHealthCheck?: (pool: Pool) => Promise<void>;
}

const echoBodySchema = {
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
} as const;

const echoResponseSchema = {
  type: "object",
  required: ["message", "echoed"],
  additionalProperties: false,
  properties: {
    message: {
      type: "string",
    },
    echoed: {
      type: "string",
    },
  },
} as const;

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Sports_Paradise API",
    version: "0.1.0",
    description:
      "Foundation API contract for the Sports_Paradise application shell.",
  },
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/health": {
      get: {
        summary: "Service health",
        responses: {
          200: {
            description: "The API is running.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status", "service", "database"],
                  properties: {
                    status: { type: "string" },
                    service: { type: "string" },
                    database: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/ready": {
      get: {
        summary: "Readiness check",
        responses: {
          200: {
            description: "The service and database are healthy.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status", "service", "database"],
                  properties: {
                    status: { type: "string" },
                    service: { type: "string" },
                    database: { type: "string" },
                  },
                },
              },
            },
          },
          503: {
            description:
              "The service is not ready because the database is unavailable.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status", "service", "database", "error"],
                  properties: {
                    status: { type: "string" },
                    service: { type: "string" },
                    database: { type: "string" },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/echo": {
      post: {
        summary: "Echo a message for validation smoke tests",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  message: { type: "string", minLength: 1, maxLength: 200 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "The request was accepted and echoed back.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["message", "echoed"],
                  properties: {
                    message: { type: "string" },
                    echoed: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Request validation failed.",
          },
        },
      },
    },
  },
} as const;

export function buildApiApp(
  config: AppConfig,
  dependencies: AppDependencies = {},
): FastifyInstance {
  const app = Fastify({
    logger: false,
    ajv: {
      customOptions: {
        allErrors: true,
      },
    },
  });

  const databasePool = createDatabasePool(config.databaseUrl);
  const checkDatabase =
    dependencies.databaseHealthCheck ?? checkDatabaseConnection;

  app.addHook("onRequest", async (request, reply) => {
    if (request.headers.origin === "http://localhost:5173") {
      reply.header("access-control-allow-origin", "http://localhost:5173");
      reply.header("vary", "Origin");
    }
  });

  app.addHook("onClose", async () => {
    await databasePool.end();
  });

  app.setErrorHandler((error, _request, reply) => {
    const typedError = error as Error & {
      statusCode?: number;
      validation?: unknown[];
    };
    const isValidationError = Array.isArray(typedError.validation);
    const responseCode =
      typeof typedError.statusCode === "number" && typedError.statusCode > 0
        ? typedError.statusCode
        : 500;
    const message = redactConnectionString(
      typedError.message || "Internal Server Error",
    );

    reply.code(responseCode).send({
      error: {
        code: isValidationError ? "VALIDATION_ERROR" : "INTERNAL_SERVER_ERROR",
        message,
        ...(isValidationError && {
          details: typedError.validation,
        }),
      },
    });
  });

  app.get("/health", async () => ({
    status: "ok",
    service: "sports-paradise-api",
    database: "unknown",
  }));

  app.get("/ready", async (_request, reply) => {
    try {
      await checkDatabase(databasePool);

      return reply.code(200).send({
        status: "ready",
        service: "sports-paradise-api",
        database: "connected",
      });
    } catch (error) {
      const message = redactConnectionString(
        error instanceof Error ? error.message : "Database unavailable",
      );

      return reply.code(503).send({
        status: "not_ready",
        service: "sports-paradise-api",
        database: "unavailable",
        error: message,
      });
    }
  });

  app.get("/openapi.json", async () => openApiSpec);

  app.post(
    "/api/echo",
    {
      schema: {
        body: echoBodySchema,
        response: {
          200: echoResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { message } = request.body as { message: string };
      return reply.code(200).send({
        message,
        echoed: message,
      });
    },
  );

  return app;
}
