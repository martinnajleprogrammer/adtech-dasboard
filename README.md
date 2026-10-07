# AdTech Publisher Dashboard

A publisher-side dashboard that simulates header-bidding auctions for ad slots and shows their outcome and revenue in real time. Built as a practice project to apply modern Next.js, Tailwind and frontend system design on a domain I know from production AdTech work (Prebid.js, header bidding).

**Live demo:** _add Vercel URL here_

![Dashboard screenshot](./docs/screenshot.png)

## What it does

- Renders a responsive grid of ad slot cards from mock data.
- Runs a simulated auction per slot, each with its own floor price and a 5-second timeout.
- Shows the result per slot (Winning, No Fill, Error, Pending) and a running revenue total.
- Filters slots by status, client-side.
- Typeahead search over slots (limit of 10 results) backed by an `/api/search` route.
- Surfaces auction errors in a banner that shows the time of the last successful update.
- Cards use container queries, so they adapt to their own width rather than the viewport.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, class-variance-authority for component variants |
| Data | Mock ad slots and simulated auctions (no real ad server calls) |

## Project structure

```
app/          routes and API handlers
components/   UI: slot cards, typeahead, filters
hooks/        useAuctions, useFilter
lib/          mock data and helpers
```

## Design decisions

- **Auction state lives in a custom hook (`useAuctions`)**, so the UI components stay presentational and the auction logic can be tested in isolation.
- **Per-slot error and timeout handling**: one slow or failed auction shouldn't block the rest of the grid.
- **Client-side filtering** keeps the interaction instant for a dataset of this size; with real volume I'd move filtering to the server and paginate or virtualize the grid.
- **Container queries** instead of viewport breakpoints so a slot card works the same in any layout.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Known limitations and next steps

- Data is mocked; no real Prebid.js or ad server integration (see my [prebid-playground](https://github.com/martinnajleprogrammer/prebid-playground) for that side).
- The main page is a client component; next step is moving the initial data load to a Server Component and streaming slow widgets behind Suspense.
- No automated tests yet; planned: Playwright E2E for the filter and search flows.