const REASONS = [
  {
    title: "Expert-Led Treatments",
    description:
      "Advanced protocols in Clinical Skincare, Laser Resurfacing, Botox, Fillers & RF Microneedling by top aesthetic practitioners.",
  },
  {
    title: "Bespoke Treatment Plans",
    description:
      "Personalized aesthetic roadmaps crafted for your unique skin profile, rejuvenation goals, and lifestyle timelines.",
  },
  {
    title: "24/7 Aesthetic Concierge",
    description:
      "Instant pre-treatment prep, post-procedure aftercare protocols, and medical-grade skincare assistance anytime you need it.",
  },
];

export default function WhyChooseSayraa() {
  return (
    <section className="why-choose-section" id="why-choose">
      {/* Ambient purple atmospheric glow on the left matching reference screenshot */}
      <div className="why-choose-glow" aria-hidden="true" />

      <div className="why-choose-container">
        <h2 className="why-choose-heading">Why Choose Sayraa?</h2>

        <div className="why-choose-grid">
          {REASONS.map((item, idx) => (
            <div className="why-card" key={idx}>
              <h3 className="why-card-title">{item.title}</h3>
              <p className="why-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
