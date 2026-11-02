# Defects

Real defects found in my own Task 1 work, where each one lives, and what it would cost in production.

---

## D1: Colour roles pointed at the unpinned primary palette

| | |
|-|-|
| **Found** | 25/10/2026 |
| **Status** | Fixed, 25/10/2026. Primary primitives replaced with the after-pinning values. White on primary is now 10.61 (was 6.4), primary on surface is now 10.36 (was 6.3). |
| **Severity** | High: it affects every primary-coloured element in the product |
| **Where** | Figma file "Myfee", **Primitive colors** collection, `Palette/Primary/primary0` to `primary100`. These held the **before pinning** values. All the roles in the **Color roles** collection point at these primitives, so every role that uses a primary tone was wrong. |
| **Where it shows in the docs** | `docs/colour-roles.md`, line 146 (on primary on primary: 6.4) and line 150 (primary on surface: 6.3). Both ratios were measured against the wrong colour. |

### What was wrong

My brand colour `#3D00C2` is pinned at primary 40. But when I built the primitives in Figma, I used the palette from **before** pinning. So the Primary role (P40) was `#5E3EE1`, the lighter violet the generator made on its own, not my brand colour. The rest of the primary scale (P10 to P90) was also the unpinned version.

The colour roles themselves were set up correctly. They pointed at the right tone numbers. The tone numbers just held the wrong colours.

### How I found it

While filling in the Pass column in `docs/colour-roles.md`, the ratio for white text on primary was **6.4**. White on `#3D00C2` should be about **10.6** [confirm in WebAIM]. 6.4 is almost exactly white on `#5E3EE1`, the unpinned tone 40. Primary on surface had the same problem (6.3).

Both pairs still passed 4.5, so a pass/fail check alone would not have caught this. I only caught it because the number itself didn't match the colour I thought I was testing.

### What it would cost in production

- **The brand gets diluted.** Every Pay button, active child tab and link would ship in a colour the school never chose. This is the Daniel scenario from the task: the brand colour is there in name, but the product shows a different one.
- **My documentation would be false.** `colour-roles.md` says primary is `#3D00C2` and shows the pinning step. The product would contradict it.
- **Wrong contrast evidence.** Every ratio that uses a primary tone was measured against the wrong colour, in both light and dark mode.
- **It spreads.** Exported tokens, the CSS variables and every screen the agent builds would all carry the wrong violet. Finding it after launch means re-exporting and re-checking everything.

### The fix

1. Replace every tone in `Palette/Primary` (0 to 100) with the after-pinning values.
2. Check whether the Neutral and Neutral variant palettes also changed after pinning. If so, update those primitives too.
3. Confirm in Figma that the Primary role now shows `#3D00C2`. The roles don't need changing, because they reference the primitives.
4. Re-check contrast in WebAIM for every pair that uses a primary tone, in light and dark mode, and update `docs/colour-roles.md`.
5. If the tokens were already exported, export again.

### How I'll prove it's fixed

- Screenshot of the Primary role showing `#3D00C2` after the fix.
- New ratio for white on primary close to 10.6, recorded in `docs/colour-roles.md`.
- A commit on the day of the fix that names this defect (D1).

### What I learned

A passing contrast check doesn't prove the right colour is being tested. I should check the hex behind a role, not just whether its ratio passes.

---

## D2: Token export only included dark mode

| | |
|-|-|
| **Found** | 26/10/2026 |
| **Status** | Fixed, 26/10/2026. Re-exported with TokensBrücke, which exports both modes. |
| **Severity** | High: the code would have shipped without light mode, MyFee's main mode |
| **Where** | The first complete export (Design Tokens plugin by Lukas Oppermann), kept as `evidence/DEFECT-D2-tokens-dark-only`. Every colour role pointed at its dark tone only. |

**What was wrong:** the plugin exported one mode per collection. My Color roles collection has Light Mode and Dark Mode, but only the dark values came out. Primary pointed at `primary70` instead of `primary40`, and surface at `neutral6` instead of `neutral99`.

**How I found it:** I read the exported JSON and saw primary pointing at P70. My brand colour `#3D00C2` is P40, so it wasn't in the colour roles at all.

**What it would cost in production:** the agent converts this JSON to CSS in Step 6. MyFee would have been dark mode only, and the Pay button would never have been the school's brand colour. That's the same brand dilution as D1, caused by a different step.

**The fix:** switched to TokensBrücke, which exports every mode with references kept. Checked that light primary points at `primary40`, dark at `primary70`, and that all 39 roles, 15 text styles and 3 shadows are in `evidence/06-tokens-complete.json`.

**What I learned:** an export that looks complete can still be missing something. I check the values inside the file, not just that the colours are there.
