# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Best Bowling is a bowling score / team / handicap / cost-settlement app, built as an installable PWA with **no build step, no framework, no dependencies**: plain `index.html` + `css/style.css` + `js/docs.js` + `js/app.js` (plus `js/privacy.js` for the public policy page). All user data lives only in the device's `localStorage` (no server, no accounts). UI is bilingual (Korean default, English); the user communicates in Korean.

Live site: https://sedapa2010-k.github.io/best-bowling/ (GitHub Pages, served from `main` branch root of `sedapa2010-K/best-bowling`). `privacy.html` is the public privacy-policy URL intended for the Google Play listing.

## Commands

```bash
python -m http.server 5173          # local preview at http://localhost:5173 (also defined in .claude/launch.json)
node --check js/app.js              # syntax check — there is no linter or test suite
node tools/make-icons.mjs           # regenerate icons/ from the SVG art in the script (needs `sharp`; set SHARP_FROM to a path inside a folder where sharp is installed)
```

Deploy = commit and `git push` to `main`; GitHub Pages rebuilds automatically (`gh api repos/sedapa2010-K/best-bowling/pages/builds/latest --jq .status` until `built`). `gh` is installed at `C:\Program Files\GitHub CLI\gh.exe` (may not be on PATH in the Bash tool). Commits use the GitHub noreply author email set in the repo's local git config.

## Release checklist (easy to forget)

- **Bump `CACHE` in `sw.js`** (`best-bowling-vN`) on every deploy that changes app files, and add any new top-level file to its `ASSETS` list. The service worker is network-first with `cache: 'no-cache'` revalidation, so each launch already gets the latest files — stale-cache bugs were a real problem before this. Don't add a reload on `controllerchange`: it makes the app flash and reload on every launch.
- Verify at phone width (375×812) in both dark and light themes and in both languages; English strings are longer and have overflowed compact controls before.
- When testing in the browser pane, seed data by writing `localStorage['bestbowling:v1']` and clear it afterwards. Do **not** clear storage on the live origin — it may hold the user's real records.
- The preview can serve stale CSS/JS after an edit: `fetch(url, {cache: 'reload'})` the changed files before reloading the page. Pane screenshots sometimes lag or crop; measure layout with `getBoundingClientRect()` in `javascript_tool` when in doubt.

## Architecture (js/app.js)

Single IIFE, ordered top to bottom: i18n → storage → UI state → icons → formatting → bowling scoring → sessions/stats helpers → per-tab render functions → keypad → image export → `actions` map → event wiring → boot.

- **Security**: all persisted/imported data passes through `normalize()` (`cleanSession`/`cleanCost`), which keeps only `ID_RE` ids, `DATE_RE` dates, clamped numbers and trimmed strings — extend it when adding stored fields. Every interpolated string in templates, including attribute values like `data-id`/`value`, goes through `esc()`. `index.html` and `privacy.html` carry a CSP meta tag (`script-src 'self'`, no inline scripts), so new scripts must be separate files and new external origins must be added to the CSP.
- **Rendering**: string templates; `render()` rebuilds `#view` (`innerHTML`) for the current tab plus the tab bar and frame keypad, also fills the top-bar date tile (`renderTopCal()`: desk-calendar tile + day arrows, record and settle tabs only; tapping it toggles the month calendar `calendarHTML()`, which renders nothing while closed), then runs post-render fixups (`keepGameTabInView`, `updateScrollBars` for the always-visible `.hbar` under wide `.tbl-wrap` tables, `applyLock`). Inputs that must keep focus while typing (scores, handicaps, fees) do **not** re-render; they update data and call `refreshRecordNumbers()` / `refreshCostNumbers()` to patch only the totals.
- **Events**: one delegated `click` listener dispatches `data-act="name"` to `actions[name](el)`; one `input` listener handles `data-inp` fields; `keydown` handles Enter in specific inputs. Add new interactions as `data-act` + an `actions` entry rather than per-element listeners.
- **Locked past records**: a saved session dated before today is read-only until the user taps 수정 (`ui.unlocked`). `isLocked(s)` drives it: the click handler refuses any action listed in `EDIT_ACTS`, the input handler ignores score/handicap edits, and `applyLock()` disables those controls after render. **A new action that changes a session must be added to `EDIT_ACTS`.**
- **State**: persisted `db` (`STORE_KEY = 'bestbowling:v1'`, shape normalized in `normalize()`: `members`, `sessions` keyed by `YYYY-MM-DD`, `costs` keyed by date, `settings` (`lang`, `theme`, optional `currency`), `feeDefaults`) vs. ephemeral `ui` (tab, selected date, open calendar/keypad, stats period/view, filters, edit modes). `sess()`/`costDoc()` return an unsaved draft for dates with no record; `commit(s)`/`commitCost(c)` persist (a session with zero players is deleted). Future dates can't be picked.
- **Session model**: `{ date, teamMode, teamCount, teamNames[], firstPractice, players: [{id, name, hdcp, team}], games: [{ mode: 'final'|'frame', entries: { [memberId]: { score, rolls[] } } }], active }`. Players snapshot `name`/`hdcp` so deleted members' history survives; `pname()` prefers the live member name. Mode is **per game** and both values are kept: `entryScore()` uses the game's current mode first and falls back to the other (`rollsScore`/`finalScore`), and switching a game to `final` copies frame totals into empty score boxes.
- **Scoring**: `rolls` is a flat pin-count array. `frameState()` (next ball / pins standing / done), `splitFrames()`, `cumScores()`, `frameMarks()` implement 10-pin rules incl. the 10th frame; the keypad enables only legal keys from `frameState().standing`.
- **Cross-cutting rules that every aggregate must respect**:
  - `usedGames(s)` trims empty trailing games (new sessions start with `DEFAULT_GAMES = 4`) — results, images and stats iterate over it, not `s.games`.
  - `isPractice(s, gi)` excludes game 1 from totals/averages/stats when `firstPractice` is on (but cost settlement still counts it).
  - `teamLabel(s, ti)` for team names (custom per-session name or "A팀"/"Team A"; `teamImgLabel` adds the letter in share images); `entryPlayers(s)` for the team filter on the entry screen; `costTeams(c)` groups a cost sheet by the session's teams for the per-team settle view.
  - Lists are shown in name order via `membersByName()` / `playersByName()` / `rowsByName()` (display only, stored order untouched); rankings and leaderboards stay sorted by score.
  - Cost sheets can carry `extras` (drinks, snacks…: `{label, amount, mode: 'split'|'one', who[]}`); `rowAmount()` = `baseAmount()` + `extraShare()`, where `splitShare()` divides in whole won/cents and gives the remainder to the first payers so shares sum exactly. Empty `who` in split mode means everyone included. Share images add a 기타 column to the team and per-person settle tables when any extra applies.
  - Game-order averages on the stats tab include practice games (`memberGames(id, true)`); every other stat excludes them.
  - Handicaps are 0–300 everywhere (`toHdcp`, `HDCP_MAX`, and `normalize()`).
  - Money: `currency()` is `db.settings.currency` (KRW/USD/EUR/JPY, picked on the settle tab) or, if unset, won in Korean / dollars in English. `fmtMoney()` and `moneyInput()` follow it; won and yen are whole numbers, USD/EUR allow cents. Fee inputs are text fields that keep 3-digit grouping while typing.
- **Stats tab**: `memberGames(id)` (filtered by `periodFrom()` for 전체/이번 달/3개월/올해, practice games excluded) feeds the hero card, `lineChart()` (game trend with average line), `barChart()` (per-date averages), the game-order bars and the leaderboard.
- **Share images** are drawn manually on `<canvas>` (`buildImage()` with `table`/`kv` blocks from `recordBlocks()` / `costBlocks()`; the winner's crown is drawn by `drawCrown()`), not screenshots; canvas width `W` grows with column count so scores never truncate. Export uses Web Share with files, falling back to download (iOS shows a long-press preview). Backups are saved as files only (sharing them was removed: KakaoTalk drops shared text files).
- **i18n**: `I18N.ko` / `I18N.en` dictionaries with `{0}` placeholders via `t(key, ...args)`; add every new key to both. Long-form documents (볼링 상식, user guide, privacy policy, terms, open-source notices) live in `js/docs.js` as `window.BB_DOCS[lang][key] = {title, html}` and are shared by the Settings document viewer (`showDoc`) and `privacy.html`. Keep the open-source list in sync if fonts/icons/libraries change (icons include Feather-derived paths, MIT).

## Launch

The launch screen is icon-only: the phone's own icon screen (manifest `background_color` `#1f3449` + icon; Android 12+ first shows the launcher icon cut to a circle; `icons/launch.svg` (from make-icons.mjs) is that circle, and `node tools/twa-splash.mjs <project>` puts it into the Android app's `splash.png` at 192dp plus a `#1F3449` system splash background, to rerun after make-twa.mjs) is continued by an inline `#launch` overlay in `index.html` with the same colour and `icons/launch.svg` inlined at 192px (an `<img>` loaded a frame late and blinked), held ~1s by boot code (tap to skip) so the icon doesn't vanish instantly. The user rejected the earlier lane-scene splash and any animation. `html` gets the theme `--bg` in style.css, so the first frame already matches the theme. Pull-to-refresh is turned off (`overscroll-behavior-y: none` on `html`/`body`) because it reloads the whole app. Status bar: installed Chrome apps paint the bar from the manifest `theme_color` but choose light/dark icons from the `theme-color` meta, so both are fixed to `#f5f2ec` in every theme.

## Styling (css/style.css)

Design tokens on `:root` with dark overrides duplicated under both `:root[data-theme="dark"]` and `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` — change both blocks together. Look: navy/black with gold accents (`--gold`, `--gold-grad`), Playfair Display for display text. Team colors are fixed by index (`.t0`–`.t3` badges, `.tc0`–`.tc3` sections, `.tl0`–`.tl3` letters). Newer feature styles are appended in commented blocks at the end of the file, so later rules often override earlier ones for the same selector — search the whole file before changing a component.

## Android app (Play Store, Trusted Web Activity)

- Package `io.github.sedapa2010k.bestbowling`, minSdk 24. `node tools/make-twa.mjs` regenerates the project into `android/` (git-ignored; also holds the upload key `bestbowling-upload.jks`, whose password only the user knows — never type or store it).
- Toolchain lives outside OneDrive in `C:\Users\leejj\bbtools` (JDK 17, Android SDK, Bubblewrap in `bw/`). Build there, not in the repo: `cmd`/`gradlew.bat` fail under the Korean `바탕 화면` path, so the project is copied to `C:\Users\leejj\bbtools\twa`, built with `./gradlew bundleRelease assembleRelease` from Bash, then the user runs `bbtools\twa\sign.ps1` in a terminal tab (zipalign + apksigner + jarsigner, prompts for the password) which copies `BestBowling-x.y.z.aab/.apk` to `android/out`. Bump `appVersionCode`/`appVersionName` for each upload (also in `bbtools	wappbuild.gradle`). Status and navigation bars are light `#f5f2ec` in both phone modes (user choice): a TWA fixes them at launch from the phone's dark mode and ignores the page and the in-app theme.
- Full-screen verification: `https://sedapa2010-k.github.io/.well-known/assetlinks.json`, served from the separate `sedapa2010-K/sedapa2010-K.github.io` repo (only a project-site path is available here). After the first Play upload, add the Play App Signing SHA-256 from Play Console to that file next to the upload key's.
