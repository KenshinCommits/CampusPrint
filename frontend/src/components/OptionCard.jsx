export function OptionCard({ title, sub, selected, onClick, tone = '' }) {
  return (
    <button
      type="button"
      className={`option-card ${selected ? `selected ${tone}` : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="option-title">{title}</span>
      {sub && <span className="option-sub">{sub}</span>}
    </button>
  );
}
