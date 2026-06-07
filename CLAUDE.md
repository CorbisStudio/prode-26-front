# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
pnpm install          # Install dependencies
pnpm start            # Dev server (http://localhost:4200)
pnpm build            # Production build → dist/world-cup-prode/
pnpm test             # Unit tests (Vitest, single run)
pnpm test:watch       # Unit tests in watch mode
pnpm lint             # ESLint
pnpm format           # Prettier
```

To run a single test file: `pnpm vitest run src/path/to/file.spec.ts`

## Architecture

Angular 20 SPA — **no NgModules, no Zone.js, no NgRx**. Every component is standalone.

### Core patterns

- **Zoneless**: `provideZonelessChangeDetection()` in `app.config.ts`. All reactivity is via signals.
- **`httpResource()`**: Angular 19+ API used throughout `ProdeApiService` for declarative data fetching. Returns a `ResourceRef<T>` with `.value()`, `.isLoading()`, `.error()` signals — not Observables. Used for read endpoints; write endpoints use `HttpClient` directly.
- **Control flow**: Native `@if`, `@for`, `@switch` in templates. Never `*ngIf` / `*ngFor`.
- **Lazy loading**: All feature pages use `loadComponent` in `app.routes.ts`.

### Layer structure

```
core/
  models/         # TypeScript interfaces: BackendMatch, BackendPrediction, Match, Team, etc.
  services/       # ProdeApiService, AuthService, PredictionService
  interceptors/   # authInterceptor — attaches Bearer token; redirects to /login on 401
  utils/          # standings-calculator.ts (pure function, no DI)
features/
  home/           # Landing page + login page
  matches/        # Fixture with date/group/standings view toggle and status filter
  standings/      # Group standings table
  predictions/    # User's saved predictions with point badges
  bracket/        # Knockout stage
  ranking/        # Global leaderboard with pagination and confetti for #1
shared/
  components/     # LayoutComponent (shell), HeaderComponent, FooterComponent
  pipes/          # FormatDatePipe
  utils/          # date.utils.ts (canPredict, formatMatchTime, getRelativeDateLabel)
```

### Services

- **`ProdeApiService`** (`core/services/prode-api.service.ts`): All HTTP. Base URL `https://prode.vera-demo.site/api`. Read methods return `httpResource`; write methods return `Observable`.
- **`AuthService`** (`core/services/auth.service.ts`): Persists JWT pair to `localStorage` (`prode_access_token`, `prode_refresh_token`, `prode_user_data`). Exposes `user` and `isAuthenticated` as computed signals.
- **`PredictionService`** (`core/services/prediction.service.ts`): In-memory `signal<Map<number, MatchPrediction>>`. Loaded once at startup. Scoring: **3 pts** for exact scoreline, **1 pt** for correct winner/draw.

### Auth flow

`authInterceptor` clones every non-public request and injects `Authorization: Bearer <token>`. A 401 on any non-public endpoint calls `auth.logout()` and navigates to `/login`. Public endpoints: `/token/`, `/token/refresh/`, `/token/verify/`.

### Styling

Tailwind CSS v4 (`@use "tailwindcss"` in `styles.scss`). Custom design tokens defined in the `@theme` block:

| Token | Value | Use |
|-------|-------|-----|
| `celeste` | `#2563EB` | Primary blue (Argentine flag) |
| `dorado` | `#FCB500` | Gold / accent |
| `noche` | `#0F172A` | Primary text |
| `gris` | `#64748B` | Secondary text |
| `cancha` | `#15803D` | Green (field / success) |

Reusable CSS classes defined in `styles.scss`: `.glass`, `.surface`, `.surface-elevated`, `.surface-heavy`, `.glass-nav`, `.glass-pill`, `.glass-input`, `.glass-score-input`, `.btn-dorado`. Use these instead of duplicating their shadow/border/backdrop definitions inline.

### Prediction input UX

`MatchCardComponent` uses an 800 ms debounce before saving. Predictions are locked 1 hour before kickoff (`canPredict` in `date.utils.ts`). Once a match is `FINISHED` or closed, inputs are hidden and the stored prediction is shown read-only.
