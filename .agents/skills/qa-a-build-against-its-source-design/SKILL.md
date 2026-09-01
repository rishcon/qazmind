---
name: qa a build against its source design
description: "Use as a blocking gate before handing off coded UI (landing page, prototype, component) that has a source visual target — a live reference site, screenshot, mockup, or design-system doc. Covers side-by-side comparison discipline, the five required fidelity surfaces (typography, spacing, color, image fidelity, copy), P0-P3 severity, and iterating until a clean pass."
---

Use this as a blocking gate before handing off any coded UI (landing page, prototype, component) that has a source visual target — a live reference site, a screenshot, a mockup, or a design-system doc. Adapted from a Codex `product-design` plugin skill; stripped of ChatGPT Work Mode/deploy-specific steps, kept as a general verification discipline for any coding environment.

## The core rule

Design QA is a comparison, not a vibe check. Don't judge from memory, from the code you just wrote, or from a single screenshot viewed in isolation. Open the source and the implementation **side by side in the same view** (same crop, same viewport, same state) before writing a single finding — a mental comparison across two separate tool calls is not a comparison.

A pass requires both artifacts to exist and be inspectable:
- **Source**: a live URL, a screenshot/mockup, a design-system doc's stated tokens, or a prior approved version.
- **Implementation**: a rendered screenshot of the actual build, at the same viewport/state as the source.

If either can't be opened or captured, the result is `blocked`, named explicitly — never silently skip the comparison and call it done.

## Five required fidelity surfaces

Every QA pass must explicitly check all five, even if the user didn't name them:

1. **Typography** — family, weight, size, line height, letter spacing, hierarchy, wrapping/truncation, whether display vs. body text use the right optical weight for their scale.
2. **Spacing/layout rhythm** — margins, padding, gaps, alignment, radii, shadow character, vertical rhythm, density drift from the source.
3. **Color/tokens** — palette match, gradients, opacity, contrast, whether implementation colors actually trace to the source's tokens rather than eyeballed approximations.
4. **Image/asset fidelity** — subject match, crop, scale, sharpness, transparency/masking artifacts. **Automatic fail**: any logo, illustration, decorative mark, or product image from the source that got replaced with hand-drawn CSS/SVG art, a div/span shape, a gradient standing in for a photo, an emoji, or a text glyph. That's not a stylistic difference, it's a missing asset wearing a costume.
5. **Copy/content** — coherent, fits the app's own context, not obviously leaking the build prompt into user-facing text.

## Severity and iteration

- `P0` — blocks core use, severe a11y failure, broken layout, impossible task.
- `P1` — major mismatch or usability regression a real user would notice.
- `P2` — moderate visual drift, inconsistent state, responsive issue, fixable polish gap.
- `P3` — minor refinement; does not block handoff.

Any P0/P1/P2 found → record it, fix it, re-capture the implementation at the same viewport/state, compare again. Repeat until a pass finds **zero** actionable P0/P1/P2 — the first "clean" pass only counts if it made no fixes in response to it. Don't loop forever on P3s; list remaining ones as follow-up polish instead of blocking on them. Build/lint/dependency troubleshooting is not a QA iteration.

## What makes a finding useful (and what doesn't)

A real finding names: the specific mismatch, evidence from both sides, why it matters to a user, a concrete fix (CSS/token/copy-level when possible), and which fidelity surface it belongs to.

Reject-worthy findings to avoid writing:
- "Make it more polished" — not actionable, not tied to evidence.
- Flagging placeholder content that has nothing to do with the actual design intent.
- Treating an intentional deviation as a bug — if a difference might be deliberate, phrase it as a question, don't assert it's wrong.
- Bundling multiple unrelated issues into one finding.

Also actively flag "AI shortcut artifacts" even if they weren't the thing you were asked to check: generic rounded-card-with-icon patterns that don't exist in the source, decorative gradient blobs, a custom SVG doing duty for a real illustration, a mismatched hero image, borders/shadows the source doesn't have. These are the tells that the build drifted toward generic defaults instead of matching the actual target.

## Report format

```markdown
**Findings**
- [P1] Short issue title
  Location: section/component/selector.
  Evidence: source shows X, implementation shows Y.
  Impact: why this matters.
  Fix: concrete change.

**Open Questions**
- Ambiguity about intentional deviations or unavailable states.

**Implementation Checklist**
- Ordered, directly-executable fixes.

**Follow-up Polish**
- P3 refinements, non-blocking.

**Final result:** passed | blocked
```

`passed` = no actionable P0/P1/P2 remain (P3s may remain as follow-up). `blocked` = actionable P0/P1/P2 remain, or the comparison itself couldn't be done — name the blocker either way, don't hand off silently short of a real pass.
