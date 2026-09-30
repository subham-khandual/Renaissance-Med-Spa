import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat.js";
import { useVoice } from "../../hooks/useVoice.js";
import medspaLogo from "../../assets/medspa_logo.jpg";
import ChatHeader from "./ChatHeader.jsx";
import ChatMessage from "./ChatMessage.jsx";
import QuickPrompts from "./QuickPrompts.jsx";
import ChatComposer from "./ChatComposer.jsx";

export default function ChatPanel({ onClose }) {
  const { input, isTyping, messages, sendMessage, setInput } = useChat();
  const messagesEndRef = useRef(null);

  // Track which message's TTS is actively playing
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  // Auto-TTS toggle (can be muted by user)
  const [autoSpeak, setAutoSpeak] = useState(true);

 
  const handleTranscript = useCallback(
    (text) => {
      // Auto-send transcribed voice input directly
      sendMessage(text);
    },
    [sendMessage]
  );

  const {
    isRecording,
    isTranscribing,
    isSpeaking,
    voiceError,
    setVoiceError,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
  } = useVoice({ onTranscript: handleTranscript });

  // ── Keyboard: Escape → close & Lock background scroll ────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // ── Auto-scroll to bottom on new messages ───────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Auto-TTS: read Sayraa's latest reply ────────────────────────────────
  useEffect(() => {
    if (!autoSpeak || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role !== "assistant" || last.id === "welcome") return;

    setSpeakingMsgId(last.id);
    speak(last.text).finally(() => setSpeakingMsgId(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // ── Send form submit ─────────────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    sendMessage();
  }

  // ── Manual speak / stop on a specific message ───────────────────────────
  function handleSpeak(text, msgId) {
    if (speakingMsgId === msgId) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      speak(text).finally(() => setSpeakingMsgId(null));
    }
  }

  // ── Quick prompt chip selected ───────────────────────────────────────────
  function handlePromptSelect(text) {
    sendMessage(text);
  }

  return (
    <div
      className="chat-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <section
        aria-labelledby="chat-title"
        aria-modal="true"
        className="chat-panel"
        role="dialog"
      >
        {/* ── Background Image of the Chat ──────────────────────────────── */}
        <div className="chat-panel-bg" aria-hidden="true">
          <img src={medspaLogo} alt="" className="chat-panel-bg-img" />
          <div className="chat-panel-bg-overlay" />
        </div>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <ChatHeader
          onClose={onClose}
          autoSpeak={autoSpeak}
          isSpeaking={isSpeaking}
          onToggleSpeak={() => {
            if (isSpeaking) { stopSpeaking(); setSpeakingMsgId(null); }
            setAutoSpeak((v) => !v);
          }}
        />

        {/* ── Messages ───────────────────────────────────────────────────── */}
        <div aria-live="polite" className="chat-messages-scroll">
          <div className="chat-messages-container">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onSpeak={handleSpeak}
                isSpeakingThisMsg={speakingMsgId === msg.id}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="message-row assistant typing-row">
                <div className="typing-indicator" aria-label="Sayraa is typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Quick Prompts (only before first user message) ─────────────── */}
        {messages.length <= 1 && (
          <QuickPrompts onSelectPrompt={handlePromptSelect} />
        )}

        {/* ── Voice / API Error Banner ────────────────────────────────────── */}
        {voiceError && (
          <div className="voice-error-banner" role="alert">
            <span>{voiceError}</span>
            <button
              className="voice-error-dismiss"
              onClick={() => setVoiceError(null)}
              aria-label="Dismiss error"
              type="button"
            >
              ×
            </button>
          </div>
        )}

        {/* ── Footer: Composer ────────────────────────────────────────────── */}
        <div className="chat-footer-area">
          <ChatComposer
            disabled={isTyping}
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            onChange={setInput}
            onMicStart={startRecording}
            onMicStop={stopRecording}
            onSubmit={handleSubmit}
            value={input}
          />
          <p className="chat-disclaimer">
            ✦ Renaissance Med Spa · Powered by Groq AI · Clinical advice requires direct consultation.
          </p>
        </div>
      </section>
    </div>
  );
}
