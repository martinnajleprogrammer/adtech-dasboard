# AdTech Publisher Dashboard

A publisher-side dashboard that simulates header-bidding auctions for ad slots and shows their outcome and revenue in real time. Built as a practice project to apply modern Next.js, Tailwind and frontend system design on a domain I know from production AdTech work (Prebid.js, header bidding).

**Live demo:** ![Vercel app](https://adtech-dasboard.vercel.app/)

![Dashboard screenshot](./docs/screenshot.png)

## What it does

- Renders a responsive grid of ad slot cards from mock data.
- Runs a simulated auction per slot on the server, each with its own floor price and a 5-second timeout. Cards stream in as each auction finishes, behind a skeleton.
- Shows the result per slot (Winning, No Fill, Error).
- Shows a revenue total for the current round: the sum of the winning CPMs across all slots.
- Filters slots by status through the URL (`/?status=winning`). Invalid values fall back to "All". Changing the filter keeps the current UI visible while the new one renders, and the select updates immediately.
- Refreshes the dashboard every 5 seconds in the background. Cards already on screen stay visible while the new round loads.
- Typeahead search (limit of 10 results) backed by an `/api/search` route, with debounce, request cancellation, full keyboard navigation and ARIA combobox roles. It keeps its state while the server tree refreshes.
- Shows an error screen with a "Try again" button if the page fails to render.
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
app/          routes and API handlers (page.tsx is an async Server Component)
components/   UI: slot cards, revenue total, status filter and typeahead (client islands), live refresh
hooks/        useTypeAhead, useDebounce (typeahead only)
lib/          auctions, filter parsing, mock data
```

## Design decisions

- **Server Components first.** The page, the slot cards and the revenue total are async Server Components. Only the pieces that need browser interaction are client components ("islands"): the status filter, the typeahead and `LiveRefresh`. `'use client'` goes in the first module the server imports, and everything that module imports becomes client code too.
- **One `<Suspense>` boundary per slot, and one for the revenue total.** One slow auction doesn't block the rest of the grid, and the header doesn't wait for the cards.
- **The filter lives in the URL.** The server reads `searchParams` (a Promise in this Next.js version) and validates it with `parseFilter`. The URL can be shared, reloaded and used with the back button. `StatusFilter` calls `router.replace` inside `useTransition`, and `useOptimistic` shows the selected value without waiting for the server.
- **Pure auction logic in `lib/auctions.ts`.** `resolveAuction` has no side effects and is easy to test. `runAuction` adds the simulated latency, and `getAuctionResult = cache(runAuction)` makes everything in one render share the same auction round per slot. The revenue total asks for every slot with `Promise.all` and gets the same promises the cards use, so it always matches what the cards show and doesn't run extra auctions.
- **Refresh without flicker.** `LiveRefresh` schedules the next `router.refresh()` only when the previous transition has finished, so refreshes can't pile up. React keeps the visible content during a transition, so cards don't go back to their skeleton.
- **Container queries** instead of viewport breakpoints so a slot card works the same in any layout.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Known limitations and next steps

- Data is mocked; no real Prebid.js or ad server integration (see my [prebid-playground](https://github.com/martinnajleprogrammer/prebid-playground) for that side).
- **The filter is applied on the server, after each auction.** Cards that don't match disappear, so the grid reflows instead of leaving empty cells.
- **Each filter change, reload or live refresh runs a new round of auctions.** `cache()` only lasts for a single render, so results aren't kept between requests. Results are random, which means the same slot can show a different outcome after changing the filter.
- **Revenue total is per round, not accumulated.** It sums the CPM of every winning slot, including those hidden by the filter, because the filter is a view and doesn't change the round. It assumes a single currency; the mock bidders only use one, so it doesn't convert or validate currencies.
- **Live refresh is polling, not push.** `LiveRefresh` calls `router.refresh()` inside a transition every 5 seconds (waiting for the previous refresh to finish), so visible cards stay on screen instead of going back to their skeleton. Each tick re-renders the whole route on the server, not only the widgets that changed. For real-time data in production I would poll just the widgets that change (SWR or React Query against a JSON endpoint) or use SSE.
- **No page-level banner for failed auctions.** A failed auction is just data: the card shows the Error status. Unexpected render exceptions are caught by `app/error.tsx` (with "Try again"). The old "last successful update" message was removed along with the client-side polling.
- The `/api/auctions` endpoint is kept for external calls, but the dashboard no longer uses it.
- The error boundary covers the whole route, so one broken card replaces the grid. A boundary per card (`catchError`) is a next step.
- Planned:
  - Show the time of the last completed round in the header.
  - Playwright E2E tests for the filter and search flows. Cards stream in and results are random (5% errors), so tests have to wait on roles and text and not on a fixed outcome.
  - A pass over loading and error states per widget, and accessibility (keyboard, focus, contrast, `aria-busy` and `aria-live`).
  - A second view: slot detail with auction history and a simple chart.
