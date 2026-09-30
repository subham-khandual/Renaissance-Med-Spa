import { services } from "../../content/services.js";

export default function LearningSection({ onStartChat }) {
  return (
    <section aria-labelledby="learning-title" className="learning-section" id="services">
      <div className="learning-heading">
        <p className="eyebrow">Here to make things easier</p>
        <h2 id="learning-title">How can Sayraa help?</h2>
        <p>Choose a topic to start a conversation with your spa concierge.</p>
      </div>

      <div className="learning-grid">
        {services.map((service) => (
          <button
            className="learning-card"
            key={service.title}
            onClick={onStartChat}
          >
            <span aria-hidden="true" className="learning-card-icon">
              {service.icon}
            </span>
            <span className="learning-card-title">{service.title}</span>
            <span className="learning-card-copy">{service.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
