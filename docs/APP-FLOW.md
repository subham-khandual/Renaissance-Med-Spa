# Application Flow

## Visitor journey
1. Arrive at home → see brand promise, clinician-led positioning, consultation CTA.
2. Browse service category → select treatment card.
3. Read detail page: what the service is, general process, FAQ, consultation note, and clinician-review disclaimer.
4. Select “Schedule Consultation” → open clinic-approved booking platform or contact path.
5. For general questions, use contact form → client validates fields → secure hosted form endpoint → confirmation/error state.
6. Visitor can call, email, or open directions from header/footer/contact page.
7. Explore membership/offers → review full terms, date, eligibility, and availability before booking.

## Content publishing flow
Edit typed static content → review factual/clinical claims → clinic owner approval → preview build → deploy. Expired promotions must be removed or marked expired.

## Important states
- Form invalid: inline field guidance.
- Form submit failure: preserve entered values and show retry/phone option.
- External booking unavailable: show call/email fallback.
- Gallery image: descriptive alt text; before/after labels and consent verified.
- Mobile menu: focus management, Escape closes, links remain keyboard accessible.
