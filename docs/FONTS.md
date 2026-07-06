# DevFC — Typography & Font Specification

**Scope:** every typeface, weight, size, and usage rule for the DevFC card generator. Mirrors what's already implemented in the prototype, with rationale and a few upgrade options.

---

## 1. Typeface pairing

| Role | Typeface | Why |
|---|---|---|
| Display / stats / numbers | **Oswald** (weights 500, 600, 700) | Condensed, bold, all-caps friendly — the closest free equivalent to the tight condensed sans FIFA/FUT actually uses for OVR numbers and stat labels. Condensed width lets big numbers sit tight against labels without wrapping on a 300px card. |
| Body / UI copy | **Inter** (weights 400, 500, 600, 700) | Neutral, highly legible at small sizes (form inputs, hints, error text), huge language/character coverage, free and self-hostable. |

Both load from Google Fonts in the prototype:
```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Upgrade path (optional, no license concerns, closer to real FUT typography):**
- Swap Oswald for **Bebas Neue** for the OVR number specifically if you want something even more condensed/poster-like — but test legibility at 44px first; Bebas has almost no counter space and can feel thin at card scale.
- Swap Inter for **Manrope** or keep Inter — both are safe, no strong reason to change unless you want slightly more geometric roundness.

Don't reach for a licensed/paid football-simulation font (EA's actual UI fonts are proprietary) — Oswald + Inter gets 90% of the visual signal with zero licensing risk.

## 2. Type scale

| Token | Size | Weight | Font | Used for |
|---|---|---|---|---|
| `ovr` | 44px | 700 | Oswald | The big OVR number, top-left of card |
| `h1` | 32px | 600 | Oswald | Page headline ("Open your GitHub pack") |
| `display-name` | 19px | 600 | Oswald | Card holder's display name |
| `pos` | 15px | 600 | Oswald | Position acronym (CAM, CDM, etc.) |
| `stat-num` | 19px | 700 | Oswald | Individual stat numbers (PAC, SHO, etc.) |
| `stat-label` | 12px | 500 | Oswald | PAC / SHO / PAS / DRI / DEF / PHY labels — letter-spacing 1px |
| `tier-tag` | 10px | 600 | Oswald | Bronze/Silver/Gold/Special tag — letter-spacing 2px, uppercase |
| `body` | 14px | 400 | Inter | Subheading copy, form hints |
| `handle` | 12px | 400 | Inter | @username under display name |
| `button` | 13px | 600 | Oswald | Button labels — letter-spacing 1px, uppercase |
| `error/hint` | 12–13px | 400 | Inter | Error messages, footer hint text |
| `lang-chip` | 10px | 600 | Inter | Language badge pills on card footer |

## 3. Rules for using Oswald vs. Inter

- **Oswald is reserved for anything that reads as a "stat" or "identity marker"**: numbers, labels tied to numbers, position, tier, page headline, buttons. It carries the FIFA-card personality — use it sparingly and only where that personality should show.
- **Inter is everything else**: form inputs, body copy, hints, errors, usernames-as-text. If Oswald appears in a paragraph of explanatory prose, that's a sign it's being overused — pull it back to Inter.
- Never mix the two within a single text node (e.g. don't set "@" in Inter and the handle in Oswald) — a UI element is one font, one weight.

## 4. Weight usage

- Oswald 500: reserved for slightly lighter contexts (not currently used in the shipped prototype — available for a future "secondary stat" tier if new attributes are added).
- Oswald 600: default weight for labels, headline, position, buttons.
- Oswald 700: reserved exclusively for the two loudest numbers on the card — OVR and the six individual stat numbers. Don't use 700 anywhere else, or it stops signaling "this is the important number."
- Inter 400: default body/paragraph weight.
- Inter 500–600: form labels, chip text, anything needing slight emphasis without shouting.

## 5. Letter-spacing & case

- All-caps text (labels, tags, buttons) always pairs with positive letter-spacing (1–3px) — condensed capitals set tight read as cramped without it.
- Never set body paragraphs (Inter, sentence case) in all-caps or with added letter-spacing — reserve that treatment for the Oswald "stat identity" layer described in §3.
- Sentence case for all conversational copy (hints, errors, placeholders); title case is never used; all-caps only for the specific label set above.

## 6. Color-on-type rules

- White/off-white (`#fff` / `#f2f0ea`) for all text sitting directly on a card's colored gradient (bronze/silver/gold/icon) — the gradients are all dark-to-mid saturation, so darker text will fail contrast.
- `var(--text-lo)` (`#9a99a6`) for secondary/muted copy on the dark page background — never pure gray on gray; test at both the page background and panel background swatches before shipping a new muted color.
- Never place Oswald 700 stat numbers directly on a light card tier (silver/gold) without a subtle shadow or sufficiently dark gradient stop behind them — check contrast at the lightest point of each card gradient, not just the average.

## 7. Do's and don'ts

**Do**
- Keep the two-typeface system closed — resist adding a third display face for "just this one badge." Consistency is what makes the card read as a system, not a one-off graphic.
- Test the OVR number at 44px on both a Bronze and an Icon-tier gradient before calling typography done — the darkest and lightest card backgrounds are the real contrast tests.
- Keep letter-spacing on labels consistent (1px for stat labels, 2px for tier tags, 3px for the biggest headline-style labels) — don't eyeball a new value per component.

**Don't**
- Don't use Oswald for long-form text (subheads, hints, error copy) — it was chosen for short punchy labels and gets fatiguing to read in sentences.
- Don't drop below 11px anywhere, even for the smallest chip text — the card already asks a lot of the eye at small sizes on mobile.
- Don't introduce a monospace font for stats "to look more technical" — Oswald condensed already carries the sports-card identity; monospace would fight it and read as a spreadsheet, not a card.
- Don't let Google Fonts block first paint — `display=swap` is already set in the prototype; keep it if you self-host later too.
