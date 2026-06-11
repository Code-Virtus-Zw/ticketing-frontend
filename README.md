# HKD Admin — React Frontend

Super administrator web panel for the HKD Events ticketing system. Provides a desktop-optimized dashboard for viewing system-wide data, managing events and bookings, monitoring sync health, and generating reports.

---

## Purpose

The Flutter mobile app is used by gate staff and field administrators for ticket validation and event operations. This React frontend is designed for **super administrators** who need a comprehensive view of the entire system.

Capabilities include:
- Aggregate dashboard with key metrics
- Event browsing with detail views and ticket breakdowns
- Booking search, filtering, and manual check-in
- Verification audit log
- Sales and attendance reporting
- WordPress sync management (trigger, monitor, diagnose)

---

## Architecture

```
React Frontend (port 3000)
       │
       ├── /wp-json/hkd-events/v1/* ──► Spring Boot API (compatible endpoints)
       │
       └── /api/admin/* ──► Spring Boot API (admin endpoints)
```

The Vite dev server proxies all `/wp-json/` and `/api/` requests to the Spring Boot backend running on `localhost:8080`. In production, both would be served from the same origin or a reverse proxy.

---

## Pages

### Login
Authenticates using the same WordPress-compatible credentials (username + mobile app password). Stores the Bearer token in `localStorage` for session persistence.

### Dashboard
- Summary cards: total events, total attendees, today's check-ins, pending sync queue items
- Quick action buttons linking to Events, Bookings, Sync, and Reports

### Events
- Searchable event list with status badges
- Event detail modal showing: venue, dates, ticket types with capacity/price/availability, sales stats
- All data is read from the synced local database

### Bookings
- Searchable booking list with event filter and status filter (`issued`, `used`, `pending`)
- Pagination with prev/next navigation
- Booking detail modal showing: customer info, ticket code, verify URL, PDF download link
- **Manual check-in** button for super admin override

### Verifications
- Audit log of all checked-in tickets
- Search by ticket code
- Shows ticket code, event, customer, and check-in timestamp

### Reports
- Aggregate sell-through metrics: total capacity, total sold, checked-in count, sell-through rate
- Per-event breakdown table with capacity, sold, checked-in, and remaining counts

### Sync Management
- Sync status overview (queue count, last sync times per entity type)
- Sync state table showing status (`idle`, `syncing`, `error`) per entity
- **Trigger Full Sync** button for manual refresh

### Settings
- Current user info display (username, display name, email, permissions)
- System information about the application and backend

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (proxies API to localhost:8080)
npm run dev
```

Opens at `http://localhost:3000`. Login with the same credentials used for the Flutter mobile app.

---

## Development Proxy

The `vite.config.js` proxies API requests to the Spring Boot backend:

```js
server: {
  port: 3000,
  proxy: {
    '/wp-json': { target: 'http://localhost:8080', changeOrigin: true },
    '/api':     { target: 'http://localhost:8080', changeOrigin: true },
  },
}
```

For production, serve the built frontend from Spring Boot's `src/main/resources/static/` or use a reverse proxy (Nginx, Caddy).

---

## Build

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server.

---

## Dependencies

- **React 19** — UI framework
- **React Router 7** — client-side routing
- **Recharts 2** — charting library (for future chart additions)
- **Vite 8** — build tool and dev server
