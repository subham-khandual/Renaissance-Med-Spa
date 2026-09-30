import { useEffect } from "react";
import { faqs } from "../../content/faqs.js";
import { useChat } from "../../hooks/useChat.js";
import PromptCard from "../cards/PromptCard.jsx";
import ChatComposer from "./ChatComposer.jsx";

export default function ChatPanel({ onClose }) {
  const { input, messages, sendMessage, setInput } = useChat();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function handlePromptSelect(prompt) {
    setInput(prompt);
  }

  return (
    <div
      className="chat-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="chat-title"
        aria-modal="true"
        className="chat-panel"
        role="dialog"
      >
        <header className="chat-header">
          <div className="chat-avatar" aria-hidden="true">
            ✦
          </div>
          <div className="chat-heading">
            <h2 id="chat-title">Chat with Sayraa</h2>
            <p><span className="status-dot" /> Renaissance Med Spa concierge</p>
          </div>
          <button
            aria-label="Close chat"
            className="close-chat"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <div aria-live="polite" className="chat-messages">
          {messages.map((message) => (
            <div
              className={`message-row ${message.role}`}
              key={message.id}
            >
              <p className="chat-message">{message.text}</p>
            </div>
          ))}
        </div>

        {messages.length === 1 && (
          <div className="prompt-list">
            <p className="prompt-list-label">Try asking</p>
            {faqs.map((item) => (
              <PromptCard
                key={item.question}
                onSelect={handlePromptSelect}
                prompt={item.question}
              />
            ))}
          </div>
        )}

        <ChatComposer
          disabled={false}
          onChange={setInput}
          onSubmit={handleSubmit}
          value={input}
        />
        <p className="chat-disclaimer">
          Preview mode · Messages are not sent to an AI service.
        </p>
      </section>
    </div>
  );
}
