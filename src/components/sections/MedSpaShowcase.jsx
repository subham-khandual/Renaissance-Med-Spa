import sayraaPose1 from "../../assets/sayraa_pose1.png";
import sayraaPose2 from "../../assets/sayraa_pose2.png";
import sayraaPose3 from "../../assets/sayraa_pose3.png";

const SHOWCASE_SECTIONS = [
  {
    id: "meet-sayraa",
    image: sayraaPose2,
    imageAlt: "Sayraa smiling warmly ready to assist with aesthetic consultations",
    imageSide: "left",
    charSize: "char-medium",
    eyebrow: "Renaissance Med Spa Concierge",
    titleBefore: "Meet ",
    gradientWord: "Sayraa",
    titleAfter: "\nRenaissance Med Spa\nCare & Wellness",
    description:
      "Sayraa is your dedicated companion for Renaissance Med Spa treatments, clinical skincare, laser therapies, injectable planning, and radiant wellness guidance.",
  },
  {
    id: "personalized-intelligence",
    image: sayraaPose1,
    imageAlt: "Sayraa looking over her shoulder welcoming spa guests",
    imageSide: "right",
    charSize: "char-medium",
    eyebrow: "Tailored Aesthetic Guidance",
    titleBefore: "Your ",
    gradientWord: "Personalized",
    titleAfter: "\nMedSpa Intelligence",
    description:
      "Sayraa is designed to guide your aesthetic journey, recommend bespoke treatment plans, and elevate your care with precise, reliable, and intelligent AI mentorship.",
  },
  {
    id: "discover-radiance",
    image: sayraaPose3,
    imageAlt: "Sayraa walking gracefully, Renaissance Med Spa AI Concierge",
    imageSide: "left",
    charSize: "char-medium",
    eyebrow: "Holistic Clinical Solutions",
    titleBefore: "Discover ",
    gradientWord: "Radiance",
    titleAfter: "\nUnlock Timeless Beauty",
    description:
      "With cutting-edge aesthetic intelligence, Sayraa empowers you with customized skincare regimens, curated treatment roadmaps, and actionable wellness insights.",
  },
];

export default function MedSpaShowcase({ onStartChat }) {
  return (
    <div className="showcase-container">
      {SHOWCASE_SECTIONS.map((section, index) => {
        const isImageLeft = section.imageSide === "left";

        return (
          <section
            key={section.id}
            id={section.id}
            className={`showcase-row ${isImageLeft ? "image-left" : "image-right"}`}
          >
            {/* Character Column */}
            <div className="showcase-image-col">
              <div className={`character-stage ${section.charSize || ""}`}>
                {/* Glowing neon aura behind character */}
                <div className="character-glow-halo" aria-hidden="true" />
                <img
                  src={section.image}
                  alt={section.imageAlt}
                  className="character-portrait"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>

            {/* Content Column */}
            <div className="showcase-content-col">
              <div className="showcase-text-block">
                {section.eyebrow && (
                  <p className="showcase-eyebrow">{section.eyebrow}</p>
                )}
                <h2 className="showcase-heading">
                  {section.titleBefore}
                  <span className="gradient-highlight">{section.gradientWord}</span>
                  {section.titleAfter
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, i) => (
                      <span key={i} className="heading-line">
                        {line}
                      </span>
                    ))}
                </h2>

                <p className="showcase-description">{section.description}</p>

                <div className="showcase-cta-wrap">
                  <button
                    className="neon-chat-btn"
                    onClick={onStartChat}
                    type="button"
                    aria-label={`Chat now with Sayraa about ${section.gradientWord}`}
                  >
                    <svg
                      aria-hidden="true"
                      className="chat-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>CHAT NOW</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
