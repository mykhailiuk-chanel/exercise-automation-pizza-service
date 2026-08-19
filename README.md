# Pizza Palace — QA Automation Practice Site

A free, open pizza-ordering website built specifically for practicing UI automation
(Selenium, Playwright, Cypress) and API automation (Postman, RestAssured, etc.).
It's a fake shop, not a real one — no real orders, no real payments, no real pizza.

See:
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — architecture, data model, and the build checklist.
- [MONETIZATION_STRATEGY.md](./MONETIZATION_STRATEGY.md) — SEO, content, and monetization rollout.

## Stack

- **apps/web** — Next.js (App Router) frontend
- **apps/api** — NestJS backend, with a public Swagger doc at `/api/docs`
- **packages/shared-types** — DTOs/enums shared between frontend and backend

## Local development

```bash
pnpm install
docker compose up -d      # starts Postgres on localhost:5432
pnpm dev                  # runs web + api in parallel via Turborepo
```

- Web: http://localhost:3059
- API: http://localhost:3053/api
- Swagger docs: http://localhost:3053/api/docs

## License

MIT
