import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { StudyDatabase } from '../types'
import { useSearch } from '../hooks/useSearch'

interface Props { db: StudyDatabase }

function highlight(text: string, query: string): string {
  if (!query.trim() || text.length > 300) return text.length > 200 ? text.slice(0, 200) + '…' : text
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const words = escaped.split(/\s+/).filter(Boolean)
  let out = text.length > 300 ? text.slice(0, 300) + '…' : text
  for (const w of words) {
    out = out.replace(new RegExp(`(${w})`, 'gi'), '**$1**')
  }
  return out
}

function renderHighlight(text: string): JSX.Element {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <mark key={i} style={{ background: 'rgba(245,200,66,0.3)', color: 'var(--yellow)', borderRadius: '2px', padding: '0 2px' }}>{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

export function SearchPage({ db }: Props) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const results = useSearch(db.labs, query)

  // Group results by lab
  const grouped = results.reduce<Record<string, typeof results>>((acc, r) => {
    if (!acc[r.labId]) acc[r.labId] = []
    acc[r.labId].push(r)
    return acc
  }, {})

  return (
    <div>
      <h1 className="mb-2">Search</h1>

      <div className="mb-2">
        <input
          className="search-input"
          type="search"
          placeholder="Search equations, concepts, code, procedures…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {query.trim().length > 0 && query.trim().length < 2 && (
        <p className="text-muted text-sm">Type at least 2 characters…</p>
      )}

      {query.trim().length >= 2 && results.length === 0 && (
        <div className="card">
          <p>No results for <strong>{query}</strong></p>
          <p className="text-sm mt-1">Try: <code>transfer function</code>, <code>utime</code>, <code>PI controller</code>, <code>bode</code></p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mb-1 text-sm text-muted">{results.length} result{results.length !== 1 ? 's' : ''}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {Object.entries(grouped).map(([labId, hits]) => {
          const lab = db.labs.find(l => l.lab_id === labId)
          if (!lab) return null
          return (
            <div key={labId} className="card">
              <button
                className="flex items-center gap-2 mb-2 w-full"
                style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                onClick={() => navigate(`/labs/${labId}`)}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)' }}>
                  {labId.replace('_', ' ')}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                  {lab.title.replace(/^Lab \w+: /, '')}
                </span>
                <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '0.8rem' }}>
                  {hits.length} hit{hits.length !== 1 ? 's' : ''} →
                </span>
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {hits.slice(0, 6).map((r, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-raised)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.45rem 0.75rem',
                    borderLeft: '2px solid var(--accent-dim)',
                  }}>
                    <div className="text-xs text-muted mb-1">{r.section}</div>
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {renderHighlight(highlight(r.text, query))}
                    </div>
                  </div>
                ))}
                {hits.length > 6 && (
                  <button
                    className="btn btn-ghost text-xs"
                    onClick={() => navigate(`/labs/${labId}`)}
                  >
                    +{hits.length - 6} more — view full lab
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick-search chips */}
      {!query && (
        <div>
          <p className="text-muted text-sm mb-2">Try searching for:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['transfer function', 'utime', 'PI controller', 'bode', 'trapz_profile', 'steady-state error', 'settling time', 'encoder', 'Kp', 'root locus', 'saturation', 'overshoot'].map(chip => (
              <button
                key={chip}
                className="btn btn-ghost text-xs"
                onClick={() => setQuery(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
