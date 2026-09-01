---
name: extract design system from a website
description: "Use when reverse-engineering a design system doc from an already-built, live website (grid, typography, color roles, components), as opposed to designing one from scratch. Covers what to extract from the live site vs. what belongs in brand strategy docs, and the output doc format."
---

Use this process when asked to reverse-engineer a design system from a website that has already been built and shipped (as opposed to designing one from scratch).

## Core rule: only claim what the site proves

Source materials for a real estate / brand project usually include a brief, a brand concept, a naming rationale, and an official brand guideline PDF, in addition to the live website. Do **not** merge all of these into one document. A design-system audit is a **summary of what the built site actually does**, not a summary of the brand strategy documents.

- Include a fact only if you can point to it in the rendered site: an actual color used in a UI role, a real breakpoint, a real spacing value, a real component variant.
- Exclude anything that is only aspirational or narrative: target audience, positioning statement, brand personality words ("да/нет" tone tables), naming rationale, campaign copy. That content belongs to brand strategy documents, not the design system.
- When the guideline PDF and the live site disagree (e.g. guideline specifies a font variant the site doesn't actually load, or the guideline says "no color hierarchy" but the site clearly promotes one color as the UI accent), record the **site's actual behavior** and note the discrepancy in one line. The site is the source of truth for a design-system doc.
- If a brand guideline PDF exists, split responsibility: the guideline owns brand-fixed facts (logo, brand color palette with hex values, primary typeface name, photo-style treatment). The design-system doc owns everything web-specific that the guideline doesn't cover (grid, breakpoints, fluid scaling, spacing scale, component states, color *roles* in the interface). Cross-reference the guideline file instead of repeating its values.

## What to extract from the live site

Inspect the rendered site (DOM, computed CSS, responsive behavior across at least mobile/tablet/desktop) and pull out:

1. **Site structure** — nav sections, homepage block order. One paragraph, not a full sitemap.
2. **Color — application, not palette.** Which brand color(s) actually got promoted to an interactive UI accent (buttons, links, hover/active states) versus which ones only appear in decorative gradients/backgrounds. Note default/hover/active state pairs. Note if colors are used as raw values or as semantic roles (text/bg/button/link, each with states) — the latter is a reusable pattern worth calling out explicitly.
3. **Typography — web reality.** Actual font name as loaded (compare to the brand guideline's specified name/weight — note any mismatch, e.g. missing a Cyrillic-specific cut). Whether sizing is fixed per breakpoint or fluid (`clamp()`/viewport-relative). Build a heading/body scale table with desktop → mobile approximate sizes. Note letter-spacing/line-height patterns for large headings if distinctive. Flag any legacy/orphaned style that coexists with the current scale — it's a real observation, not a bug in your audit.
4. **Grid and responsiveness.** Real breakpoint list (px values, from computed CSS or resize testing, not guessed round numbers). Column count per breakpoint tier. Whether the grid is fluid/interpolated or snaps at breakpoints. Section spacing pattern (e.g. asymmetric top/bottom padding) and whether it scales in discrete steps or continuously.
5. **Components.** For buttons specifically: text casing rule (and whether it derives from a brand-guideline typography rule applied to UI), size range (smallest to largest instance found), and every color/style variant with its states. Border-radius: is there one system value or a scattered range — report what's actually observed. Shadows: describe the visual character (soft/hard, opacity, blur) rather than inventing exact px/blur values you can't confirm.
6. **Reuse conclusions.** End with a short numbered list of patterns worth carrying to a sibling project (same company, same design language, different site) — e.g. "single accent color promoted from an equal-status palette," "semantic color roles for easy section re-theming," "named gradient library tied to content meaning." This is the highest-value section: it's the payoff of doing the audit at all.
7. **Gaps.** List what you could not determine from the live site alone (icon system, form component details, motion timings, Figma source) so a future pass knows what still needs manual collection.

## Output document format

Write one Markdown file per audited site, colocated with the other brand documents for that project (brief, brand concept, guideline). Use this frontmatter and structure:

```markdown
---
дата сбора: <ISO date>
источник: <site URL — company/project name>
---

# Дизайн-система <site> (веб-реализация)

<one paragraph: scope note — this covers only what the guideline doesn't, cross-reference sibling docs>

## 1. Структура сайта
## 2. Цвет — применение в вебе
## 3. Типографика — веб-реализация
## 4. Сетка и адаптивность
## 5. Компоненты
## 6. Выводы для переиспользования на других сайтах <company>
## 7. Не покрыто в этом слепке (нужен доп. сбор при необходимости)
```

Match the language of the surrounding project documents (Russian for Russian-market brand projects, etc.) — only this skill file itself is in English.

See `/Users/m8ig/Knowledge/7. tekta (2026)/➜ Twelve/Дизайн/Дизайн-система.md` as a worked example of this exact format applied to twelve.ru.
