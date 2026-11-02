# Prompts

Every prompt I gave the agent for Task 1, word for word, including the parts that didn't work and what I changed.

---

## Step 6: Converting the JSON tokens to CSS variables

### Attempt 1

**Prompt (verbatim):**

```
Write a javascript script that you will used to convert the design system in [tokens-complete.json](file;file:///c%3A/Users/emman/OneDrive/Desktop/Myfee/task-01-design-system/evidence/tokens-complete.json) into CSS variables.

Pay attention to the primitive colors and the color roles, use standard color system practice and remeber that the primitive colors will not be used directly on the UI, only the color roles will be used directly on the UI.

Use CSS variables and ensure that this design system remains the only source of truth for UI implementation.

To be sure, present all what you can read or see on [tokens-complete.json](file;file:///c%3A/Users/emman/OneDrive/Desktop/Myfee/task-01-design-system/evidence/tokens-complete.json)  as preamble so i'm sure that the tokens are complete and you can see the tokens and styles.
```

**What worked:**
- The preamble matched my file: 110 primitive colours, 39 colour roles with light and dark values, 15 text styles and 3 shadows.
- Colour roles reference primitives with `var()` instead of copying hex values, e.g. `--color-primary: var(--primitive-primary-40)`.
- Light mode is the default, with dark mode under `[data-theme="dark"]`.
- Shadows reference the shadow colour roles, not hex values.

**What didn't work:**
1. Letter spacing was output as `-2%`, which isn't reliably supported for letter spacing in browsers, so my −2% could silently disappear.
2. When a token reference couldn't be found, the script guessed a variable name instead of stopping. A renamed token would break the CSS with no warning.
3. The CSS was saved in the `evidence/` folder, but it's app code, not evidence.
4. Line height was output as `120%` instead of a unitless `1.2`. A % line height is inherited as a fixed pixel value by child elements.

### Attempt 2

**Prompt (verbatim):**

```
Fix these in convert-tokens.js and regenerate the CSS:
1. Convert letter spacing from % to em (-2% = -0.02em, 0% = 0).
2. Output line height as a unitless number (120% = 1.2, 140% = 1.4).
3. If a token reference can't be found, throw an error that names the missing reference. Never guess a variable name.
4. Save the output to task-01-design-system/styles/tokens.css, not the evidence folder.
5. Read the input from evidence/06-tokens-complete.json.
Show me the display large and body medium typography variables after the change.
```

**Result:**
- Letter spacing is now `-0.02em` and `0`.
- Line height is now `1.2` and `1.4`.
- A missing reference now throws an error naming it.
- Output is at `styles/tokens.css`, and the old file in `evidence/` was deleted.
- Display large: 54px, line height 1.2, letter spacing −0.02em. Body medium: 14px, line height 1.4, letter spacing 0. Both match `type-scale.md`.

**Still to note:** the agent kept the input as `evidence/tokens-complete.json`, not `06-tokens-complete.json` as I asked. [Rename the file or fix the script so they match.]
