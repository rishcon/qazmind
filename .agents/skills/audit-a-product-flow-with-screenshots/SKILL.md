---
name: audit a product flow with screenshots
description: "Use when asked to audit, review, critique, or evaluate a multi-step product experience (onboarding, checkout, settings, signup funnel) rather than a single screen. Covers evidence-only auditing, reject-and-recapture discipline for bad screenshots, UX + accessibility lenses, and a report format with findings tied to specific numbered screenshots."
---

Use when asked to audit, review, critique, inspect, or evaluate a multi-step product experience — onboarding, checkout, settings, a signup funnel, any flow with more than one screen — not a single static screen (for a single screen/component, `ui-designer`/`ux-designer`'s own audit format is enough). Adapted from a Codex `product-design` plugin skill. The output is evidence-tied, not a loose opinion: numbered steps, a screenshot per step, findings tied to specific screenshots, explicit limits on what couldn't be checked from screenshots alone.

## Rule: evidence from this run only

Use only screenshots captured in the current audit. Don't audit from memory, prior chats, cached screenshots, or indirect sources (help-center pages, web search results describing the flow) — those are research, not an audit. If the flow can't actually be reached and captured, say that plainly rather than producing something that looks like an audit but isn't grounded in the real thing.

## Workflow

1. Identify the product, the exact flow/task, and the capture tool (`claude-in-chrome` for a live site/app; local dev server + browser for an in-progress build).
2. For each step of the flow:
   - Move to the next step, wait for the screen to load and settle.
   - Check for loading spinners, blank areas, login walls, error pages, cookie dialogs, half-rendered content — if the capture shows any of these instead of the real state, reject it and recapture. Don't accept a bad screenshot just to keep moving.
   - Capture the screenshot, then actually look at it before accepting it as evidence.
   - Observe behavior that matters: navigation, focus, validation, error handling, empty states, motion, whether the next action is obvious.
   - Save with an ordered name (`01-start.png`, `02-form-filled.png`, `03-confirmation.png`) and write notes for that step before moving to the next.
3. In notes for each step, cover: strengths, UX issues, accessibility risks visible from the screenshot, and any limits that made the step hard to audit (don't claim full WCAG compliance from a screenshot — say what's visible and what still needs real testing, like keyboard-only traversal or a screen reader pass).

## Lenses (use both unless the user asked for only one)

**UX**: task entry/discoverability, information architecture, interaction flow and friction, hierarchy and clarity, trust and reassurance signals, default/empty states, copy and CTAs, consistency across the flow.

**Accessibility**: perceivable content and contrast risk, semantic structure and reading order, keyboard access and focus behavior, target size, labels/instructions/error recovery, motion and state-change communication, responsive reflow and zoom resilience.

## Output

Render the accepted screenshots inline, in flow order, with the report. Keep it pithy: overall verdict, numbered steps with a one-line health read on each, highest-impact changes, evidence limits. Every finding must point to the specific screenshot/step that supports it — a finding with no evidence behind it doesn't go in the report.

Structure (UX / accessibility / combined, pick what the request calls for):
1. Audit scope
2. User goal (and accessibility target, if included)
3. Strengths
4. Risks (UX and/or accessibility)
5. Opportunity areas
6. Evidence limits and verification gaps
7. Recommendations, tied back to the user goal or accessibility outcome — not generic polish suggestions

Stay scoped to experience patterns, not business strategy. Separate structural issues from pure polish. If the request is about one bounded interaction (a single modal, a single form), don't inflate it into a whole-flow audit.
