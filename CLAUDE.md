# QazMind — CLAUDE.md

QazMind is a bilingual (Kazakh/Russian) exam-prep platform for the Kazakhstan
ҰБТ/ЕНТ (ENT). Practice tests, wrong-answer review, flashcards (SM-2 spaced
repetition), AI explanations/tutor (OpenAI), and podcasts, backed by a small
FastAPI + React app deployed to a single VPS.

## Project Stack

**Frontend** — `frontend/`
- React 18 (JSX, **not** TypeScript — `@types/react` is a dev-only editor aid,
  there is no `tsconfig.json`) + Vite 5
- Routing: `react-router-dom` v6 · State: `zustand` · HTTP: `axios`
- Styling: Tailwind CSS v3 (`darkMode: 'class'`, custom `primary` scale,
  `Inter`/`Poppins`, custom keyframe animations already defined in
  `tailwind.config.js`) — no component library (no shadcn/ui) is installed
- Animation: `framer-motion`
- No frontend test framework is configured yet. `@playwright/test` (+ Chromium
  browser) is installed as a dev dependency for **browser QA of the running
  app**, not as an authored e2e suite — don't assume `*.spec.ts` files exist.

**Backend** — `backend/`
- Python 3.10, FastAPI, Uvicorn, SQLAlchemy 2.0 (sync sessions, declarative
  models in `app/db/models.py`)
- Auth: hand-rolled JWT (`python-jose`) + `bcrypt` (used directly — `passlib`
  is in `requirements.txt` but unused; don't assume passlib helpers exist).
  `HTTPBearer` + `get_current_user`/`check_admin` deps in `app/core/deps.py`.
- AI: OpenAI (`gpt-4o-mini`) for question explanations and the AI tutor
  (`app/services/ai_service.py`), with a **DB-row-based** per-user rate limit
  (`app/api/tutor.py::_rate_limit_check`) — there is no global rate-limit
  middleware (no slowapi) and no structured logging anywhere yet.
- Email: Mailgun, for password-reset codes only (`app/services/email_service.py`).
- `sqladmin` is in `requirements.txt` but is never imported/mounted anywhere —
  treat it as dead until someone actually wires it up; don't build on it.

**Database**
- SQLAlchemy ORM only, no separate SQL migration framework (no Alembic).
  Schema evolves via `Base.metadata.create_all()` at startup
  (`app/db/bootstrap.py::ensure_schema_compatibility`) plus one-off
  `backend/migrate_*.py` scripts that were run manually. Follow that existing
  pattern for additive changes; don't introduce Alembic without asking.
- The engine is **dual**: `docker-compose.yml` (the actual deployment) runs
  **SQLite** (`sqlite:////app/data/qazmind.db`); `backend/.env.example`
  documents a **PostgreSQL** URL as the local-dev default, and
  `psycopg2-binary` is installed for it. `app/db/database.py` branches on
  `DATABASE_URL` scheme (`connect_args` only added for sqlite). Keep code
  portable across both — avoid SQLite- or Postgres-only SQL/features unless
  you check `is_sqlite` first, same as `database.py` already does.

**Infrastructure**
- Docker Compose: `backend` (Dockerfile copies the seed sqlite db into a named
  volume on first boot) + `frontend` (multi-stage: `npm ci && vite build` →
  nginx). Healthcheck gates frontend startup on backend `/health`.
- Real deployment target is a single VPS: `deploy/nginx-qazmind.conf` +
  `deploy/qazmind-backend.service` (systemd), not Kubernetes.
- No CI/CD (no `.github/workflows`). No formal test suite — `backend/test_*.py`
  are ad hoc manual scripts, not a pytest suite.

## Architecture

Modular monolith: one FastAPI app, routers per domain
(`app/api/{auth,tests,questions,tutor,feedback,podcasts,profile,subjects,admin}.py`
+ `routers/flashcards.py`), one SQLAlchemy model module, one Pydantic schema
module. **Keep it that way.** Do not introduce microservices, CQRS, event
sourcing, message queues, or a repository/mediator layer for this codebase's
scale — a new feature is a router + a model/schema addition, not a new
architectural layer.

## Frontend Rules

- Stay on JS/JSX + Vite + Tailwind + zustand + framer-motion. Don't introduce
  TypeScript, a new state library, or a component framework (shadcn/ui etc.)
  without being asked.
- Reuse `tailwind.config.js`'s existing `primary` palette, fonts, and
  animation keyframes before inventing new ones. The app is bilingual
  (kz/ru) — check both language variants when touching copy or layout, and
  watch for text-length differences between Kazakh and Russian.
- No generic-AI-SaaS default look (purple-blue gradients, glass cards,
  gradient text, cards-in-cards) unless it genuinely fits — this is an
  exam-prep product for Kazakhstani students, not a generic dashboard.
- `framer-motion` is already a dependency — prefer it for new motion instead
  of hand-rolled CSS transitions, and respect `prefers-reduced-motion`.

## Backend Rules

- New endpoints follow the existing router pattern: a router in `app/api/`,
  Pydantic schemas in `app/schemas/schemas.py`, models in `app/db/models.py`,
  wired into `main.py`. Auth via `Depends(get_current_user)` /
  `Depends(check_admin)`, not new ad hoc auth logic.
- Don't add framework/architecture layers (DI containers, service
  interfaces with one implementation, CQRS) that this app's size doesn't need.
- If you add a new AI-backed or otherwise expensive endpoint, follow the
  existing `_rate_limit_check` pattern in `tutor.py` (or extract it to a
  shared helper if a second endpoint needs it) rather than leaving it
  unlimited.

## Database Rules

- Every new table/column: think about PK, FK + `ondelete`/cascade behavior,
  `nullable`, sensible defaults, and whether SQLite *and* Postgres both
  support what you're writing (raw SQL, JSON columns, etc.).
- Don't add an index to every column — only where there's an actual query
  pattern (a `filter()`/`join()` in the routers) that needs one.
- Schema changes go through `ensure_schema_compatibility()`-style additive
  bootstrap logic or a new `migrate_*.py` script, matching what's already
  there — not a manual `ALTER TABLE` against production.

## Security Rules

- **Found and fixed during this setup**: `backend/.env.example` had a
  real-looking Postgres password (`LazerLazer12150305!`) committed in plain
  text (commit `93bd71a`). It's now a placeholder. The real `.env`/`backend/.env`
  files are correctly gitignored and were never tracked — but if that
  password is used anywhere real, rotate it, since it has been in git
  history.
- Never commit real secrets to `.env.example` — placeholders only.
- Auth vs. admin check are two different dependencies
  (`get_current_user` vs `check_admin`) — don't conflate "logged in" with
  "authorized for this resource." Check both on every protected/admin route.
- No global rate limiting exists yet — be deliberate about it on any new
  public-facing endpoint (auth, password reset, AI calls) instead of assuming
  FastAPI/Starlette limits requests for you.
- Never log tokens, passwords, the Mailgun/OpenAI API keys, or full
  Authorization headers.

## Testing Rules

- There is currently no pytest suite and no frontend test runner — don't
  claim "tests pass" unless you actually ran something. When you do add
  tests, `pytest` for backend and Vitest/RTL for frontend are the natural
  fits for this stack (not a rewrite to another stack).
- For anything touching auth, admin checks, the AI rate limiter, or the
  SQLite/Postgres branch in `database.py`, prefer an integration test over a
  unit test — the interesting bugs are in how these pieces compose.
- Use the `playwright` Claude Code plugin (installed below) for real browser
  QA of the frontend — compiling is not verification.

## UI/UX Workflow

For any landing/dashboard/component/redesign work:
product goal → audience (Kazakhstani ЕНТ students, kz/ru) → information
architecture → visual direction → implementation using the existing design
tokens → motion (framer-motion, purposeful only) → **browser QA with
Playwright** (desktop + mobile viewport, console errors, no horizontal
overflow) → critique/polish → accessibility QA → done.

## Definition of Done

**Frontend**: runs with no compile/console errors · checked at 375/768/1024/1440px,
no horizontal overflow · keyboard nav + visible focus states work ·
`prefers-reduced-motion` respected if motion was added · actually opened in a
browser (Playwright), not just read as JSX.

**Backend**: imports/runs · touched endpoints manually exercised (auth,
authorization, validation, error path) · no hardcoded secrets, debug prints,
or dead code left behind · SQLite and Postgres compatibility considered for
any raw SQL or DB-specific feature · failure paths (bad input, missing
auth, DB error) return sane status codes, not a stack trace.

---

## Claude Code environment (installed 2026-09-01, project scope)

Plugins (`claude plugin list` from this directory to verify; all
`scope: project`, cached under the shared `~/.claude/plugins/cache`, so
nothing was re-downloaded per-project):

| Plugin | Marketplace | Use for |
|---|---|---|
| frontend-design | claude-plugins-official | anti-generic visual direction, composition |
| playwright | claude-plugins-official | real browser QA of the running app |
| superpowers | claude-plugins-official | TDD, systematic debugging, verification-before-done |
| backend-development | claude-code-workflows | API design, architecture patterns |
| database-design | claude-code-workflows | schema/SQL/index design |
| python-development | claude-code-workflows | FastAPI/pytest/asyncio/Pydantic |
| backend-api-security | claude-code-workflows | authn/authz, JWT, rate limiting, OWASP API Top 10 |
| security-scanning | claude-code-workflows | dependency/SAST-style checks |
| observability-monitoring | claude-code-workflows | structured logging, metrics, tracing |
| cicd-automation | claude-code-workflows | tests/lint/build/deploy pipelines, if/when CI is added |
| database-migrations | claude-code-workflows | schema-change/migration discipline (current project uses ad hoc scripts, see Database Rules) |
| comprehensive-review | claude-code-workflows | pre-merge full-stack review |
| postgres-best-practices | supabase-agent-skills | indexes, EXPLAIN, pooling, JSONB, pagination (kept even though prod currently runs SQLite, since Postgres is the documented dev/target engine) |

Skills (project-local, `.claude/skills/`): UI UX Pro Max (+ its bundled
`design`, `design-system`, `brand`, `ui-styling`, `banner-design`, `slides`
skills), Emil Kowalski's animation/design skills (`emil-design-eng`,
`animate`, `review-animations`, `improve-animations`,
`find-animation-opportunities`, `pick-ui-library`, `prototype`,
`animation-vocabulary`, `ask-sonner`, `apple-design`, `write-swift`), and
m8ig's `design-skills` set (`design-a-lead-gen-landing-page`,
`extract-design-system-from-a-website`,
`clone-a-live-site-as-a-local-prototype`,
`implement-a-mockup-image-as-code`, `qa-a-build-against-its-source-design`,
`audit-a-product-flow-with-screenshots`,
`research-user-pain-points-for-a-product`).

Not installed: JS/TS backend plugin (backend is Python, not Node),
GraphQL/Kafka/Redis/k8s tooling (not part of this stack and not to be added
without a real reason — see Architecture above).
