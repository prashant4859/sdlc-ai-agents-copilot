import { startServer } from "./server.js";

void startServer().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Failed to start API server.";

  console.error(message);
  process.exit(1);
});
