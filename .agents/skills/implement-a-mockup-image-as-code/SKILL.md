---
name: implement a mockup image as code
description: "Use when a specific image, screenshot, mockup, or Figma frame is the exact chosen visual target and the job is faithful, responsive implementation — not open design exploration and not cloning a live URL. Covers resolving the exact target unambiguously, cataloging and sourcing every visual asset (never faking one with CSS/SVG art), measuring the reference before building, and the pre-handoff QA gate."
---

Use when a specific image, screenshot, mockup, or Figma frame has already been chosen as the exact visual target and the job is faithful, responsive implementation — not open-ended design (that's a fresh direction, not this) and not cloning a live site (use `clone a live site as a local prototype` when there's a real URL instead of a static image). Adapted from a Codex `product-design` plugin skill; stripped of ChatGPT Work Mode/deploy-specific steps.

## Resolve the exact target before touching code

Don't start from a written brief alone — there must be an actual image to recreate. If which image/option is meant is ambiguous (e.g. "the second one" from a set of generated options), resolve it unambiguously first; never guess and build the nearby option. Ask if it can't be resolved.

If the target is a mobile viewport, build mobile (390×844, no horizontal scroll, nothing clipped or off-screen). If unclear, default to desktop.

## Catalog and source every visual asset before building

Zoom into the reference and list every image asset it contains: hero/background images, featured imagery, thumbnails, illustrations, textures, logos, product shots, avatars.

- **Never substitute a real image asset with CSS/div art, hand-drawn or inline SVG, HTML-element drawings, emoji, or a text glyph.** This is the single most common shortcut that makes a build look "close" but not actually faithful — treat it as a hard fail, not a style choice.
- If text is baked into the source image itself (a sign, a poster, a hero photo with type on it), keep it in the image — don't crop it out and rebuild it as an HTML overlay unless the source clearly shows it as separate, editable UI text sitting on top of a plain image.
- Real source assets beat generated ones; generated assets (only if the user has permitted image generation) beat a labeled geometric stand-in; nothing beats a placeholder that pretends to be final.
- Match the reference's art direction, palette, and rendering style across every generated/sourced asset — assets from different visual worlds glued into one mockup is a tell.

## Measure before you build

For every section: measure the layout, the spacing between elements, and the size of the elements themselves against the reference — don't eyeball it from a glance. Find real fonts that match (don't default to a generic system font because it's close enough), and a real icon library that matches the reference's icon style (don't default to whatever's familiar if it's not the closest match).

## Build

Unless the user asked for a static mock only, bring the core experience to life: working navigation/links/tabs/menus/primary CTAs, functional inputs/filters/toggles/forms in the main experience, visible states (hover/focus/selected/open-closed/loading/empty/success where relevant), and the main conversion path working start to finish. Controls outside the core experience can stay visual-only — don't invent new pages/routes the user didn't ask for.

Place every sourced/generated asset into its actual position before calling it done — a CSS/SVG placeholder "temporarily" standing in for an asset you haven't resolved yet is exactly the failure mode this skill exists to prevent.

## Before handoff

Capture the local build (desktop and mobile as relevant) and run `qa a build against its source design` as the blocking gate: open the reference image and the build screenshot together, same viewport/state, and compare from that combined view — not two separate glances held in memory. Don't hand off until it passes.
