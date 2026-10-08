import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { App } from "./App";
import { fetchApiStatus } from "./api";

describe("App", () => {
  it("renders the web application foundation", () => {
    expect(renderToStaticMarkup(<App />)).toContain("Sports_Paradise");
    expect(renderToStaticMarkup(<App />)).toContain(
      "Foundation frontend for the Sports_Paradise web application shell.",
    );
  });

  it("reads the readiness response from the backend API", async () => {
    const originalFetch = globalThis.fetch;

    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          status: "ready",
          service: "sports-paradise-api",
          database: "connected",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );

    try {
      await expect(
        fetchApiStatus("http://localhost:3000"),
      ).resolves.toMatchObject({
        status: "ready",
        database: "connected",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("surfaces backend readiness failures to the caller", async () => {
    const originalFetch = globalThis.fetch;

    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          status: "not_ready",
          service: "sports-paradise-api",
          database: "unavailable",
          error: "Database is not available.",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        },
      );

    try {
      await expect(fetchApiStatus("http://localhost:3000")).rejects.toThrow(
        "Database is not available.",
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("surfaces network failures without converting them into success", async () => {
    const originalFetch = globalThis.fetch;

    globalThis.fetch = async () => {
      throw new Error("Backend is unreachable.");
    };

    try {
      await expect(fetchApiStatus("http://localhost:3000")).rejects.toThrow(
        "Backend is unreachable.",
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
