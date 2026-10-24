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
- Backend: Node.js
- Database: MongoDB

## Running locally

```bash
make install
make run
```

## Live URL

notgovindkumar.github.io/Rental360/

## Health endpoint

`GET /health` returns the running commit SHA. See `Makefile` and the milestone
sheet for why this is required.

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