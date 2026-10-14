import { fileURLToPath } from "node:url";
import { buildApiApp } from "./app.js";
import { buildAppConfig } from "./config.js";

export async function startServer(env: NodeJS.ProcessEnv = process.env) {
  const config = buildAppConfig(env);
  const app = buildApiApp(config);

  await app.listen({ host: config.host, port: config.port });

  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer().catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Failed to start API server.";

    console.error(message);
    process.exit(1);
  });
}
