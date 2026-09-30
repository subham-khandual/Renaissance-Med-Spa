import { useEffect, useRef } from "react";

export default function ChatComposer({
  disabled,
  isRecording,
  isTranscribing,
  onChange,
  onMicStart,
  onMicStop,
  onSubmit,
  value,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isRecording) inputRef.current?.focus();
  }, [isRecording]);

  return (
    <form className="chat-composer" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="sayraa-message-input">
        Message Sayraa
      </label>
      <div className="composer-input-wrapper">
        {/* Text Input */}
        <input
          ref={inputRef}
          autoComplete="off"
          className="composer-input"
          disabled={disabled || isRecording || isTranscribing}
          id="sayraa-message-input"
          maxLength={1000}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            isRecording
              ? "🎙 Listening — release to send..."
              : isTranscribing
              ? "✦ Transcribing your voice..."
              : "Ask about treatments, bookings, or care tips..."
          }
          value={value}
        />

        {/* Mic Button — hold to speak, release to transcribe */}
        <button
          type="button"
          className={`mic-btn ${isRecording ? "mic-active" : ""} ${isTranscribing ? "mic-transcribing" : ""}`}
          aria-label={isRecording ? "Release to transcribe" : "Hold to speak"}
          title={isRecording ? "Release to send voice" : "Hold to speak"}
          onMouseDown={onMicStart}
          onMouseUp={onMicStop}
          onMouseLeave={onMicStop}
          onTouchStart={(e) => { e.preventDefault(); onMicStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onMicStop(); }}
          disabled={disabled && !isRecording}
        >
          {isTranscribing ? (
            /* Spinner while transcribing */
            <svg className="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
            </svg>
          ) : isRecording ? (
            /* Stop square when recording */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
          ) : (
            /* Mic icon default */
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>

        {/* Send Button */}
        <button
          aria-label="Send message"
          className="composer-send-btn"
          disabled={disabled || !value.trim() || isRecording || isTranscribing}
          type="submit"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m4 11 15-7-5 16-3.5-6.5L4 11Zm6.5 2.5L19 4" />
          </svg>
        </button>
      </div>
    </form>
  );
}
