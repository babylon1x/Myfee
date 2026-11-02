# Shadows

Three shadows, saved in Figma as the effect styles **Shadow soft**, **Shadow medium** and **Shadow hard**. Each one's colour comes from its own colour role, so the shadows change with light and dark mode and follow the palette. Values match `evidence/06-tokens-complete.json`.

| Shadow | Colour role | Light | Dark | X | Y | Blur | Spread |
|-|-|-|-|-|-|-|-|
| Soft | Shadow soft | P98 (`#FBF6FF`) | NV6 | 0 | 4 | 24.3 | 0 |
| Medium | Shadow medium | P95 (`#F1EAFF`) | NV4 | 0 | 4 | 42.4 | 0 |
| Hard | Shadow hard | P90 (`#DFD7FF`) | NV0 | 0 | 4 | 41.9 | 0 |

**Dark mode:** the dark shadows use neutral variant instead of primary. A primary-tinted shadow would conflict with the primary roles on dark surfaces, and each shadow has its own token, so dark mode can point at different tones without affecting light mode.

**Why the brand colour, not black:**

Normal black shadows only show depth and separation from a surface. Shadows in the brand colour make the interface more cohesive, connecting each element to the rest of the interface and to the brand.
