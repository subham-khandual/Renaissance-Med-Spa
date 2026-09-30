import { useState } from "react";

export default function GuideSection({
  description,
  imageSide,
  imageUrl,
  index,
  title,
  onStartChat,
}) {
  const [imageState, setImageState] = useState("loading");
  const imageFirst = imageSide === "left";

  return (
    <section
      aria-labelledby={`guide-title-${index}`}
      className={`guide-section grid items-center gap-8 py-12 sm:grid-cols-2 sm:gap-14 sm:py-16 ${
        imageFirst ? "" : "guide-section-reversed"
      }`}
      id={index === 0 ? "about" : undefined}
    >
      <div className="guide-art-wrap">
        <img
          alt="Sayraa, your Renaissance Med Spa concierge"
          className="guide-art"
          height="360"
          loading="lazy"
          src={imageUrl}
          width="300"
          onLoad={() => setImageState("ready")}
          onError={() => setImageState("failed")}
        />
        {imageState !== "ready" && (
          <div className="guide-art-fallback" aria-hidden="true">
            <span className="guide-orbit guide-orbit-one" />
            <span className="guide-orbit guide-orbit-two" />
            <span className="guide-star">✦</span>
            <span className="guide-fallback-name">sayraa</span>
            <span className="guide-fallback-caption">your spa concierge</span>
          </div>
        )}
      </div>

      <div className="guide-copy text-center">
        <p className="eyebrow">{index === 0 ? "Your spa concierge" : "Here to help"}</p>
        <h2 id={`guide-title-${index}`}>{title}</h2>
        <p className="guide-description">{description}</p>
        <button className="button button-outline chat-now" onClick={onStartChat}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path
              d="M5 5.5h14v10H9l-4 3v-13Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
          Chat now
        </button>
      </div>
    </section>
  );
}
