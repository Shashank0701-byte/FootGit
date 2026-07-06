# DevFC — Animation Specification

**Scope:** every animated moment in the pack-opening flow — what plays, in what order, for how long, and why. The pack-opening sequence is the product's single signature moment; everything here should serve that one beat rather than compete with it.

---

## 1. The full sequence (timeline)

| Time (ms from click) | Event | Duration |
|---|---|---|
| 0 | User clicks "Open pack" / submits username | — |
| 0 | Pack starts "tearing" animation | 550ms |
| 0–~480 | GitHub API calls happen in parallel, hidden behind the tear | (network-dependent) |
| ~480 | Full-screen flash fires | 500ms |
| ~600 | Pack screen hidden, card screen shown | instant swap |
| ~720 | Card flies in + flips into place | 700ms |
| ~1220 | Holographic sheen sweeps across the revealed card | 1.1s, starts 500ms after `.shine` is added |

Total perceived time from click to fully-revealed card: **roughly 1.2–1.5 seconds** if the API responds quickly. This is the target ceiling — see §5 on handling slow responses.

## 2. Pack tear (`@keyframes tear`)

- **What:** the pack scales up (1 → 1.35), rotates slightly (0° → −4°), and fades to opacity 0.
- **Timing:** 550ms, ease.
- **Intent:** reads as the pack physically bursting apart/being torn open, not just "shrinking away." The slight rotation is what sells "torn" rather than "deleted."
- **Trigger:** `.pack.tearing` class added on submit.

## 3. Flash (`@keyframes flashpop`)

- **What:** a fixed full-viewport white overlay, opacity 0 → 1 (by 15% of duration) → back to 0.
- **Timing:** 500ms, ease, fires slightly after the tear starts (~480ms in).
- **Intent:** this is the "pack rarity light burst" moment from real FUT pack openings — a beat of pure white that resets visual attention right before the card itself appears, so the reveal reads as a distinct new moment rather than a continuation of the tear.
- **Note:** this is the single most intense visual moment in the whole flow — keep it to one flash, never repeat it, never make it colored (colored flashes read as an error/warning state, not a reward state).

## 4. Card reveal (flip + rise)

- **What:** the card starts `translateY(40px) rotateX(35deg) scale(0.9)` at `opacity: 0`, and transitions to `translateY(0) rotateX(0) scale(1)` at `opacity: 1`.
- **Timing:** 700ms, `cubic-bezier(.2,.8,.2,1)` — a curve with a fast start and a gentle, slightly overshooting settle, which reads as physical/weighted rather than robotic linear motion.
- **Trigger:** `.card.revealed` class, added ~120ms after the screen swap so the flash has visually cleared first.
- **Intent:** the rotateX starting at 35° simulates the card tipping up from lying flat (like a physical card being lifted toward the viewer) rather than just fading/sliding in.

## 5. Sheen sweep (`@keyframes sheen`)

- **What:** a diagonal light-gradient band sweeps across the card once, from bottom-right to top-left (`background-position: 120% 0` → `-20% 100%`).
- **Timing:** 1.1s ease, starts 500ms after `.shine` is added (so it plays *after* the card has finished settling, not during the flip).
- **Intent:** this is the "foil card catching the light" cue that separates a rare pull from an ordinary one visually — even though currently every tier gets the sheen, higher tiers are natural candidates for a more pronounced or repeating version (see §7 future ideas).

## 6. Stat reveal (currently instant — flagged for upgrade)

The prototype currently renders all six stat numbers at once when the card data populates, with no individual stagger. This is a known simplification.

**Recommended upgrade (not yet built):** stagger each `.stat-row` in with a 60–80ms delay between rows, each row fading/sliding up individually (`opacity 0 → 1`, `translateY(8px) → 0`, ~250ms per row), starting right after the card flip settles (~720ms) and finishing before the sheen sweep starts. This gives the reveal a "counting up" feel similar to FUT's stat-by-stat build rather than dumping all six numbers on screen simultaneously.

## 7. States that should NOT animate (or animate minimally)

- **Error states** (bad username, rate limit): text appears immediately, no shake/attention-seeking animation. An error is not a moment to add delight — get out of the user's way fast so they can retry.
- **"Open another pack" reset**: classes (`revealed`, `shine`, `tearing`) are stripped instantly with no reverse-animation — don't play the reveal animation backwards, it reads as glitchy rather than intentional. A hard cut back to the pack screen is correct here.
- **Hover states on the sealed pack** (`transform: translateY(-4px) rotate(-1deg)`): kept fast (250ms) and subtle — this is an idle-state affordance, not a moment, so it shouldn't compete with the reveal sequence in scale or duration.

## 8. Reduced motion

Not yet implemented in the prototype — flagged as a gap. Before shipping publicly, wrap the tear/flash/flip/sheen sequence in a `prefers-reduced-motion` check:

```css
@media (prefers-reduced-motion: reduce) {
  .pack.tearing, .flash.go, .card, .card.shine::before {
    animation: none !important;
    transition: opacity .2s linear !important;
  }
}
```
With reduced motion on, the pack should simply fade out and the card should simply fade in — same information, no motion.

## 9. Timing reference table

| Animation | Duration | Easing |
|---|---|---|
| Pack tear | 550ms | ease |
| Flash | 500ms | ease |
| Card flip/rise | 700ms | cubic-bezier(.2, .8, .2, 1) |
| Sheen sweep | 1.1s | ease |
| Pack hover | 250ms | ease |
| Stat row stagger (recommended, not yet built) | 250ms per row, 60–80ms offset | ease-out |

## 10. Do's and don'ts

**Do**
- Keep the tear → flash → flip sequence exactly one path with no branches — every pull, regardless of rarity, goes through the same choreography. Variance should live in *what* the card looks like (tier gradient, sheen intensity), not in *how long* the user waits.
- Keep total time-to-reveal under ~1.5s of animation time. The API call should be masked by the tear animation, not added on top of it — if a fetch is slow, the tear should still finish on schedule and the card should wait invisibly, not stutter.
- Use one cubic-bezier easing (`.2, .8, .2, 1`) as the "physical" signature curve across major card motions, so all the big moments feel like they belong to the same object.
- Respect `prefers-reduced-motion` before public launch — this is a real accessibility requirement, not a nice-to-have.

**Don't**
- Don't add animation to error or reset states "for consistency" — motion should mark reward moments specifically; overusing it dilutes the one sequence that's supposed to feel special.
- Don't make higher-rarity tiers noticeably slower to reveal (e.g. "Icon cards take longer to open") — that reads as artificial padding, not excitement, and trains impatient users to dread good pulls.
- Don't stack multiple simultaneous full-screen effects (e.g. flash + confetti + shake at once) — the flash already owns that beat; anything layered on top competes with it and reads as noisy rather than premium.
- Don't use spring/bounce easing with overshoot on the OVR number or stat digits specifically — a bouncing number reads as a bug, not a stat count-up. Reserve spring-like motion for the card object itself, not for numeric text.
