# 3D Print Cost Calculator

Estimate the true cost of 3D-printed parts with a web-based calculator built using Next.js, TypeScript, and Tailwind CSS. The tool keeps your data local (via `localStorage`) and covers all the key cost drivers mentioned in the prompt:

- Material cost (filament)
- Electricity usage
- Machine wear / depreciation
- Failure risk buffer
- Labor and markup

## Getting started

Install dependencies (uses npm):

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Key features

- Adjustable inputs for filament, power draw, print time, machine rate, risk %, labor, and markup presets.
- Detailed breakdown (material, energy, machine, risk, labor, subtotal, and totals with markup).
- Save/load/delete estimates locally for quick reuse—no backend required.

## Tech stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- LocalStorage persistence
