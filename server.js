
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const COMMIT_SHA = process.env.GIT_SHA || "local";

let requests = 0;
let errors = 0;

const server = http.createServer((req, res) => {
  requests++;

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      status: "ok",
      commit: COMMIT_SHA
    }));
  }

  if (req.url === "/metrics") {
    res.writeHead(200, {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8"
    });
    return res.end(
      "# HELP rental360_http_requests_total Total HTTP requests\n" +
      "# TYPE rental360_http_requests_total counter\n" +
      `rental360_http_requests_total ${requests}\n` +
      "# HELP rental360_http_errors_total HTTP 404 responses\n" +
      "# TYPE rental360_http_errors_total counter\n" +
      `rental360_http_errors_total ${errors}\n`
    );
  }

  if (req.url === "/" || req.url === "/index.html") {
    const html = fs.readFileSync(path.join(__dirname, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(html);
  }

  errors++;
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Rental360 running on port ${PORT}`);
});
