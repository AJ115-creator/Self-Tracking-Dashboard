# Vigility Analytics Dashboard - Backend

FastAPI backend for product analytics with Supabase (PostgreSQL).

## Tech Stack

- **FastAPI** - async Python web framework
- **Supabase** - PostgreSQL + Auth + RLS
- **Pydantic** - data validation

## Architectural Choices

**FastAPI**: Selected based on past backend development experience. FastAPI has 78K+ GitHub stars, 38% usage in State of Python 2025, and benchmarks at 15-20K requests/sec. Native async support, automatic OpenAPI documentation, and Pydantic integration provide type safety with minimal boilerplate.

**Supabase**: Chose from prior familiarity. Supabase reached $5B valuation with 4M+ developers and 55% YC company adoption—the leading open-source Firebase alternative. Provides managed PostgreSQL with built-in auth, row-level security, and real-time subscriptions out of the box.

## Run Locally

```bash
cd Backend

#add dependencies
uv add -r requirements.txt

# Using uv (recommended)
uv run uvicorn main:app --reload

# Or traditional venv
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Create `.env`:
```
SUPABASE_URL=your_url
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
FRONTEND_URL=http://localhost:5173
```

Runs at `http://localhost:8000`

## Seed Data

```bash
uv run python seed.py
```

Creates 55 users and 500 click events across all age groups and genders.

## Scaling to 1M Writes/Min

To handle 1 million write-events per minute (~16k req/sec), the architecture evolves to decouple ingestion from processing:

1. **Message Queue (Apache Kafka):** Introduce Apache Kafka as a high-throughput event buffer. The `/track` endpoint becomes a lightweight producer that pushes events to a Kafka topic immediately (<10ms latency). This protects the database from load spikes and ensures no data loss.
2. **Background Jobs (Inngest):** Use **Inngest** to reliably consume events from the queue (or directly from API for lower volumes) and handle asynchronous processing. Inngest manages retries, flow control, and prevents worker overload.
3. **Time-Series Database:** Migrate raw event storage from PostgreSQL to a specialized Time-Series Database like **TimescaleDB** or **ClickHouse**. These are optimized for massive ingest rates and time-range aggregations. PostgreSQL remains the source of truth for user/relational data.
4. **Redis Cache:** Implement **Redis** to cache aggregated dashboard queries (daily actives, retention cohorts) and handle rate limiting. This reduces load on the analytical database for read-heavy dashboard views.
5. **Materialized Views:** Pre-compute common metrics (e.g., "daily page views") using materialized views or continuous aggregates, so dashboard queries are instant.

## Deployment & DevOps

To ensure high availability and scalability in production:

- **Dockerization:** The FastAPI backend is fully containerized using **Docker**. A multi-stage user build ensures a small, secure image footprint.
- **AWS ECR & ECS:**
  - Build images are pushed to **AWS Elastic Container Registry (ECR)**.
  - The application is deployed on **AWS Elastic Container Service (ECS)** using **Fargate** for serverless compute.
- **Horizontal Scaling:** We run multiple container replicas behind an **AWS Application Load Balancer (ALB)**. If one container fails, ECS health checks automatically replace it. Auto-scaling rules add more containers during traffic spikes.
- **CI/CD:** Automated pipelines (GitHub Actions) run tests, build Docker images, and deploy to ECS on every merge to main.
