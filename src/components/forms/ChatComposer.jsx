export default function ChatComposer({ disabled, onChange, onSubmit, value }) {
  return (
    <form className="chat-composer" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="sayraa-message">
        Message Sayraa
      </label>
      <input
        autoComplete="off"
        id="sayraa-message"
        maxLength={1000}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask Sayraa a question..."
        value={value}
      />
      <button
        aria-label="Send message"
        className="send-button"
        disabled={disabled || !value.trim()}
        type="submit"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="m4 11 15-7-5 16-3.5-6.5L4 11Zm6.5 2.5L19 4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      </button>
    </form>
  );
}
