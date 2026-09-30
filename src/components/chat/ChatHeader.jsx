import sayraaLogo from "../../assets/sayraa_avatar.png";

export default function ChatHeader({ onClose, autoSpeak, isSpeaking, onToggleSpeak }) {
  return (
    <header className="chat-header">
      <div className="chat-header-identity">
        <div className="chat-avatar-wrapper">
          <img
            src={sayraaLogo}
            alt="Sayraa — Renaissance Med Spa Virtual Concierge"
            className="chat-avatar-img"
          />
          <span className="chat-status-pulse" title="Sayraa is online" />
        </div>
        <div className="chat-heading">
          <div className="chat-title-row">
            <h2 id="chat-title">Chat with Sayraa</h2>
            <span className="chat-badge">AI Concierge</span>
          </div>
          <p className="chat-subtitle">
            Renaissance Med Spa &bull; Available 24 / 7
          </p>
        </div>
      </div>

      <div className="chat-header-actions">
        {/* Auto-TTS toggle */}
        <button
          className={`voice-toggle-btn ${autoSpeak ? "voice-on" : "voice-off"}`}
          onClick={onToggleSpeak}
          aria-label={autoSpeak ? "Mute Sayraa voice" : "Unmute Sayraa voice"}
          title={autoSpeak ? "Mute auto-read" : "Enable auto-read"}
          type="button"
        >
          {isSpeaking ? (
            /* Animated speaker waves when currently speaking */
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <path className="speaker-wave-1" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path className="speaker-wave-2" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : autoSpeak ? (
            /* Speaker on */
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            /* Speaker muted (X) */
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        {/* Close */}
        <button
          aria-label="Close chat"
          className="close-chat-btn"
          onClick={onClose}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}
