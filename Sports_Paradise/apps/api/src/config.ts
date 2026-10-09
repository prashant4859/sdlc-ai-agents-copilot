export interface AppConfig {
  host: string;
  port: number;
  databaseUrl: string;
  environment: string;
}

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = "127.0.0.1";

export function getRequiredEnvValue(
  key: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const value = env[key]?.trim();

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

export function redactConnectionString(value: string): string {
  if (!value) {
    return value;
  }

  try {
    const parsed = new URL(value);
    const userinfo = parsed.username ? "[REDACTED]" : "";
    const password = parsed.password ? ":[REDACTED]" : "";

    parsed.username = userinfo;
    parsed.password = password;

    return parsed.toString();
  } catch {
    return value
      .replace(
        /(postgres(?:ql)?:\/\/)([^:@]+)(:[^@]+)?@/i,
        "$1[REDACTED]@[REDACTED]@",
      )
      .replace(/(postgres(?:ql)?:\/\/)([^@]+)@/i, "$1[REDACTED]@");
  }
}

export function buildAppConfig(
  env: NodeJS.ProcessEnv = process.env,
): AppConfig {
  const portValue = env.PORT?.trim() ?? DEFAULT_PORT.toString();
  const port = Number(portValue);

  if (
    !/^\d+$/.test(portValue) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error("PORT must be a valid integer between 1 and 65535.");
  }

  return {
    host: env.HOST?.trim() || DEFAULT_HOST,
    port,
    databaseUrl: getRequiredEnvValue("DATABASE_URL", env),
    environment: env.NODE_ENV?.trim() || "development",
  };
}
