const DEFAULT_PROMPTS = [
  { icon: "✨", label: "Botox & Wrinkles", text: "Tell me about Botox and neurotoxin treatments." },
  { icon: "💧", label: "HydraFacial Glow", text: "What are the benefits of a HydraFacial treatment?" },
  { icon: "💉", label: "Lip & Cheek Fillers", text: "How do dermal fillers work for facial contouring?" },
  { icon: "🌟", label: "Laser Treatments", text: "What laser skin resurfacing options do you offer?" },
  { icon: "📅", label: "Book Consultation", text: "How can I book a personal consultation at Renaissance Med Spa?" },
  { icon: "📋", label: "Pre-Care Instructions", text: "How should I prepare for my upcoming spa visit?" },
];

export default function QuickPrompts({ onSelectPrompt }) {
  return (
    <div className="quick-prompts-section">
      <p className="quick-prompts-label">Popular Med Spa Inquiries</p>
      <div className="quick-prompts-grid">
        {DEFAULT_PROMPTS.map((item) => (
          <button
            key={item.label}
            className="quick-prompt-chip"
            onClick={() => onSelectPrompt(item.text)}
            type="button"
          >
            <span className="quick-prompt-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="quick-prompt-text">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
