# Repository Guidelines

## Project Structure & Module Organization
- `src/app` holds the Next.js App Router entry points (`layout.tsx`, `page.tsx`) and global styles in `globals.css`.
- `src/lib` contains core logic and browser persistence helpers (e.g., `calculations.ts`, `storage.ts`).
- Configuration lives at the repo root (`next.config.js`, `tailwind.config.ts`, `tsconfig.json`).

## Build, Test, and Development Commands
- `npm install`: install dependencies (lockfile present for pnpm, but npm is documented).
- `npm run dev`: start the local Next.js dev server at `http://localhost:3000`.
- `npm run build`: create the production build.
- `npm run start`: run the production server after a build.
- `npm run lint`: run Next.js ESLint checks.

## Coding Style & Naming Conventions
- TypeScript is the primary language; keep types explicit for shared data (`CalculatorInput`, `CalculatorResult`).
- Use 2-space indentation and match existing formatting patterns in `src/lib` and `src/app`.
- Prefer descriptive, camelCase function and variable names (e.g., `calculateCosts`).
- Keep UI styles in Tailwind classes; avoid inline style objects unless necessary.

## Testing Guidelines
- No automated tests are configured yet. If adding tests, follow Next.js conventions and document the runner and commands here.
- Until tests exist, validate changes by running `npm run lint` and exercising the calculator flow in the browser.

## Commit & Pull Request Guidelines
- Commit history uses short, imperative summaries (e.g., “Create 3D print cost calculator”). Follow that pattern.
- PRs should include: a brief summary, linked issue (if any), and screenshots or a short clip for UI changes.
- Note any data model or calculation changes explicitly in the PR description.

## Security & Configuration Tips
- The app stores estimates in `localStorage`; avoid adding secrets or server-only keys to the client.
- If introducing environment variables, document them in `README.md` and keep them prefixed for Next.js (e.g., `NEXT_PUBLIC_`).
