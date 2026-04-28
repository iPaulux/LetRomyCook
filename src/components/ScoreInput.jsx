function scoreColor(v) {
  if (v === null || v === undefined) return 'var(--text-muted)'
  if (v <= 9)  return '#c04060'
  if (v <= 12) return 'var(--brown)'
  if (v <= 16) return 'var(--blue)'
  return 'var(--pink)'
}

export function ScoreBadge({ value, size = 'md' }) {
  const label = value != null ? `${value}/20` : '–/20'
  return (
    <span className={`score-badge score-badge--${size}`} style={{ color: scoreColor(value) }}>
      {label}
    </span>
  )
}

export default function ScoreInput({ value, onChange }) {
  const display = value ?? 0
  const color   = scoreColor(display)

  return (
    <div className="score-input">
      <div className="score-display" style={{ color }}>
        <span className="score-number">{display}</span>
        <span className="score-denom">/20</span>
      </div>
      <div className="score-controls">
        <button
          type="button"
          className="score-btn"
          onClick={() => onChange(Math.max(0, display - 1))}
          disabled={display <= 0}
        >−</button>
        <input
          type="range"
          min={0} max={20} step={1}
          value={display}
          onChange={e => onChange(Number(e.target.value))}
          className="score-slider"
          style={{ '--pct': `${(display / 20) * 100}%`, '--clr': color }}
        />
        <button
          type="button"
          className="score-btn"
          onClick={() => onChange(Math.min(20, display + 1))}
          disabled={display >= 20}
        >+</button>
      </div>
    </div>
  )
}
