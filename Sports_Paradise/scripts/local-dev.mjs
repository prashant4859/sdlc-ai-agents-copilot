import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

try {
  process.loadEnvFile(path.join(projectRoot, ".env"));
} catch (error) {
  if (
    !(error instanceof Error) ||
    !("code" in error) ||
    error.code !== "ENOENT"
  ) {
    throw error;
  }
}

const npmCliPath = process.env.npm_execpath;
const apiReadyUrl = "http://localhost:3000/ready";
const webReadyUrl = "http://localhost:5173";

if (!npmCliPath) {
  throw new Error("Start the local stack with `npm run dev`.");
}

function startProcess(name, args) {
  const child = spawn(process.execPath, [npmCliPath, ...args], {
    stdio: "inherit",
    env: process.env,
    cwd: projectRoot,
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`${name} exited with code ${code}.`);
    }
  });

  return child;
}

async function waitForService(url, timeoutMs, label) {
  const started = Date.now();
  let lastStatus;

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok) {
        return;
      }
      lastStatus = response.status;
    } catch {
      // retry until the service accepts requests
    }

    await delay(1000);
  }

  const statusMessage = lastStatus ? ` (last HTTP status ${lastStatus})` : "";
  throw new Error(`Timed out waiting for ${label} at ${url}${statusMessage}.`);
}

async function waitForDatabaseStartup() {
  return await new Promise((resolve, reject) => {
    const database = startProcess("database", ["run", "db:up"]);

    database.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Database startup failed with exit code ${code}.`));
    });
  });
}

let api;
let web;

function shutdown() {
  if (api && !api.killed) {
    api.kill("SIGINT");
  }

  if (web && !web.killed) {
    web.kill("SIGINT");
  }

  process.exit(0);
}

try {
  await waitForDatabaseStartup();
  api = startProcess("api", ["run", "dev:api"]);
  web = startProcess("web", ["run", "dev:web"]);

  await waitForService(apiReadyUrl, 60000, "API");
  await waitForService(webReadyUrl, 60000, "Web app");

  console.log("Sports_Paradise local development environment is running.");
  console.log(`API readiness endpoint: ${apiReadyUrl}`);
  console.log(`Web app: ${webReadyUrl}`);
  console.log("Press Ctrl+C to stop the API and frontend processes.");

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await new Promise(() => {});
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Local startup failed.";

  console.error(message);

  if (api && !api.killed) {
    api.kill("SIGINT");
  }

  if (web && !web.killed) {
    web.kill("SIGINT");
  }

  process.exit(1);
}
