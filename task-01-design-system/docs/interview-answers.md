# Interview Answers

Twelve questions, 200 words maximum each.

---

## 1. How would you structure design tokens?

Design tokens include colours, typography, spacing, layout, shadows etc. This means that there's no single way to structure design tokens. However, there are common practices that ensure design tokens are properly organised, and if I were to structure one, I'll start by defining the raw values of my tokens. For colours it'll be the key colours, for typography it'll be the raw text styles, and the same goes for spacing, shadows etc.

After defining the raw values, I'll create a range of variants, so that I have a wide range of options to choose from when designing the interface. For colours it'll be the tonal palette, for typography it'll be the variation in size.

After the variants have been generated, my next goal is to assign roles to each variant. The raw variants are primitives, and primitives are not to be used directly on the interface according to UI design standards, hence why semantic roles are required.

Finally, the role assignment stage is where I determine where and how each primitive will be used on the interface. I assign the roles and ensure the roles point to the primitive variables instead of a hard-coded hex value.

---

## 2. When is a token change breaking?

A token change could break a few things and result in certain defects, which include: defined colour contrasts being out of line, spacing being out of place, or even a build error message.

---

## 3. How would you support multiple brands and themes?

Supporting multiple brands and themes refers to accommodating different themes, colour schemes and brand visual identities in one token structure. To achieve that, I would make use of modes. A mode is part of a design system, and it is the core mechanic behind light and dark themes on most interfaces. With modes, I would assign each value to its own brand or its own theme, providing the ability to switch or toggle between brands or themes seamlessly.

---

## 4. Can tokens guarantee accessible contrast?

No. The contrast between elements is intentionally structured and designed by the design system's builder. Therefore, the accessibility of contrast between elements in a design token system depends on the person who builds the tokens.

---

## 5. How do you ensure that colour contrast guidelines are met within a website or application's design?

To ensure that colour contrast guidelines are met, I would make use of WCAG by measuring every colour pair with a contrast checker, for example WebAIM, when structuring my semantic colour roles.

---

## 6. Can you discuss the differences between WCAG levels A, AA and AAA?

- **A** is the foundational baseline of the Web Content Accessibility Guidelines. It addresses the core barriers that exclude most people with disabilities from using a product.
- **AA** is the gold standard of WCAG. It builds on A and addresses more accessibility requirements, for example minimum colour contrast ratios.
- **AAA** is the most stringent tier of WCAG. It addresses more accessibility issues and includes a wider range of people with disabilities. Although it is impractical to implement on a full website, it could be used to improve certain critical areas of an interface.

---

## 7. Discuss the importance of semantic HTML in the context of accessibility.

Semantic HTML tags are really beneficial in an interface for screen readers. As opposed to plain `<div>` tags, semantic HTML tags act like a map of the interface, letting screen readers identify areas in an interface and jump from section to section without having to read through all the content when it's not necessary.

---

## 8. How do you handle design handoff to developers using Figma?

For designs and interfaces, I would organise the screens in sections and groups, annotate interactions, and write short notes and docs for areas where extra information or tips are required.

To hand off the design tokens in the design system, I would export the tokens to JSON (JavaScript Object Notation), which is the format systems use to speak to each other. From there, either I or the developer would write and run a script to convert those JSON tokens into CSS variables, which can be used in code.

---

## 9. Why do AI-generated interfaces tend to look generic, and what specifically do you hand an agent to stop it?

AI interfaces look generic due to a lack of a proper design system. Without a design system, agents tend to assume, or in some cases search the web to fill gaps, resulting in generic-looking interfaces. To stop this, I must first stop the agent from assuming by providing it with a proper design system and instructing it to use it as its only source of truth.

---

## 10. Your line height for display large is a specific number. Why that number and not one step either side of it? What would you lose with each?

My line height for display large is 120% (1.2), and I settled on it after a few tests. I tried 100% (1.0), but it looked too clustered. I tried 140% (1.4), and it looked too far apart. 1.2 gave my text a more organised feel.

---

## 11. Point at one place in your own token structure that you would build differently if you started again. Say what you would do instead and what it would cost.

That would be my shadow system. To stay within the design system, I was forced to use an undesirable colour from my colour system for my shadow colour fill, instead of adjusting opacity as I had initially intended. The decision came after I realised that adding opacity required additional values and styles, so I dropped it.

Working on it now would require an extra chunk of time defining colour tokens with opacity included, which isn't a priority for me right now.

---

## 12. Wrong-answer analysis

*A candidate says: "I set up design tokens by exporting the hex values from Figma into a CSS file, so every colour in the codebase comes from one place. That makes it a single source of truth." This sounds correct and is not. Say precisely what is missing and what will go wrong in month four.*

The issue with this workflow is the use of hard-coded hex values for design tokens. If they actually go through with this, it would cause problems if a major change in brand direction is introduced.

The CSS only has hex values, which means there are no design tokens to begin with: no primitives for the tokens to point to. The candidate has just exported the key hex values.

Exporting raw hex values means the code will most likely use one hex value for multiple different jobs. Without primitive and semantic colours to structure the tokens, a change in colour or the introduction of a new theme would require the developer or engineer to manually find and change each hex value wherever it was applied.
