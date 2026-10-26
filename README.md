# Rental360 - Rental Management System

> Replace every angle-bracket placeholder below. The hygiene check in CI will
> fail until you do.

## Author

| Roll No. | Name | GitHub username |
|---|---|---|
| 24ESKCS137 | Govind Kumar | notgovindkumar |

## About

Rental 360 is a rental property management system designed for small property owners to manage rooms, tenants, occupancy, rent collection, electricity billing, and payment records from a single platform. It helps automate daily rental operations, track room availability, monitor revenue, and maintain tenant information efficiently.

## Tech stack

- Frontend: React
- Frontend tooling: Vite
- Backend: Node.js and Express
- Database: MongoDB with Mongoose
- Authentication: JWT and bcrypt

## Running locally

```bash
make install
cp .env.example .env
docker compose up --build
```

The API is available at `http://localhost:8081`, the Vite development server at
`http://localhost:5173`, and MongoDB at `mongodb://localhost:27017/rental360`.
For a local non-container workflow, start MongoDB, run `make install`, then run
`npm --prefix backend run dev` and `npm --prefix frontend run dev`.

Seed clearly identified demo data with:

```bash
make seed
```

The demo account is `demo@rental360.local` with password
`DemoPassword123!`. Change it immediately outside local demonstrations.

## API

The authenticated REST API is under `/api/v1`. Authentication endpoints are
`POST /api/v1/auth/register`, `POST /api/v1/auth/login`, and
`GET /api/v1/auth/me`. Core resources expose REST CRUD endpoints for
`properties`, `units`, `tenants`, `leases`, `invoices`, `payments`,
`utilities`, and `maintenance`. Dashboard data is available from
`GET /api/v1/dashboard`, and aggregate reporting from
`GET /api/v1/reports/summary`. Authorized users can run the predefined
maintenance automations with `POST /api/v1/automations/run`; this marks unpaid
past-due invoices as overdue and synchronizes unit occupancy from active leases.

## Live URL

notgovindkumar.github.io/Rental360/

## Health endpoint

`GET /health` returns the running commit SHA and database status. `GET /ready`
is the database-aware readiness endpoint. `GET /metrics` exposes Prometheus
request counters, error counters, latency histograms, and default process
metrics.

## Monitoring

Start the application first, then start the monitoring stack:

```bash
GIT_SHA=$(git rev-parse HEAD) docker compose up --build -d
docker compose -f docker-compose.monitoring.yml up -d
```

Prometheus is available at `http://localhost:9090` and Grafana at
`http://localhost:3001`. The Prometheus target scrapes the application at
`http://rental360:3000/metrics`. Grafana provisions that data source and a
dashboard containing request and HTTP 404 panels automatically.

The CI image is tagged and built with the GitHub commit SHA. Render deployments
can use that image tag, or build this Dockerfile directly; the application also
reads Render's `RENDER_GIT_COMMIT` runtime value when no `GIT_SHA` build
argument is supplied.

## Kubernetes deployment

The M7 manifests in `k8s/` deploy the commit-tagged image with health probes
and expose it internally through a ClusterIP service:

```bash
kubectl apply -f k8s/deployment.yaml -f k8s/service.yaml
kubectl rollout status deployment/rental360
kubectl get service rental360
```

The API deployment expects a separately managed MongoDB and the keys shown in
`k8s/secret.example.yaml`; copy that example into a private cluster secret and
replace its placeholders. The manifests use local image names
(`rental360-api:local` and `rental360-frontend:local`) so they do not depend on
an inaccessible private registry. Build and load those images into the target
cluster (or change the image references to your authenticated registry) before
deployment. The frontend image can be deployed with
`k8s/frontend-deployment.yaml`.