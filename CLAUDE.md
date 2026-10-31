# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Best Bowling is a bowling score / team / handicap / cost-settlement app, built as an installable PWA with **no build step, no framework, no dependencies**: plain `index.html` + `css/style.css` + `js/docs.js` + `js/app.js`. All user data lives only in the device's `localStorage` (no server, no accounts). UI is bilingual (Korean default, English); the user communicates in Korean.

Live site: https://sedapa2010-k.github.io/best-bowling/ (GitHub Pages, served from `main` branch root of `sedapa2010-K/best-bowling`). `privacy.html` is the public privacy-policy URL intended for the Google Play listing.

## Commands

```bash
python -m http.server 5173          # local preview at http://localhost:5173 (also defined in .claude/launch.json)
node --check js/app.js              # syntax check — there is no linter or test suite
node tools/make-icons.mjs           # regenerate icons/ from the SVG art in the script (needs `sharp`; set SHARP_FROM to a path inside a folder where sharp is installed)
```

Deploy = commit and `git push` to `main`; GitHub Pages rebuilds automatically (`gh api repos/sedapa2010-K/best-bowling/pages/builds/latest --jq .status` until `built`). `gh` is installed at `C:\Program Files\GitHub CLI\gh.exe` (may not be on PATH in the Bash tool).

## Release checklist (easy to forget)

- **Bump `CACHE` in `sw.js`** (`best-bowling-vN`) on every deploy that changes app files, and add any new top-level file to its `ASSETS` list. The service worker is network-first with `cache: 'no-cache'` revalidation, so each launch already gets the latest files — stale-cache bugs were a real problem before this. Don't add a reload on `controllerchange`: it replays the launch splash (the user saw splash → app → splash).
- Verify at phone width (375×812) in both dark and light themes and in both languages; English strings are longer and have overflowed compact controls before.
- When testing in the browser pane, seed data by writing `localStorage['bestbowling:v1']` and clear it afterwards. Do **not** clear storage on the live origin — it may hold the user's real records.

## Architecture (js/app.js)

Single IIFE, ordered top to bottom: i18n → storage → UI state → icons → formatting → bowling scoring → sessions/stats helpers → per-tab render functions → keypad → image export → `actions` map → event wiring → boot.

- **Security**: all persisted/imported data passes through `normalize()` (`cleanSession`/`cleanCost`), which keeps only `ID_RE` ids, `DATE_RE` dates, clamped numbers and trimmed strings — extend it when adding stored fields. Every interpolated string in templates, including attribute values like `data-id`/`value`, goes through `esc()`. `index.html` and `privacy.html` carry a CSP meta tag (`script-src 'self'`, no inline scripts), so new scripts must be separate files and new external origins must be added to the CSP.
- **Rendering**: string templates; `render()` rebuilds `#view` (`innerHTML`) for the current tab plus the tab bar and frame keypad. Inputs that must keep focus while typing (scores, handicaps, fees) do **not** re-render; they update data and call `refreshRecordNumbers()` / `refreshCostNumbers()` to patch only the totals.
- **Events**: one delegated `click` listener dispatches `data-act="name"` to `actions[name](el)`; one `input` listener handles `data-inp` fields; `keydown` handles Enter in specific inputs. Add new interactions as `data-act` + an `actions` entry rather than per-element listeners.
- **State**: persisted `db` (`STORE_KEY = 'bestbowling:v1'`, shape normalized in `normalize()`: `members`, `sessions` keyed by `YYYY-MM-DD`, `costs` keyed by date, `settings`, `feeDefaults`) vs. ephemeral `ui` (tab, selected date, open calendar/keypad, stats period/view, filters, edit modes). `sess()`/`costDoc()` return an unsaved draft for dates with no record; `commit(s)`/`commitCost(c)` persist (a session with zero players is deleted).
- **Session model**: `{ date, teamMode, teamCount, teamNames[], firstPractice, players: [{id, name, hdcp, team}], games: [{ mode: 'final'|'frame', entries: { [memberId]: { score, rolls[] } } }], active }`. Players snapshot `name`/`hdcp` so deleted members' history survives; `pname()` prefers the live member name. Mode is **per game**; `entryScore()` picks `score` or computes from `rolls`.
- **Scoring**: `rolls` is a flat pin-count array. `frameState()` (next ball / pins standing / done), `splitFrames()`, `cumScores()`, `frameMarks()` implement 10-pin rules incl. the 10th frame; the keypad enables only legal keys from `frameState().standing`.
- **Cross-cutting rules that every aggregate must respect**:
  - `usedGames(s)` trims empty trailing games (new sessions start with `DEFAULT_GAMES = 4`) — results, images and stats iterate over it, not `s.games`.
  - `isPractice(s, gi)` excludes game 1 from totals/averages/stats when `firstPractice` is on (but cost settlement still counts it).
  - `teamLabel(s, ti)` for team names (custom per-session name or "A팀"/"Team A"); `entryPlayers(s)` for the team filter on the entry screen.
  - Money: `currency()` is `db.settings.currency` (KRW/USD/EUR, picked on the settle tab) or, if unset, won in Korean / dollars in English. `fmtMoney()` and `moneyInput()` follow it; won is whole numbers, USD/EUR allow cents. Fee inputs are text fields that keep 3-digit grouping while typing.
- **Share images** are drawn manually on `<canvas>` (`buildImage()` with `table`/`kv` blocks from `recordBlocks()` / `costBlocks()`), not screenshots; canvas width `W` grows with column count so scores never truncate. Export uses Web Share with files, falling back to download (iOS shows a long-press preview).
- **i18n**: `I18N.ko` / `I18N.en` dictionaries with `{0}` placeholders via `t(key, ...args)`; add every new key to both. Long-form documents (user guide, privacy policy, terms, open-source notices) live in `js/docs.js` as `window.BB_DOCS[lang][key] = {title, html}` and are shared by the Settings document viewer and `privacy.html`. Keep the open-source list in sync if fonts/icons/libraries change (icons include Feather-derived paths, MIT).

## Styling (css/style.css)

Design tokens on `:root` with dark overrides duplicated under both `:root[data-theme="dark"]` and `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` — change both blocks together. Look: navy/black with gold accents (`--gold`, `--gold-grad`), Playfair Display for display text. Team colors are fixed by index (`.t0`–`.t3` badges, `.tc0`–`.tc3` sections). Newer feature styles are appended in commented blocks at the end of the file.
