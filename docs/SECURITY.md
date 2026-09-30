# Security, Privacy, and Healthcare Content Safety

## Data minimization
The marketing site must not collect or store medical histories, symptoms, photographs, medication lists, or patient records. Do not build patient accounts or appointment management into the static site.

## Contact form
- Use a reputable HTTPS form provider approved by the clinic.
- Collect only name, contact method, and general message necessary for follow-up.
- Warn visitors not to submit sensitive health details through a general contact form.
- Add spam protection, server-side validation at provider, retention limits, and access restrictions.
- Never include secrets in frontend source or `VITE_*` environment variables.

## Web security
HTTPS, secure hosting headers, dependency updates, strict external-link handling, CSP where feasible, input validation, and no unsafe HTML rendering. Restrict any public map API key by domain and API.

## Clinical and marketing safeguards
- Clinic/qualified clinician approves treatment descriptions, contraindications, aftercare, credentials, and claims.
- No diagnosis, individualized treatment recommendations, guaranteed outcomes, or fabricated reviews.
- Gallery images require documented permission and accurate before/after context.
- Promotions and membership details must show eligibility, dates, limitations, and cancellation terms.
- Provide emergency guidance directing urgent concerns to local emergency services, not the contact form.

## Operations
Use least-privilege hosting access, MFA, backups of source content, dependency scanning, and a documented process to remove outdated offers or incorrect clinical content.
