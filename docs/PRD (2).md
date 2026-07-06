# DevFC — Product Requirements Document

**Project:** DevFC (GitHub Ultimate Team)
**One-liner:** EA FC meets GitHub — every developer's public activity becomes a FIFA-style Ultimate Team card, revealed through a pack-opening moment.
**Status:** Prototype built (single-file HTML, client-side only)
**Owner:** Shashank

---

## 1. Problem & vision

Developer profiles (GitHub, LinkedIn, portfolio sites) are static and boring to browse. There's no fun, shareable, competitive artifact that turns a GitHub history into something people want to screenshot and post. FIFA/FUT solved this exact problem for football stats: turn a spreadsheet of numbers into an object people are emotionally invested in opening.

**Vision:** Type any GitHub username → rip open a pack → get a stat card with an OVR rating, position, and rarity tier, the same emotional beat as opening a FUT pack. Shareable via a direct URL.

## 2. Target users

- Developers who want a fun, shareable flex of their GitHub activity (primary).
- People scouting/comparing devs casually (recruiters, hackathon organizers, team leads) — secondary, not the initial focus.
- Communities that like leaderboard/collectible mechanics (Twitter/X dev community, Reddit r/programming, Dev.to).

## 3. Core value proposition

| Football card concept | DevFC equivalent |
|---|---|
| Club, position, nationality | Top language → inferred position; account creation year → "est." |
| Pace, Shooting, Passing, Dribbling, Defending, Physical | 6 stats derived from GitHub activity (see §5) |
| OVR rating | Weighted average of the 6 stats |
| Bronze / Silver / Gold / Icon rarity | Same tiering, thresholds on OVR |
| Pack opening ritual | Foil pack tear → flash → card flip-reveal → stat bars fill |
| Card trading / showing off | Shareable URL (`?u=username`) that reopens the exact same pull |

## 4. User flows

### 4.1 Manual pack open (primary flow)
1. User lands on the page, sees a sealed pack and a username input.
2. User types a GitHub username, clicks "Open pack."
3. Pack tears (animation), screen flashes, card flies in and flips face-up.
4. Stats reveal (numbers/bars animate in), rarity-tinted card background matches tier.
5. User can share the direct link or open another pack.

### 4.2 Direct link flow (secondary flow)
1. Someone opens `devfc.app/?u=torvalds`.
2. The pack-opening animation plays automatically on load (no manual click), then reveals the card.
3. This is the "share your pull" loop — critical for organic distribution.

### 4.3 Error flow
- Username doesn't exist → inline error, pack does not tear, user can retry.
- GitHub API rate-limited → inline error explaining to retry shortly, no partial/broken cards ever shown.

## 5. Stat mapping specification

All stats are 1–99, log-scaled so outliers (one viral repo) don't break the curve. Formula: `round(99 * ln(1+value) / ln(1+k))`, clamped 1–99, where `k` is a calibration constant per stat.

| Stat | Source data | Notes |
|---|---|---|
| PAC (Pace) | Recency of most recent push across owned repos | Decays from 99 (pushed today) down as days-since-push grows; not log-scaled |
| SHO (Shooting) | Total stars across owned repos | "Finishing power" — reward for building things people star |
| PAS (Passing) | Followers × 2 + following | Network / collaboration proxy |
| DRI (Dribbling) | Number of distinct languages used across repos | Versatility |
| DEF (Defending) | Total forks across owned repos | Community trust in the code |
| PHY (Physical) | Total public repo count | Raw output/workload |

**OVR** = round(mean of all 6 stats).

**Rarity tiers** (by OVR):
- Bronze: < 68
- Silver: 68–79
- Gold: 80–89
- Icon / Special: 90+ (crimson/black chrome treatment — visually the "you pulled something rare" moment)

**Position inference:** from the single most-frequent language across a user's repos, mapped to a football position (e.g. Python → CDM, Go/Rust/C/C++ → CB, JS/TS → CAM, Java/Kotlin/C# → CM, Ruby/PHP/Swift/Dart → ST, HTML/CSS → RW). Falls back to ST if no repos/languages found.

**Known calibration gap:** the `k` constants (3000 stars, 1200 followers-equivalent, 120 repos, etc.) are rough first guesses. Before shipping, pull 15–20 real profiles spanning junior to well-known OSS maintainers and tune constants so an average active dev lands ~65–75 OVR, and only genuinely exceptional profiles (thousands of stars, huge followings) cross into Gold/Icon. This is the single highest-leverage task before launch — a miscalibrated curve makes every card feel the same.

## 6. Data sources & constraints

- **Source:** GitHub REST API, unauthenticated, client-side (`/users/{username}`, `/users/{username}/repos`).
- **Rate limit:** 60 requests/hour per IP unauthenticated. Fine for a demo; **not fine for real traffic.**
- **Known gap:** only counts *owned* repos. Contributions to other people's repos (very relevant for backend/infra devs who contribute upstream rather than own flashy repos) are invisible with this data source. Fixing this requires GitHub's GraphQL API with an auth token (contributionsCollection), which needs a backend proxy — can't be done safely client-side since it requires a token.
- **Pagination gap:** repos fetch is capped at 100; users with 100+ public repos will have their stats computed from an incomplete (though most-recently-pushed) set.

## 7. Technical architecture (current prototype)

- Single static HTML file, inline CSS + vanilla JS, no build step, no backend.
- All GitHub calls are direct browser `fetch()` calls (GitHub's API sends CORS headers, so this works with zero backend).
- State handled via two screens (`#pack-screen`, `#card-screen`) toggled by JS, no framework/router.
- Shareable state lives entirely in the URL query string (`?u=username`) — no database needed for the MVP.

### Phase 2 architecture needs (once this leaves prototype stage)
- Thin backend proxy (Node/Cloudflare Worker) to hold a GitHub token server-side, enabling: higher rate limits, GraphQL contribution data, response caching (avoid re-hitting GitHub for the same username repeatedly).
- Optional: persist pulled cards (username → computed stats + timestamp) so a card doesn't recompute (and doesn't drift) every time it's shared, and so a "recently opened" or leaderboard feed becomes possible.
- Optional: OG image generation (server-rendered card screenshot) so shared links unfurl as an image preview on Twitter/X/Discord — currently a plain link with no preview, which will hurt sharing virality significantly.

## 8. Success metrics (once live)

- Packs opened (primary activation metric).
- % of pack-opens that come from a shared `?u=` link vs. manual entry (measures viral loop health).
- Return rate: same visitor opening a second, different username.
- Social shares / mentions (Twitter, Reddit, Dev.to) — this was the original distribution channel discussed for `git-heat` and applies here too.

## 9. Out of scope for v1

- User accounts / login.
- Card trading, comparing two cards side by side, leaderboards.
- Non-GitHub data sources (LinkedIn, Stack Overflow, etc.).
- Mobile native app — web-only, responsive.

## 10. Do's and don'ts

**Do**
- Keep the pack-opening moment fast (< 2s from click to reveal) — this is the entire hook, don't let a slow API call kill momentum.
- Make failure states calm and clear (bad username, rate limit) — never show a half-broken card.
- Keep the URL-sharing flow frictionless; it's the only distribution mechanism this product has.
- Calibrate stat constants against real profiles before showing this to anyone outside close friends.
- Cache/throttle repeated lookups of the same username to protect the shared rate limit budget.

**Don't**
- Don't add login/accounts before there's evidence people want to save cards — adds friction to the one flow that matters.
- Don't let stat inflation creep in over time (e.g. "everyone's a Gold") — protect the scarcity of Icon tier, it's what makes a pull feel special.
- Don't silently fall back to fake/placeholder stats when GitHub data is incomplete — better to show fewer stats correctly than invented numbers.
- Don't block the core flow behind a backend before it's needed — the client-only approach is a feature (zero infra cost) until scale genuinely requires a proxy.
- Don't over-fetch — a single lookup should never trigger more than the 2 calls it needs (`/users/{u}` and `/users/{u}/repos`).
