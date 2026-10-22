const assert = require("assert");
const http = require("http");
const { spawn } = require("child_process");

const port = 3100 + Math.floor(Math.random() * 500);
const serverProcess = spawn(process.execPath, ["server.js"], {
  env: { ...process.env, PORT: String(port), GIT_SHA: "test-commit" },
  stdio: ["ignore", "pipe", "pipe"]
});

function request(path) {
  return new Promise((resolve, reject) => {
    const request = http.get(`http://127.0.0.1:${port}${path}`, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => resolve({
        statusCode: response.statusCode,
        headers: response.headers,
        body
      }));
    });
    request.on("error", reject);
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      await request("/health");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("server did not start");
}

async function run() {
  try {
    await waitForServer();

    const health = await request("/health");
    assert.strictEqual(health.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(health.body), {
      status: "ok",
      commit: "test-commit"
    });

    const missing = await request("/missing");
    assert.strictEqual(missing.statusCode, 404);

    const metrics = await request("/metrics");
    assert.strictEqual(metrics.statusCode, 200);
    assert.match(metrics.headers["content-type"], /^text\/plain/);
    assert.match(metrics.body, /rental360_http_requests_total \d+/);
    assert.match(metrics.body, /rental360_http_errors_total 1/);
  } finally {
    serverProcess.kill();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
