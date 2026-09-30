import SiteLayout from "../components/layout/SiteLayout.jsx";
import MedSpaShowcase from "../components/sections/MedSpaShowcase.jsx";
import WhyChooseSayraa from "../components/sections/WhyChooseSayraa.jsx";

export default function HomePage({ onStartChat }) {
  const handleOpenChat = onStartChat || (() => { window.location.hash = "chat"; });

  return (
    <SiteLayout onStartChat={handleOpenChat}>
      <main id="home" className="home-main-wrap">
        {/* Ambient atmospheric glow blobs */}
        <div className="ambient-glow ambient-glow-left" aria-hidden="true" />
        <div className="ambient-glow ambient-glow-right" aria-hidden="true" />
        <div className="ambient-glow ambient-glow-top" aria-hidden="true" />

        <div className="home-showcase-wrapper">
          <MedSpaShowcase onStartChat={handleOpenChat} />
        </div>

        {/* Why Choose Sayraa med spa feature section */}
        <WhyChooseSayraa />

        {/* Floating Quick-Chat FAB on mobile & desktop */}
        <button
          className="floating-chat-trigger"
          onClick={handleOpenChat}
          aria-label="Open Sayraa Med Spa Chat"
          title="Chat with Sayraa"
        >
          <span className="fab-pulse-ring" />
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="fab-text">Chat with Sayraa</span>
        </button>
      </main>
    </SiteLayout>
  );
}
