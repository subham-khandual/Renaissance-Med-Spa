export default function PromptCard({ onSelect, prompt }) {
  return (
    <button className="prompt-card" onClick={() => onSelect(prompt)}>
      {prompt}
      <span aria-hidden="true">↗</span>
    </button>
  );
}
