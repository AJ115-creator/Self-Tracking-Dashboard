# Vigility Analytics Dashboard - Frontend

React-based analytics dashboard with interactive charts and real-time tracking.

## Tech Stack

- **React 19** + TypeScript + Vite
- **Tailwind CSS 4** for styling
- **Nivo Charts** for data visualization
- **Axios** for API calls
- **js-cookie** for filter persistence

## Architectural Choices

**React 19**: Selected based on past development experience. React holds 44.7% popularity in Stack Overflow 2025 survey and ~40% frontend framework market share—the most popular choice for building component-based UIs. Its virtual DOM and declarative approach make dashboard development straightforward.

**Tailwind CSS 4**: Chosen from prior project familiarity. Tailwind ranks #1 in State of CSS 2025 (51% satisfaction) with 31M+ weekly npm downloads. Utility-first approach enables rapid UI iteration without context-switching to separate CSS files.

**Nivo Charts**: Built on D3.js with 12K+ GitHub stars. Provides declarative, responsive charts with built-in theming, SSR support, and multiple rendering modes (SVG/Canvas/HTML). Good balance between customization and ease of use for analytics dashboards.

## Run Locally

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

## Scaling & Performance

To support a massive global user base and ensure fast load times:

1. **CDN (Content Delivery Network):** All static assets (HTML, CSS, JavaScript chunks, images) are offloaded to a **CDN** (like AWS CloudFront, Cloudflare, or Vercel Edge). This serves content from servers closest to the user, strictly minimizing latency.
2. **Optimistic Updates:** The UI implements optimistic updates for tracking events—requests are non-blocking (fire-and-forget), and the dashboard polls for cached aggregates every 5-30s rather than real-time streaming for every single event.
3. **Edge Caching:** API responses for public dashboards are cached at the edge using `stale-while-revalidate` strategies.
4. **Event Batching:** The client library batches multiple track events into a single HTTP request to reduce network overhead on high-traffic sessions.
