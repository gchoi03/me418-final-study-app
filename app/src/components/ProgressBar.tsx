interface Props { pct: number; label?: string }

export function ProgressBar({ pct, label }: Props) {
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${clamped}%` }} />
      </div>
      {label !== undefined && (
        <div className="progress-label mt-1">{label}</div>
      )}
    </div>
  )
}
