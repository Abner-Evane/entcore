# entcore — NestJS Microservices

This directory contains the NestJS monorepo that progressively extracts services from the Java/Maven entcore monolith.

## Architecture

```
services/
  apps/
    gateway-api/            ← BFF — routes to monolith by default, NestJS services progressively
    notification-service/   ← Phase 1: email/push/in-app, consumes NATS events
    audit-service/          ← Phase 2: RGPD audit log, write-only + filtered queries
    communication-service/  ← Phase 3: messaging threads & messages, replaces Java conversation
    organization-service/   ← Phase 4: établissements/classes/groupes — Neo4j graph
    profile-service/        ← Stub — student/teacher/parent profiles
    identity-service/       ← Stub (extracted last) — auth, sessions, roles, permissions
    content-service/        ← Stub — pedagogical resources, object storage
  libs/
    contracts/              ← Shared NATS event interfaces & DTOs (BaseEvent + all v1 events)
    messaging/              ← Typed NATS publisher/subscriber wrapper (MessagingModule)
    common/                 ← Shared decorators, exception filters, logging interceptor
    observability/          ← OpenTelemetry tracing initializer (Jaeger exporter)
```

## NATS event contracts

All events implement `BaseEvent`:

| Subject | Publisher | Consumers |
|---|---|---|
| `user.created.v1` | identity-service / Java adapter | notification-service, audit-service |
| `user.role.updated.v1` | identity-service | audit-service |
| `message.created.v1` | communication-service | notification-service, audit-service |
| `notification.requested.v1` | any service | notification-service |
| `audit.event.created.v1` | any service | audit-service |
| `class.enrollment.created.v1` | organization-service | audit-service, notification-service |
| `resource.published.v1` | content-service | notification-service |

Every event payload must include: `eventId`, `occurredAt`, `version`, `source`, `tenantId`, `idempotencyKey`.

## Getting started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- (Optional) `@nestjs/cli` globally: `npm i -g @nestjs/cli`

### Start infrastructure

```bash
cd services
docker compose up nats postgres neo4j jaeger -d
```

### Install dependencies

```bash
npm install
```

### Run a service in dev mode

```bash
# Gateway
npm run start:gateway -- --watch

# Notification service
npm run start:notification -- --watch

# Audit service
npm run start:audit -- --watch

# Communication service
npm run start:communication -- --watch

# Organization service
npm run start:organization -- --watch
```

### Build all

```bash
npm run build:all
```

### Run tests

```bash
npm test
npm run test:cov
```

### Swagger UI

Each service exposes Swagger at `http://localhost:<PORT>/api`:

| Service | Port | Swagger |
|---|---|---|
| gateway-api | 3000 | http://localhost:3000/api |
| notification-service | 3001 | — |
| audit-service | 3002 | http://localhost:3002/api |
| communication-service | 3003 | http://localhost:3003/api |
| organization-service | 3004 | http://localhost:3004/api |

### Distributed tracing (Jaeger)

Start Jaeger: `docker compose up jaeger -d`  
Open UI: http://localhost:16686

## CI/CD

The GitHub Actions workflow (`.github/workflows/nestjs-ci.yml`) runs on every push or PR that touches `services/**`:

1. **Lint** — ESLint with zero-warning policy
2. **Build** — compiles all 8 services
3. **Test** — Jest unit tests with coverage report

## Extraction roadmap

| Phase | Service | Status |
|---|---|---|
| 0 | Foundation (monorepo + gateway + libs) | ✅ Done |
| 1 (J15–J35) | notification-service | ✅ Implemented |
| 2 (J35–J55) | audit-service | ✅ Implemented |
| 3 (J55–J75) | communication-service | ✅ Implemented |
| 4 (J75–J90+) | organization-service | ✅ Implemented |
| 5 | profile-service | 🔲 Stub |
| 6 | identity-service (last, most sensitive) | 🔲 Stub |
| — | content-service | 🔲 Stub |

## Bridge strategy (Java → NATS)

Three options for publishing events from the Java monolith:

1. **Debezium CDC** (recommended for phases 1–2): capture PostgreSQL WAL changes without touching Java code
2. **NATS Java client**: add `io.nats:jnats` to Java modules and publish events at domain boundaries
3. **HTTP webhooks**: Java calls NestJS webhook endpoints (simplest, most coupled)

See `libs/contracts/src/events/` for all event shapes.
