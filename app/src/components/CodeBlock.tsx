import { useState } from 'react'

interface Props {
  code: string
  label?: string
  source?: string
  note?: string
}

export function CodeBlock({ code, label, source, note }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div style={{ marginTop: '0.75rem' }}>
      {(label || source) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-xs text-muted font-mono">{label}</span>}
          <button className="btn btn-ghost text-xs" onClick={copy} style={{ padding: '0.15rem 0.5rem' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre>{code}</pre>
      {source && <div className="callout callout-source mt-1">Source: {source}</div>}
      {note && <div className="callout callout-warn mt-1">⚠ {note}</div>}
    </div>
  )
}
