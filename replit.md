# Semantica

## Overview

Semantica is a web application for reading Wittgenstein's *Tractatus Logico-Philosophicus* in an interactive, semantically-enhanced way. It presents the text in English, French, and German, allowing users to click on highlighted words to see semantic alternatives (synonyms) or logic translations. The app features a collapsible tree structure matching the Tractatus's hierarchical numbering system, a 3D animated star sphere visualization, and a password-protected editor for managing synonym/expression groups stored in a PostgreSQL database. The German version includes a prominent warning that it has not been proofread yet.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React SPA)
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with three pages: Home (`/`), Editor (`/editor`), and Connexion Graph (`/graph`)
- **State Management**: React Query (`@tanstack/react-query`) for server state; React Context (`SemanticContext`) for sharing synonym group data across components
- **UI Components**: shadcn/ui component library (new-york style) built on Radix UI primitives, styled with Tailwind CSS v4 (using `@tailwindcss/vite` plugin)
- **Animations**: Framer Motion for word swap animations
- **Math Rendering**: KaTeX for rendering mathematical notation in propositions
- **Design**: Dark theme (black background, green/teal accent colors), uses Inter and Space Grotesk fonts

### Key Frontend Components
- **SemanticWord**: Clickable words that show a popover with synonym alternatives from the same group; accepts optional `onSwap` callback for grammar adaptation
- **LogicWord**: Clickable words that toggle between original text and a logical translation
- **MathText**: Renders inline LaTeX math expressions using KaTeX
- **StarSphere**: Canvas-based 3D particle sphere animation on the homepage
- **PropositionSegments**: Wrapper component (in Home.tsx) that renders proposition segments with grammar-aware text adaptation — when a semantic word swaps, dependent verbs/participles silently adapt (e.g., "Le monde est" → "Tous les faits sont")
- **semanticParser**: Takes raw proposition text and synonym groups, produces segments (text, semantic, or logic) for rendering
- **grammarAdaptations**: Data file (`client/src/lib/grammarAdaptations.ts`) defining per-proposition rules for verb/participle agreement when semantic words change gender/number (FR propositions 1, 1.1, 1.11, 1.12, 1.13, 2.063; EN propositions 1, 1.1, 1.11, 1.12, 1.13)

### Backend (Express + Node.js)
- **Framework**: Express.js running on Node.js with TypeScript (via tsx)
- **API**: RESTful CRUD endpoints under `/api/synonym-groups` for managing synonym/expression groups; `/api/feedback` for user feedback submissions
- **Database**: PostgreSQL via `pg` driver, with Drizzle ORM for query building and schema management
- **Schema**: Two tables — `synonym_groups` with columns: `id` (serial PK), `language` (text, 'en', 'fr', or 'de'), `words` (text array), `type` (text, 'semantic' or 'logic'), `group_key` (text, nullable — links related groups across languages), `excluded_propositions` (text array, nullable — proposition IDs where this group is neutralized); `feedback` with columns: `id` (serial PK), `proposition_id` (text), `language` (text), `message` (text), `created_at` (timestamp)
- **Storage Pattern**: Interface-based storage layer (`IStorage`) implemented by `DatabaseStorage` class

### Data Flow
1. Tractatus text is stored as static TypeScript data files (`tractatusRaw.ts`) containing raw propositions scraped from the Wittgenstein Project
2. Synonym groups are fetched from the database via the API
3. The `semanticParser` function normalizes non-breaking spaces, splits at `[math]...[/math]` boundaries, then dynamically parses plain text against active synonym groups to produce interactive segments
4. Groups are filtered by language to match the currently selected language
5. EN and FR texts use different spacing conventions (EN: spaces after commas in `f(x, y)`, FR: no spaces `f(x,y)`); DB entries exist for both variants

### Build System
- Development: Vite dev server with HMR, proxied through Express
- Production: Vite builds the client to `dist/public`, esbuild bundles the server to `dist/index.cjs`
- Database migrations: `drizzle-kit push` for schema synchronization

### Authentication
- Server-side token-based authentication protects all mutating API endpoints (POST, PUT, DELETE on synonym-groups, import)
- Admin password stored as `ADMIN_PASSWORD` environment secret (not in code)
- Login endpoint (`POST /api/auth/login`) validates password and returns a random 32-byte hex token
- Tokens are stored in-memory on the server with 24-hour TTL, and in `sessionStorage` on the client
- Auth middleware (`requireAuth`) checks Bearer token on protected routes
- Read-only endpoints (GET synonym-groups, feedback) remain publicly accessible
- Logout endpoint (`POST /api/auth/logout`) invalidates the server-side token

## External Dependencies

### Database
- **PostgreSQL**: Required, connected via `DATABASE_URL` environment variable. Used for storing synonym groups. Uses Drizzle ORM with `drizzle-kit` for schema management.

### Key NPM Packages
- **drizzle-orm** + **drizzle-zod**: ORM and schema validation
- **express**: HTTP server
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animations
- **katex**: Math rendering
- **cheerio**: HTML parsing (used in scraping scripts, not runtime)
- **wouter**: Client-side routing
- **zod**: Schema validation

### Scraping Scripts (Development Only)
- `scrape_tractatus.js`, `scrape_raw.js`, `parse_html.js`, `parse_tractatus.js`: Utility scripts that fetch Tractatus text from the Wittgenstein Project website and generate static TypeScript data files. These are not part of the runtime application.

### Fonts (External CDN)
- Google Fonts: Inter and Space Grotesk loaded via `fonts.googleapis.com`