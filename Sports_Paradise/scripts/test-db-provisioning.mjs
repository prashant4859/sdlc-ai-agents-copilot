import { spawnSync } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const cleanupTargets = [];

function runDockerCompose(projectName, args, env) {
  const result = spawnSync(
    "docker",
    ["compose", "--project-name", projectName, ...args],
    {
      cwd: projectRoot,
      encoding: "utf8",
      env: { ...process.env, ...env },
      timeout: 120_000,
    },
  );

  if (result.error) {
    throw new Error(`Docker Compose could not run: ${result.error.message}`);
  }

  return result;
}

function requireSuccessfulRun(projectName, args, env) {
  const result = runDockerCompose(projectName, args, env);

  if (result.status !== 0) {
    throw new Error(
      `Docker Compose ${args[0]} failed for isolated project ${projectName}.`,
    );
  }

  return result.stdout.trim();
}

async function findAvailablePort() {
  const server = createServer();

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not determine an available local TCP port.");
  }

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  return address.port;
}

function createProjectName(suffix) {
  return `sports-paradise-${suffix}-${process.pid}-${Date.now()}`;
}

async function verifyCredentialHandling() {
  const projectName = createProjectName("db-provisioning");
  const baseEnv = {
    POSTGRES_DB: "sports_paradise_test",
    POSTGRES_USER: "foundation_admin",
    POSTGRES_PASSWORD: "synthetic-bootstrap-password",
    POSTGRES_APP_USER: "foundation_app",
    POSTGRES_APP_PASSWORD: "synthetic-app-password",
    POSTGRES_PORT: String(await findAvailablePort()),
  };
  cleanupTargets.push({ projectName, env: baseEnv });

  const firstRunEnv = {
    ...baseEnv,
    POSTGRES_APP_PASSWORD: `edge'quote;dollar$double"quote\\tail`,
  };

  requireSuccessfulRun(
    projectName,
    ["up", "--detach", "--wait", "database"],
    firstRunEnv,
  );

  const checkAppLogin = [
    "exec",
    "-T",
    "database",
    "sh",
    "-c",
    'PGPASSWORD="$POSTGRES_APP_PASSWORD" psql -h 127.0.0.1 -v ON_ERROR_STOP=1 -U "$POSTGRES_APP_USER" -d "$POSTGRES_DB" -tAc "SELECT current_user || \':\' || rolsuper FROM pg_roles WHERE rolname=current_user"',
  ];
  const firstLogin = requireSuccessfulRun(
    projectName,
    checkAppLogin,
    firstRunEnv,
  );

  if (firstLogin !== "foundation_app:false") {
    throw new Error(
      "The provisioned app role did not authenticate as a non-superuser.",
    );
  }

  const rotatedRunEnv = {
    ...baseEnv,
    POSTGRES_APP_PASSWORD: `rotated'password;$with"symbols\\`,
  };

  requireSuccessfulRun(
    projectName,
    ["up", "--detach", "--wait", "--force-recreate", "database"],
    rotatedRunEnv,
  );
  requireSuccessfulRun(projectName, checkAppLogin, rotatedRunEnv);
}

async function verifyProvisioningFailure() {
  const projectName = createProjectName("db-provisioning-failure");
  const env = {
    POSTGRES_DB: "sports_paradise_test",
    POSTGRES_USER: "same_role",
    POSTGRES_PASSWORD: "synthetic-bootstrap-password",
    POSTGRES_APP_USER: "same_role",
    POSTGRES_APP_PASSWORD: "synthetic-app-password",
    POSTGRES_PORT: String(await findAvailablePort()),
  };
  cleanupTargets.push({ projectName, env });

  const result = runDockerCompose(
    projectName,
    ["up", "--detach", "--wait", "database"],
    env,
  );

  if (result.status === 0) {
    throw new Error(
      "Compose reported success when the app role matched the bootstrap role.",
    );
  }

  const logs = runDockerCompose(
    projectName,
    ["logs", "--no-color", "database"],
    env,
  );
  if (
    !`${logs.stdout}\n${logs.stderr}`.includes(
      "POSTGRES_APP_USER must differ from POSTGRES_USER.",
    )
  ) {
    throw new Error(
      "Compose did not report the app-role provisioning failure explicitly.",
    );
  }
}

async function main() {
  let executionError;

  try {
    await verifyCredentialHandling();
    await verifyProvisioningFailure();
  } catch (error) {
    executionError = error;
  }

  const cleanupErrors = [];
  for (const { projectName, env } of cleanupTargets.reverse()) {
    try {
      const result = runDockerCompose(
        projectName,
        ["down", "--volumes", "--remove-orphans"],
        env,
      );

      if (result.status !== 0) {
        cleanupErrors.push(projectName);
      }
    } catch {
      cleanupErrors.push(projectName);
    }
  }

  if (executionError && cleanupErrors.length > 0) {
    throw new AggregateError(
      [
        executionError,
        new Error(
          `Could not remove isolated database test projects: ${cleanupErrors.join(", ")}.`,
        ),
      ],
      "Database provisioning checks failed and cleanup was incomplete.",
    );
  }

  if (executionError) {
    throw executionError;
  }

  if (cleanupErrors.length > 0) {
    throw new Error(
      `Could not remove isolated database test projects: ${cleanupErrors.join(", ")}.`,
    );
  }

  console.log(
    "Database provisioning integration checks passed: credential quoting, role authentication, credential rotation, and fail-fast provisioning.",
  );
}

await main();
