# Technology Stack — No Database

## Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS + CSS variables/design tokens
- React Router
- Motion / Framer Motion
- Lucide React
- React Hook Form + Zod
- Vitest + React Testing Library + Playwright

## Content
- Local TypeScript/JSON/Markdown content files under `src/content/`
- No PostgreSQL, MongoDB, Prisma, Firebase database, or custom database layer.
- Optional static CMS can be evaluated later if non-developers need content editing.

## Integrations
- Clinic-approved external appointment scheduler
- Hosted contact form/email service (no custom database)
- Google Maps directions link or domain-restricted Maps API
- Privacy-conscious analytics with consent as applicable

## Hosting and delivery
- Vercel or Netlify static hosting
- GitHub Actions for lint, typecheck, tests, build, link checks
- HTTPS, CDN caching, preview deployments
- Optional Sentry with PII scrubbing

## Engineering rules
TypeScript strict mode, reusable components, mobile-first CSS, optimized images, accessible interactions, source-controlled content, no secrets in client bundles, and no patient data storage in the marketing website.
