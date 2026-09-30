# Technical Requirements Document

## Architecture decision
Build a static-first website with React 19 and Vite. No application database or custom backend is required for the initial marketing site.

## Frontend
- React 19 + TypeScript + Vite
- Tailwind CSS with design tokens
- React Router (or file-based routing if framework changes)
- Motion/Framer Motion for restrained animation
- Lucide React icons
- React Hook Form + Zod for contact form validation
- Vitest, React Testing Library, Playwright

## Content and integrations
- Content stored in typed local data files (`src/content/services.ts`, `offers.ts`, `faqs.ts`, `site.ts`) or Markdown.
- Booking: link/embed from the clinic's authorized scheduler; avoid duplicating appointment or patient records.
- Contact form: approved hosted form endpoint/email provider with spam protection; submit only necessary fields.
- Maps: external directions link or approved map embed; no API key in client code unless domain-restricted and intended for public use.
- Analytics: privacy-conscious analytics with consent controls where applicable.

## Routes
`/`, `/about`, `/services`, `/services/:slug`, `/membership`, `/offers`, `/gallery`, `/faq`, `/contact`, `/privacy`, `/terms`, `/accessibility`, `/cancellation-policy`.

## Quality requirements
- Semantic HTML, keyboard support, visible focus, reduced motion.
- Image optimization (WebP/AVIF), lazy loading below fold, explicit dimensions.
- Centralized design tokens and reusable page sections.
- SEO title/description per route, canonical URLs, sitemap, Open Graph.
- CI: lint, typecheck, tests, production build, link checks.

## Deployment
Deploy static build to Vercel or Netlify. Configure domain, HTTPS, redirects, environment-specific analytics/form endpoint, and preview deployments. Keep secrets out of `VITE_*` variables; frontend variables are public.
