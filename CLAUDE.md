# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Tally is a notepad-calculator PWA: each line of a CodeMirror document is evaluated with Math.js and its result is shown at the right of that line.

## Commands

Bun is the package manager, but Vite and Vitest run on Node 20.

- `bun run start`: Vite dev server on port 3000, served under the `/tally/` base path
- `bun run build`: production build to `dist/`. `bun run deploy` builds and publishes `dist/` to GitHub Pages.
- `bun run test`: run the suite once. **Use `bun run test`, not `bun test`.** `bun test` starts Bun's test runner, not Vitest.
- `bun run test -- test/evaluate.test.ts` runs one file; add `-t "<name>"` to filter by test name.
- `bun run test:coverage`: enforces the thresholds in `vitest.config.ts` (set just below current coverage, so drops fail the run)
- `bun run typecheck`: `tsc --noEmit`

- `bun run lint`: Biome lint, format, and import-order check (`biome.json`). `bun run lint:fix` applies safe fixes; `bun run format` only formats.

Biome's `useBlockStatements` is off, so single-statement `if`/`for` bodies go without braces, matching the existing code.

There must be exactly one copy of `@codemirror/state` in `node_modules` (`find node_modules -path "*@codemirror/state/package.json"`). If `@codemirror/view` needs a newer `state` than the top-level one, bun nests a second copy, and the editor throws "No tile at position undefined" when you click or type. Bump `@codemirror/state` to match, then delete `node_modules` and reinstall, because `bun install` leaves the old nested copies on disk.

Currency rates come from CurrencyFreaks via `VITE_CURRENCY_API_KEY`, which is set in the gitignored `.env` (template in `.env.example`). If the key is missing or the request fails, `defaultExchangeRates` defines only USD, so other currencies don't exist as units.

## Architecture

The calculation pipeline is in pure functions that take `math` as an argument. Each has a thin React hook wrapper that pulls `math` from context. Tests call the pure functions directly.

1. **`src/components/Maths.ts`**: `Maths()` builds the configured Math.js instance asynchronously: BigNumber mode (precision 64), date arithmetic (`Date ± Unit`, `Date - Date`), custom units (px, pt, em, mph, coins), and one unit per currency created from fetched exchange rates (5s timeout, then fallback rates). `defaultScope()` provides `today`, `now`, `yesterday`, `tomorrow`.
2. **`src/hooks/evaluate.ts`**: `evaluateLines(math, lines, scope)` evaluates the whole document top to bottom with one shared scope and returns a `Map<lineIndex, result>` (0-based; `null` for blank, invalid, or non-value lines). Before preprocessing it handles document-level syntax:
   - a line starting with an operator continues from `last` (the previous result)
   - `lineN` references (1-based) are replaced with that line's result
   - `sum`/`total`/`avg`/`average`/`mean` aggregate the contiguous block of results above the line
   - mutable results (matrices, arrays, objects) are cloned so later lines can't change earlier results
3. **`src/hooks/preprocess.ts`**: `preprocess(text)` rewrites one line's text into valid Math.js: strips thousands commas, expands `k`/`M` suffixes, wraps date literals in `date("...")`, converts currency symbols, and so on.
4. **`src/hooks/format.ts`**: `format(math, value, settings)` turns a result into display text (dates, currency, commas, precision).

**UI wiring:** `src/context.tsx` + `src/reducer.ts` hold `math`, `doc`, `lines`, `results`. The doc is persisted to `localStorage` (`reducer.ts` reads it at import time, which is why `test/setup.ts` mocks `src/context`). `Editor.tsx` updates `lines` on every change, which re-runs `evaluateLines` over the whole document. `src/hooks/results.ts` is a CodeMirror `ViewPlugin` that renders a widget per line from `results` and copies the value to the clipboard on click. Syntax highlighting and autocomplete keyword lists are in `src/helpers/syntax.ts` and `src/data/keywords.{ts,json}`.

## Tests

- `test/setup.ts` mocks `src/context` and replaces `fetchExchangeRates` with fixed rates (USD base), so tests make no network calls.
- `vitest.config.ts` pins `TZ=UTC`; `equations.test.ts` also freezes the date to 2026-01-15.
- `test/equations.txt` is a large end-to-end document. Its evaluated transcript is compared against `test/__snapshots__/equations.txt`. Add new syntax cases there; after an intended behavior change, review the diff and update with `bun run test -- -u`.
- Coverage only counts the calculation modules listed in `vitest.config.ts`; UI code isn't unit tested.
