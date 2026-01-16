# Self-Action-Tracking Dashboard 

- React-based analytics dashboard with interactive charts and real-time tracking.
- FastAPI backend for product analytics with Supabase (PostgreSQL).


## Tech Stack

- **FastAPI** - async Python web framework
- **Supabase** - PostgreSQL + Auth + RLS
- **Pydantic** - data validation
- **React 19** + TypeScript + Vite
- **Tailwind CSS 4** for styling
- **Nivo Charts** for data visualization
- **Axios** for API calls
- **js-cookie** for filter persistence

## Architectural Choices

**React 19**: Selected based on past development experience. React holds 44.7% popularity in Stack Overflow 2025 survey and ~40% frontend framework market share—the most popular choice for building component-based UIs. Its virtual DOM and declarative approach make dashboard development straightforward.

**Tailwind CSS 4**: Chosen from prior project familiarity. Tailwind ranks #1 in State of CSS 2025 (51% satisfaction) with 31M+ weekly npm downloads. Utility-first approach enables rapid UI iteration without context-switching to separate CSS files.

**Nivo Charts**: Built on D3.js with 12K+ GitHub stars. Provides declarative, responsive charts with built-in theming, SSR support, and multiple rendering modes (SVG/Canvas/HTML). Good balance between customization and ease of use for analytics dashboards.

**FastAPI**: Selected based on past backend development experience. FastAPI has 78K+ GitHub stars, 38% usage in State of Python 2025, and benchmarks at 15-20K requests/sec. Native async support, automatic OpenAPI documentation, and Pydantic integration provide type safety with minimal boilerplate.

**Supabase**: Chose from prior familiarity. Supabase reached $5B valuation with 4M+ developers and 55% YC company adoption—the leading open-source Firebase alternative. Provides managed PostgreSQL with built-in auth, row-level security, and real-time subscriptions out of the box.

## Run Locally

### Frontend

```bash
# Install dependencies
npm install

# Create .env.local with:
# VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

Runs at `http://localhost:5173`

## Build

```bash
npm run build
npm run preview
```

### Backend

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

## Dashboard Guide

### Stats Cards (Top Row)
- **Total Clicks**: Sum of all tracked interactions across all features
- **Top Feature**: Most clicked feature with its click count
- **Daily Average**: Mean clicks per day over the selected period
- **Features Tracked**: Number of unique UI elements being tracked

### Filters
- **Date Range Picker**: Filter analytics to a specific time period (both dates required)
- **Age Group**: Filter by user demographics (`<18`, `18-40`, `>40`)
- **Gender**: Filter by user gender (`Male`, `Female`, `Other`)
- **Refresh Button**: Manually re-fetch analytics data from the server
- **Clear Filter Chip**: When a bar is selected, click the "×" chip to clear the feature filter

### Charts
- **Bar Chart (Feature Clicks)**: Shows click count per tracked feature. **Click any bar** to filter the line chart to show only that feature's daily trend
- **Line Chart (Daily Trend)**: Displays clicks over time. Shows all features combined by default, or a single feature when a bar is selected

### Meta-Analytics
The dashboard tracks its own usage—every filter change, chart interaction, and button click is recorded as an event. This demonstrates the tracking system in action.

### Filter Persistence
Filter selections are saved to cookies per user. When you return, your last filter configuration is automatically restored.

## Scaling to 1M Writes/Min

### Frontend
To support a massive global user base and ensure fast load times:

1. **CDN (Content Delivery Network):** All static assets (HTML, CSS, JavaScript chunks, images) are offloaded to a **CDN** (like AWS CloudFront, Cloudflare, or Vercel Edge). This serves content from servers closest to the user, strictly minimizing latency.
2. **Optimistic Updates:** The UI implements optimistic updates for tracking events—requests are non-blocking (fire-and-forget), and the dashboard polls for cached aggregates every 5-30s rather than real-time streaming for every single event.
3. **Edge Caching:** API responses for public dashboards are cached at the edge using `stale-while-revalidate` strategies.
4. **Event Batching:** The client library batches multiple track events into a single HTTP request to reduce network overhead on high-traffic sessions.


### Backend
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