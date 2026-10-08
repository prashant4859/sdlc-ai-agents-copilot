import { useEffect, useState } from "react";
import { DEFAULT_API_BASE_URL, fetchApiStatus } from "./api";

export function App() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Checking backend connectivity...");

  useEffect(() => {
    let active = true;

    fetchApiStatus(DEFAULT_API_BASE_URL)
      .then((result) => {
        if (!active) {
          return;
        }

        if (result.status === "ready") {
          setStatus("ready");
          setMessage(
            "API ready: backend and database dependencies are healthy.",
          );
          return;
        }

        setStatus("error");
        setMessage(result.error ?? "The backend API is not ready.");
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "The backend service is unavailable.",
        );
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 720 }}>
      <h1>Sports_Paradise</h1>
      <p>Foundation frontend for the Sports_Paradise web application shell.</p>

      <section
        aria-live="polite"
        style={{
          border: "1px solid #d1d5db",
          borderRadius: 8,
          padding: "1rem 1.25rem",
          marginTop: "1.5rem",
          background:
            status === "ready"
              ? "#ecfdf5"
              : status === "error"
                ? "#fef2f2"
                : "#f8fafc",
        }}
      >
        <strong>Backend status:</strong> {message}
      </section>

      <p style={{ marginTop: "1rem", color: "#475569" }}>
        API base URL: {DEFAULT_API_BASE_URL}
      </p>
    </main>
  );
}
