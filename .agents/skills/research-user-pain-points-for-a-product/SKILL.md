---
name: research user pain points for a product
description: "Use when asked to research real user pain, UX friction, onboarding problems, docs/help friction, developer-experience friction, or current complaints for a named product — before auditing or redesigning it. Covers public/internal source search, clustering into problem buckets, ranking by severity/frequency/confidence, and a source-cited output format."
---

Use when asked to research real user pain, UX friction, onboarding problems, docs/help friction, developer-experience friction, support pain, or current complaints for a named product — before auditing or redesigning it. Adapted from a Codex `product-design` plugin skill.

## Contract

- Restate the product, audience, and research scope before searching, so the user can redirect before you spend the search budget.
- Cite sources. Separate observed evidence from inference.
- Don't overclaim from a handful of anecdotes, and don't return a raw dump of complaints — the output is a product story with a ranked list, not a pile of quotes.
- Say clearly when source access is missing or weak for a given claim, rather than papering over the gap.

## Workflow

1. State the research scope back to the user (product, audience, time horizon) in one line before searching.
2. Search public sources via `WebSearch`/`WebFetch`: Reddit, X/Twitter, Hacker News, Stack Overflow, GitHub issues/discussions, relevant forums, review sites, YouTube comments, developer communities. Search internal sources too when connected (Slack, Notion, Google Drive, Jira/Linear, support/CRM tools) and the request allows it.
3. Cluster the evidence into the highest-signal problems, then split into buckets: product UI/workflow friction, docs/help friction, onboarding friction, account/billing/permissions/setup friction, developer/API/SDK friction, reliability/performance issues, feature requests (feature requests are not UX friction — keep them separate).
4. Rank by severity, frequency signal, confidence, and product leverage (how much fixing it would actually move the needle vs. how loud the complaint is).

## Output

Default to an in-chat brief:

- **Executive read** — the core story in 5-7 sentences, not a list.
- **Ranked problems** — for each: the problem, the user goal it blocks, the surface it happens on, what breaks, the evidence (with citation), severity, frequency signal, confidence, recommended move.
- **Source map** — what was searched, what each source contributed, where signal was weak or unavailable.
- **Opportunity map** — group into fix this week / fix this quarter / needs deeper research.

Mark internal-only evidence separately from public evidence. Separate loud complaints (a few very vocal users) from frequent problems (many independent reports) — they call for different responses.
