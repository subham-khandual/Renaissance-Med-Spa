import sayraa1 from "../../assets/sayraa_pose1.png";
import sayraa2 from "../../assets/sayraa_pose2.png";
import sayraa3 from "../../assets/sayraa_pose3.png";

const portraits = [
  { image: sayraa1, alt: "Sayraa welcoming a spa guest" },
  { image: sayraa2, alt: "Sayraa, your Renaissance Med Spa concierge" },
  { image: sayraa3, alt: "Sayraa ready to help with your spa visit" },
];

export default function SayraaGallery() {
  return (
    <section aria-labelledby="about-title" className="sayraa-gallery" id="about">
      <div className="gallery-heading">
        <p className="eyebrow">Meet your virtual concierge</p>
        <h2 id="about-title">A familiar face, here to help.</h2>
      </div>
      <div className="portrait-grid">
        {portraits.map((portrait, index) => (
          <figure className="portrait-card" key={portrait.image}>
            <img
              alt={portrait.alt}
              className="portrait-image"
              height="1254"
              loading={index === 0 ? "eager" : "lazy"}
              src={portrait.image}
              width="1254"
            />
            <figcaption>
              <span className="portrait-name">Sayraa</span>
              <span className="portrait-caption">
                {["Your spa guide", "Here for your questions", "Ready when you are"][index]}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
