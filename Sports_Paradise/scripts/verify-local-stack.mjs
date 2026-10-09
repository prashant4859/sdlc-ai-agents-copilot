const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:3000";
const webBaseUrl = "http://localhost:5173";

async function request(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown network error";
    throw new Error(`Could not reach ${url}: ${detail}`, { cause: error });
  }

  return response;
}

async function readJson(response, label) {
  try {
    return await response.json();
  } catch {
    throw new Error(`${label} did not return valid JSON.`);
  }
}

const healthResponse = await request(`${apiBaseUrl}/health`);
if (!healthResponse.ok) {
  throw new Error(`API health check returned HTTP ${healthResponse.status}.`);
}
const health = await readJson(healthResponse, "API health endpoint");
if (health.status !== "ok") {
  throw new Error("API health endpoint returned an unexpected status.");
}

const readyResponse = await request(`${apiBaseUrl}/ready`, {
  headers: { Origin: webBaseUrl },
});
if (readyResponse.status !== 200) {
  const payload = await readJson(readyResponse, "API readiness endpoint");
  throw new Error(
    `API is not ready (HTTP ${readyResponse.status}): ${payload.error ?? "database unavailable"}`,
  );
}
const readiness = await readJson(readyResponse, "API readiness endpoint");
if (readiness.status !== "ready" || readiness.database !== "connected") {
  throw new Error("API readiness did not confirm database connectivity.");
}
if (readyResponse.headers.get("access-control-allow-origin") !== webBaseUrl) {
  throw new Error("API does not allow the configured local frontend origin.");
}

const echoResponse = await request(`${apiBaseUrl}/api/echo`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "integration-smoke" }),
});
if (!echoResponse.ok) {
  throw new Error(`API contract check returned HTTP ${echoResponse.status}.`);
}
const echo = await readJson(echoResponse, "API echo endpoint");
if (
  echo.message !== "integration-smoke" ||
  echo.echoed !== "integration-smoke"
) {
  throw new Error("API contract returned an unexpected echo response.");
}

const invalidRequest = await request(`${apiBaseUrl}/api/echo`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ unexpected: true }),
});
if (invalidRequest.status !== 400) {
  throw new Error(
    `Malformed API input returned HTTP ${invalidRequest.status}, expected 400.`,
  );
}
const invalidPayload = await readJson(invalidRequest, "Malformed API response");
if (invalidPayload.error?.code !== "VALIDATION_ERROR") {
  throw new Error("Malformed API input did not return a validation error.");
}

const contractResponse = await request(`${apiBaseUrl}/openapi.json`);
const contract = await readJson(contractResponse, "OpenAPI endpoint");
if (
  !contractResponse.ok ||
  contract.openapi !== "3.0.3" ||
  !contract.paths["/ready"]
) {
  throw new Error(
    "OpenAPI endpoint does not describe the readiness interface.",
  );
}

const webResponse = await request(webBaseUrl);
if (!webResponse.ok) {
  throw new Error(`Frontend returned HTTP ${webResponse.status}.`);
}
const webHtml = await webResponse.text();
if (!webHtml.includes('<div id="root"></div>')) {
  throw new Error("Frontend did not serve the application shell.");
}

console.log("Local integration smoke checks passed:");
console.log("- API health and database readiness");
console.log("- frontend-origin access to the readiness contract");
console.log("- valid and malformed API contract requests");
console.log("- OpenAPI contract availability");
console.log("- frontend application shell delivery");
