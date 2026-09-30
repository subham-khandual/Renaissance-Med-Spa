# Sayraa Website Architecture

## Overview
Static React application hosted on a CDN. The EduSkill home page presents Sayraa and a client-side chat preview. Curated copy lives in JavaScript content modules. There is no database or custom API server; connect an approved AI service before representing the chat as live.

## Project structure
```text
sayraa-eduskill/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── app/
│   │   └── App.jsx
│   ├── components/
│   │   ├── cards/
│   │   ├── forms/
│   │   ├── layout/
│   │   ├── navigation/
│   │   └── sections/
│   ├── content/
│   │   ├── faqs.js
│   │   ├── membership.js
│   │   ├── offers.js
│   │   ├── services.js
│   │   └── site.js
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   └── main.jsx
├── docs/
├── package.json
└── README.md
```

The example originally used TypeScript extensions; this implementation uses `.js` and `.jsx` as requested.

## Integration boundaries
- The current chat is a UI preview; messages are not sent to an AI service.
- Add a server-side integration before connecting a model. Never expose provider secrets in frontend code or `VITE_*` variables.
- Do not ask users to share sensitive personal information in the preview chat.

## Deployment
Vercel/Netlify static hosting + CDN + HTTPS. Configure canonical domain and sitemap URLs before production deployment.
