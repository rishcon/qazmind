---
name: clone a live site as a local prototype
description: "Use when asked to clone or faithfully recreate an existing live site/app as a runnable local frontend — not to redesign or make something 'like' it. Covers capture-before-build discipline (scroll-by-scroll desktop+mobile capture, testing every interaction), real-asset-only sourcing with named substitutions, and the fidelity-only build constraint (zero new visual ideas)."
---

Use when asked to clone or faithfully recreate an existing live site/app as a runnable local frontend — not "make something like it" or "redesign it" (that's ideation/new-design work, use `design a lead-gen landing page` or a fresh direction instead). The defining constraint here is fidelity: build only what you actually captured, add zero new visual ideas. Adapted from a Codex `product-design` plugin skill; stripped of ChatGPT Work Mode/deploy-specific steps.

## Before starting

Tell the user this is only for sites/apps they own or have permission to recreate, and wait for that to be acknowledged if there's any doubt — don't silently proceed on an ambiguous case.

## Capture first, build second

Do not scaffold, write app code, or start a server until capture is complete. Building first and checking against the source later produces drift you then have to hunt for.

1. Open the source URL (`claude-in-chrome` or headless browser). Confirm it's actually the right page — not a login wall, promo page, loading screen, error page, or unrelated redirect. If it's wrong, retry; if every attempt shows the wrong page, stop and say what you're actually seeing.
2. Capture the whole page: start at the top, scroll down in small steps, capture what's visible at each step, note new sections, sticky elements, animations, lazy-loaded content. Scroll back to the top and confirm nothing changed on re-entry. Repeat the whole pass at a mobile viewport (390×844).
3. Pull everything needed to recreate it from the DOM/inspector: structure, components, exact copy, links, buttons/controls and their states, images, icons, fonts, videos, SVGs, stylesheets, colors, spacing, layout sizes, responsive breakpoints.
4. Find and test every visible interaction one at a time — nav, buttons, links, inputs, menus, drawers, modals, tabs, carousels, hover states, sticky behavior. Return to the starting state before testing the next one. Save evidence whenever the page visibly changes.
5. Copy the real assets locally (see `design a lead-gen landing page` section 2 for the curl/grep technique — inspect the page source for `src=`/`srcset=`/`data-src=` and download directly, largest size variant available). Never hotlink source assets in the final build.
   - If an image genuinely can't be copied: generate a replacement only if the user has permitted image generation, using a screenshot of the original as reference. Otherwise use the closest freely-available match.
   - If a font can't be copied, use the closest open-source match.
   - If an icon/glyph can't be copied, use the closest matching open-source icon set — don't default to whatever's familiar if it's not actually the closest match.
   - Name every substitution explicitly (what, why, what was used instead) — a silent substitution looks like a faithful copy when it isn't one.

## Build

Build only from what was captured, copied, or gathered in the steps above.

- Do not add new visual ideas, invented layouts, or "improvements" — that's a different task.
- Do not use hotlinked source assets.
- Do not guess at a value (spacing, color, copy) when the source evidence for it exists — go back and check rather than approximate.
- Do not fake a visible asset with CSS/div art, hand-drawn SVG, emoji, or a text glyph standing in for something the source actually shows as an image — resolve the real asset first (see above), then build.

Run the local app and compare it against the original at both desktop and mobile: every captured interaction, every state. Fix obvious mismatches before the formal QA pass.

## Before handoff

Run `qa a build against its source design` as the blocking gate — source is the captured original, implementation is the local build, at matching viewport/state. Don't hand off until it passes (no actionable P0/P1/P2 remaining); P3s can ship as noted follow-up polish.
