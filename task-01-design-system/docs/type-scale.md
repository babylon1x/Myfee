# Type Scale

MyFee's 15 text styles, as set in Figma.

## Fonts

| Roles | Font | Why |
|-|-|-|
| Display, Headline | Charis SIL | A serif for large text keeps MyFee distinct. Real ₦ glyph, even digits, and accents like "Ọlá Adébáyọ̀" display cleanly. |
| Title, Body, Label | Inter | Clear sans serif for fee names, amounts and buttons on small screens. Accents tested and display correctly. |

## Units

Size is in px. Line height and letter spacing are in %, so they scale with the font size.

## The 15 styles

| Style | Font | Weight | Size | Letter spacing | Line height |
|-|-|-|-|-|-|
| Display large | Charis SIL | 400 | 54px | −2% | 120% (64.8px) |
| Display medium | Charis SIL | 400 | 42px | −2% | 120% (50.4px) |
| Display small | Charis SIL | 400 | 36px | −2% | 120% (43.2px) |
| Headline large | Charis SIL | 400 | 32px | −2% | 120% (38.4px) |
| Headline medium | Charis SIL | 400 | 28px | −2% | 120% (33.6px) |
| Headline small | Charis SIL | 400 | 24px | −2% | 120% (28.8px) |
| Title large | Inter | 400 | 24px | −2% | 140% (33.6px) |
| Title medium | Inter | 400 | 18px | −2% | 140% (25.2px) |
| Title small | Inter | 400 | 16px | −2% | 140% (22.4px) |
| Body large | Inter | 400 | 16px | −2% | 140% (22.4px) |
| Body medium | Inter | 400 | 14px | 0% | 140% (19.6px) |
| Body small | Inter | 400 | 12px | 0% | 140% (16.8px) |
| Label large | Inter | 400 | 14px | 0% | 140% (19.6px) |
| Label medium | Inter | 400 | 12px | 0% | 140% (16.8px) |
| Label small | Inter | 400 | 10px | 0% | 140% (14px) |

## Line height by role

| Role | Multiplier | Why |
|-|-|-|
| Display, Headline | 1.2 | At 1.4, a wrapped Charis SIL heading looks like two separate blocks. Breaks the formula on purpose (see `divergences.md`). |
| Title, Body, Label | 1.4 | Follows the formula. The tightest allowed value keeps fee lists compact on small phones. |

## Letter spacing

Judged by eye at display large: `evidence/03-spacing-default.png` (Material, −0.25px) vs `evidence/04-spacing-chosen.png` (mine, −2%).

**What changed:** at −2% the text became more compact and easier to look at, with the letters closer but not touching. The default is also readable, so this is partly personal choice, but the tighter version stays usable for MyFee.
