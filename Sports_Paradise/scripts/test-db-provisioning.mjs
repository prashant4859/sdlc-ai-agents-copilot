import { spawnSync } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const cleanupTargets = [];

function redactSecrets(value, env) {
  let redactedValue = value;

  for (const [name, secret] of Object.entries(env)) {
    if (
      typeof secret === "string" &&
      secret.length > 0 &&
      /(PASSWORD|SECRET|TOKEN|CREDENTIAL)/i.test(name)
    ) {
      redactedValue = redactedValue.replaceAll(secret, "[REDACTED]");
    }
  }

  return redactedValue;
}

function formatComposeResult(projectName, args, result, env) {
  const exitDetails = [
    result.status === null ? "unknown exit code" : `exit code ${result.status}`,
    result.signal ? `signal ${result.signal}` : null,
  ]
    .filter(Boolean)
    .join(", ");
  const details = [
    `Docker Compose ${args[0]} for isolated project ${projectName} returned ${exitDetails}.`,
  ];

  if (result.error) {
    details.push(`Process error: ${redactSecrets(result.error.message, env)}`);
  }

  details.push(
    `stdout:\n${redactSecrets(result.stdout?.trim() || "(empty)", env)}`,
    `stderr:\n${redactSecrets(result.stderr?.trim() || "(empty)", env)}`,
  );

  return details.join("\n");
}

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
    throw new Error(formatComposeResult(projectName, args, result, env));
  }

  return result;
}

function requireSuccessfulRun(projectName, args, env) {
  const result = runDockerCompose(projectName, args, env);

  if (result.status !== 0) {
    throw new Error(formatComposeResult(projectName, args, result, env));
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
      [
        "Compose reported success when the app role matched the bootstrap role.",
        formatComposeResult(projectName, ["up"], result, env),
      ].join("\n"),
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
      [
        "Compose did not report the app-role provisioning failure explicitly.",
        formatComposeResult(projectName, ["logs"], logs, env),
        formatComposeResult(projectName, ["up"], result, env),
      ].join("\n"),
    );
  }
}

async function verifyProvisioningSqlFailureDoesNotLogCredential() {
  const projectName = createProjectName("db-provisioning-sql-failure");
  const appPassword = "synthetic-sql-failure-password";
  const env = {
    POSTGRES_DB: "sports_paradise_test",
    POSTGRES_USER: "foundation_admin",
    POSTGRES_PASSWORD: "synthetic-bootstrap-password",
    POSTGRES_APP_USER: "pg_database_owner",
    POSTGRES_APP_PASSWORD: appPassword,
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
      [
        "Compose reported success when PostgreSQL rejected application-role provisioning.",
        formatComposeResult(projectName, ["up"], result, env),
      ].join("\n"),
    );
  }

  const logs = requireSuccessfulRun(
    projectName,
    ["logs", "--no-color", "database"],
    env,
  );
  const failureOutput = `${result.stdout}\n${result.stderr}\n${logs}`;

  if (!/cannot alter reserved roles/i.test(failureOutput)) {
    const safeOutput = redactSecrets(failureOutput, env);
    throw new Error(
      `PostgreSQL output did not contain the expected role-provisioning failure: ${safeOutput}`,
    );
  }

  if (failureOutput.includes(appPassword)) {
    throw new Error(
      "The application-role credential appeared in provisioning failure output.",
    );
  }

  console.log("Credential-safe PostgreSQL provisioning failure check passed.");
}

function verifyComposeFailureDiagnostics() {
  const env = { POSTGRES_PASSWORD: "synthetic-compose-diagnostic-password" };
  const diagnostic = formatComposeResult(
    "sports-paradise-diagnostics-test",
    ["up"],
    {
      status: 1,
      signal: null,
      error: null,
      stdout: "database exited before becoming healthy",
      stderr: `password=${env.POSTGRES_PASSWORD}`,
    },
    env,
  );

  if (
    !diagnostic.includes("database exited before becoming healthy") ||
    !diagnostic.includes("stderr:") ||
    diagnostic.includes(env.POSTGRES_PASSWORD) ||
    !diagnostic.includes("[REDACTED]")
  ) {
    throw new Error(
      "Docker Compose failure diagnostics did not preserve actionable output while redacting credentials.",
    );
  }

  console.log("Safe Docker Compose failure diagnostics check passed.");
}

async function main() {
  let executionError;

  try {
    verifyComposeFailureDiagnostics();
    await verifyProvisioningSqlFailureDoesNotLogCredential();
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
        cleanupErrors.push(
          formatComposeResult(projectName, ["down"], result, env),
        );
      }
    } catch (error) {
      cleanupErrors.push(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  if (executionError && cleanupErrors.length > 0) {
    throw new AggregateError(
      [
        executionError,
        new Error(
          `Could not remove isolated database test projects:\n${cleanupErrors.join("\n")}`,
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
      `Could not remove isolated database test projects:\n${cleanupErrors.join("\n")}`,
    );
  }

  console.log(
    "Database provisioning integration checks passed: credential quoting, role authentication, credential rotation, fail-fast configuration, and credential-safe SQL failure logging.",
  );
}

await main();
