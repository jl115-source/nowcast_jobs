# Nowcast Jobs

An open-source career discovery platform for professionals working across climate, weather, energy, geospatial, insurance, data science, and research.

Nowcast Jobs brings together a curated job board, AI-assisted CV analysis, job matching, career resources, conferences, company discovery, notifications, and mentoring workflows in one modern web application.

## Features

- Curated jobs across weather, climate, energy, geospatial, insurance, finance, research, and data science
- CV parsing and structured profile extraction
- AI-assisted CV improvement suggestions
- Candidate-to-role matching with structured scoring
- Job alerts and subscription workflows
- Company, certification, conference, and career-resource directories
- Mentor matching and off-market opportunity workflows
- Responsive interface with light/dark theme support

## Tech stack

- **Framework:** Next.js 14 + React + TypeScript
- **UI:** Tailwind CSS, Radix UI, shadcn-style components
- **AI:** Vercel AI SDK + Groq
- **Backend / auth:** Supabase
- **Validation:** Zod
- **Package manager:** pnpm

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9+
- A Groq API key for AI-powered features
- A Supabase project for authentication and persistence features

### Installation

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open `http://localhost:3000`.

### Environment variables

```env
GROQ_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

See `.env.example` for details. Never commit real credentials.

## Development

```bash
pnpm dev        # start the development server
pnpm typecheck  # run TypeScript checks
pnpm build      # create a production build
pnpm start      # run the production build
```

## Project structure

```text
app/          Next.js application routes and API handlers
components/   Application and UI components
data/         Curated job and conference datasets
lib/          Shared utilities and Supabase clients
public/       Static assets and public reference datasets
scripts/      Supabase schema and migration SQL
```

## Data and AI notes

The repository contains curated/example datasets intended for development and demonstration. Job listings, salaries, contact details, conference information, and external links can become stale and should be independently verified before use.

AI-generated CV analysis and matching outputs are decision-support features, not guarantees of hiring outcomes. Contributors should avoid introducing fabricated fallback scores or presenting generated assessments as objective facts.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

For security issues, follow [SECURITY.md](SECURITY.md) rather than posting sensitive details publicly.

## License

Released under the [MIT License](LICENSE).
