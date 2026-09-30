import sayraaLogo from "../../assets/sayraa_avatar.png";

export default function ChatMessage({ message, onSpeak, isSpeakingThisMsg }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`message-row ${message.role}`}>
      {isAssistant && (
        <div className="message-avatar" aria-hidden="true">
          <img src={sayraaLogo} alt="Sayraa" className="message-avatar-img" />
        </div>
      )}

      <div className="message-bubble-wrapper">
        <div className="message-bubble">
          <p className="message-text">{message.text}</p>

          {/* TTS Speak button — only on assistant messages */}
          {isAssistant && onSpeak && (
            <button
              className={`speak-btn ${isSpeakingThisMsg ? "speak-btn-active" : ""}`}
              onClick={() => onSpeak(message.text, message.id)}
              aria-label={isSpeakingThisMsg ? "Stop speaking" : "Read this message aloud"}
              title={isSpeakingThisMsg ? "Stop" : "Listen"}
              type="button"
            >
              {isSpeakingThisMsg ? (
                /* Speaker-off / stop icon */
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                </svg>
              ) : (
                /* Speaker icon */
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          )}
        </div>

        {message.time && (
          <span className="message-timestamp">{message.time}</span>
        )}
      </div>
    </div>
  );
}
