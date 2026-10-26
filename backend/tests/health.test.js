import test from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("health endpoint returns JSON without requiring database", async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  server.close();
});

test("protected API routes reject unauthenticated requests", async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/v1/properties`);
  const body = await response.json();
  assert.equal(response.status, 401);
  assert.equal(body.message, "Authentication required");
  server.close();
});

test("metrics endpoint exposes request metrics", async () => {
  const server = app.listen(0);
  const { port } = server.address();
  await fetch(`http://127.0.0.1:${port}/health`);
  const response = await fetch(`http://127.0.0.1:${port}/metrics`);
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(body, /rental360_http_requests_total/);
  assert.match(body, /rental360_http_request_duration_seconds/);
  server.close();
});
