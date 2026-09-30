export const initialMessages = [
  {
    id: "welcome",
    role: "assistant",
    text: "Welcome to Renaissance Med Spa! ✨ I'm Sayraa, your virtual aesthetic concierge. Whether you're curious about Botox, HydraFacial rejuvenation, laser therapies, or scheduling a consultation, I'm here to guide your journey to timeless beauty.",
    time: "Just now",
  },
];

const MED_SPA_KNOWLEDGE = [
  {
    keywords: ["botox", "wrinkle", "toxin", "dysport", "xeomin", "forehead", "crow"],
    reply:
      "At Renaissance Med Spa, our FDA-approved neurotoxin treatments (including Botox® and Dysport®) gently soften expression lines while preserving your natural movement. Most sessions take only 15–20 minutes with zero required downtime. Results typically start showing in 3–5 days and last 3 to 4 months.",
  },
  {
    keywords: ["hydra", "facial", "cleanse", "peel", "glow", "pore"],
    reply:
      "Our signature HydraFacial® and Medical-Grade Chemical Peels deliver immediate radiance with deep vortex extraction, intense hydration, and potent antioxidant infusions. It's the ultimate red-carpet glow treatment for refreshing congested skin and smoothing uneven tone.",
  },
  {
    keywords: ["filler", "lip", "cheek", "jaw", "volume", "juvederm", "restylane"],
    reply:
      "Our expert injectors specialize in bespoke dermal filler treatments (featuring Juvéderm® and Restylane®) crafted to subtly restore facial contours, sculpt cheekbones, define jawlines, or add soft, natural lip volume.",
  },
  {
    keywords: ["laser", "hair", "resurfacing", "ipl", "bbl", "pigment"],
    reply:
      "We utilize state-of-the-art laser technology for gentle skin resurfacing, sun spot correction, vascular clarity, and permanent laser hair reduction. Treatments are calibrated precisely for your individual skin phototype for optimal comfort and results.",
  },
  {
    keywords: ["appoint", "book", "schedul", "consult", "cost", "price", "visit"],
    reply:
      "We recommend beginning with an in-depth 1-on-1 Skin & Wellness Consultation at Renaissance Med Spa. Our licensed clinical team will analyze your skin profile and craft a bespoke aesthetic treatment plan. Would you like assistance connecting with our reception desk?",
  },
  {
    keywords: ["prep", "care", "after", "before", "sun", "makeup"],
    reply:
      "For best results prior to your appointment: avoid blood-thinning supplements and alcohol for 24–48 hours, pause retinoids 3 days prior, and stay well hydrated. Post-treatment, keep the treated areas clean, avoid heavy exercise for 24 hours, and wear broad-spectrum SPF 50 daily!",
  },
];

export function createPreviewReply(userMessage = "") {
  const query = userMessage.toLowerCase();
  for (const item of MED_SPA_KNOWLEDGE) {
    if (item.keywords.some((k) => query.includes(k))) {
      return item.reply;
    }
  }

  return "Thank you for contacting Renaissance Med Spa! Sayraa is equipped to discuss all our aesthetic therapies, pre-treatment preparation, and spa services. For personalized medical assessments or immediate reservations, our front-desk concierge is delighted to welcome you.";
}
