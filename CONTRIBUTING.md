# Contributing to Nowcast Jobs

Thanks for considering a contribution.

## Development workflow

1. Fork or branch from `main`.
2. Install dependencies with `pnpm install`.
3. Copy `.env.example` to `.env.local` and add only the credentials required for the feature you are testing.
4. Keep changes focused and avoid committing generated files, credentials, or user data.
5. Run `pnpm typecheck` and `pnpm build` before opening a pull request.

## Pull requests

Please include:

- a concise explanation of the problem and solution;
- screenshots for visible UI changes;
- notes about new environment variables, migrations, or data changes;
- any relevant testing steps.

Prefer small, reviewable pull requests over broad rewrites.

## Code conventions

- Use TypeScript for application code.
- Validate external and AI-generated data at boundaries.
- Prefer structured model outputs to parsing free-form generated text.
- Do not return fabricated placeholder results when a model or external service fails.
- Keep secrets in environment variables.
- Treat external job, salary, conference, and company data as potentially stale.

## Issues

Bug reports and feature requests are welcome. For security vulnerabilities, follow `SECURITY.md` instead of posting sensitive details in a public issue.
