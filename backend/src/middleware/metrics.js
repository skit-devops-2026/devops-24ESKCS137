import client from "prom-client";

client.collectDefaultMetrics();
export const httpRequests = new client.Counter({ name: "rental360_http_requests_total", help: "Total HTTP requests", labelNames: ["method", "route", "status"] });
export const httpErrors = new client.Counter({ name: "rental360_http_errors_total", help: "HTTP error responses", labelNames: ["method", "route", "status"] });
export const httpDuration = new client.Histogram({ name: "rental360_http_request_duration_seconds", help: "HTTP request duration", labelNames: ["method", "route"], buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5] });

export function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const route = req.route?.path || req.path;
    const labels = { method: req.method, route, status: String(res.statusCode) };
    httpRequests.inc(labels);
    if (res.statusCode >= 400) httpErrors.inc(labels);
    httpDuration.observe({ method: req.method, route }, Number(process.hrtime.bigint() - start) / 1e9);
  });
  next();
}
