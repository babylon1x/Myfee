# Divergences from the Material Defaults

Where MyFee's type scale differs from the Material 3 baseline (or the course's line-height formula), why, and when each choice would be wrong.

\---

## 1\. Font family

|||
|-|-|
|**Default**|Roboto for every style|
|**My choice**|Charis SIL for display and headline, Inter for title, body and label|
|**Why**|Serif fonts remind me of luxury and classic design. We're not chasing luxury here, but using a serif only for display and headline keeps MyFee distinct instead of generic. I also made sure Charis SIL has the ₦ glyph, so naira amounts show the real symbol instead of a placeholder.|
|**When it would be wrong**|If parents are on slow, expensive data. Two font files could cost more to load than Roboto, which Android already has.|

\---

## 2\. Letter spacing

|||
|-|-|
|**Default**|−0.25px on display large, 0px on other large styles|
|**My choice**|−2% on display, headline, title and body large. 0% on body medium, body small and labels.|
|**Why**|Judged by eye (`evidence/03` and `04`). Tighter spacing makes large text read as one shape. "₦978,876" stayed readable. % scales with size, and the smallest text stays at 0%.|
|**When it would be wrong**|On ₦ amounts at 16px on low-quality screens, where tight digits can blur and one misread digit is a real mistake.|

\---

## 3\. Line height for display and headline

|||
|-|-|
|**Default**|Course formula: size × 1.4, 1.5 or 1.6|
|**My choice**|120% on the serif (display, headline). Inter styles follow the formula at 140%.|
|**Why**|At 140%, a Charis SIL heading that wraps looks like two separate blocks. At 120% it reads as one phrase. Inter didn't have this problem. For evidence, See `evidence/line-height-120.png` and `evidence/line-height-140.png`.|
|**When it would be wrong**|I tested it with local names like "Ọlá Adébáyọ̀" on wrapped headings and the accents don't clash, so it holds up for MyFee's headings. It would be wrong for headings that run to three lines or more, where tight lines start to feel like a block.|

\---

## 4\. Font sizes

|Role|Material (L / M / S)|Mine (L / M / S)|
|-|-|-|
|Display|57 / 45 / 36px|54 / 42 / 36px|
|Title|22 / 16 / 14px|24 / 18 / 16px|
|Label|14 / 12 / 11px|14 / 12 / 10px|

Headline and body match Material.

|||
|-|-|
|**Why**|**Display:** most serif typefaces take up more space than a sans serif at the same size, so I brought the display sizes down a bit. **Title:** personal design choice. **Label small:** 11px is so close to 12px that I'd effectively have two 12px styles. 10px gives a real smaller size that can come in handy.|
|**When it would be wrong**|**Display:** on a landing page that needs impact. **Title:** long fee names wrap sooner on narrow screens. **Label small:** on very small devices, where users may not be able to read 10px text.|



