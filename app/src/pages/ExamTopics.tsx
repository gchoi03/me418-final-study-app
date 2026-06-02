import { useState, useEffect } from 'react'

const STATION_ICONS: Record<string, string> = {
  'Pen and Paper': '📝',
  'MATLAB / Simulink': '💻',
  'Python / Jupyter Notebook': '🐍',
  'Hardware': '🔧',
  'Quick Reference': '⚡',
  'Concept Checklist': '📋',
}

interface Section {
  heading: string
  icon: string
  content: string[]
  codeBlocks: { lang: string; code: string }[]
  tables: string[][]
  subsections: { heading: string; items: string[] }[]
}

function parseMd(md: string): Section[] {
  const lines = md.split('\n')
  const sections: Section[] = []
  let current: Section | null = null
  let currentSub: { heading: string; items: string[] } | null = null
  let inCode = false
  let codeLang = ''
  let codeLines: string[] = []
  let inTable = false
  let tableRows: string[][] = []

  const flush = () => {
    if (inCode && current) {
      current.codeBlocks.push({ lang: codeLang, code: codeLines.join('\n') })
      inCode = false; codeLines = []
    }
    if (inTable && current) {
      current.tables.push(...[tableRows])
      inTable = false; tableRows = []
    }
    if (currentSub && current) { current.subsections.push(currentSub); currentSub = null }
  }

  for (const raw of lines) {
    const line = raw

    if (line.startsWith('```')) {
      if (inCode) { flush() } else { inCode = true; codeLang = line.slice(3).trim(); codeLines = [] }
      continue
    }
    if (inCode) { codeLines.push(line); continue }

    if (line.startsWith('| ')) {
      if (!inTable) inTable = true
      const cells = line.split('|').slice(1, -1).map(c => c.trim())
      if (!cells.every(c => /^[-: ]+$/.test(c))) tableRows.push(cells)
      continue
    } else if (inTable) { flush() }

    if (line.startsWith('## ')) {
      flush()
      if (current) sections.push(current)
      const heading = line.slice(3).trim().replace(/^[📝💻🐍🔧⚡📋]\s*/, '')
      const iconKey = Object.keys(STATION_ICONS).find(k => heading.includes(k.split(':')[0])) ?? ''
      current = {
        heading,
        icon: STATION_ICONS[iconKey] ?? '📖',
        content: [],
        codeBlocks: [],
        tables: [],
        subsections: [],
      }
      continue
    }

    if (line.startsWith('### ')) {
      flush()
      const h = line.slice(4).trim()
      currentSub = { heading: h, items: [] }
      continue
    }

    if (!current) continue

    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('---') || trimmed.startsWith('#')) continue

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const item = trimmed.slice(2)
      if (currentSub) currentSub.items.push(item)
      else current.content.push(item)
    } else if (trimmed.match(/^\d+\./)) {
      const item = trimmed.replace(/^\d+\.\s*/, '')
      if (currentSub) currentSub.items.push(item)
      else current.content.push(item)
    } else if (trimmed) {
      if (currentSub) currentSub.items.push(trimmed)
      else current.content.push(trimmed)
    }
  }
  flush()
  if (current) sections.push(current)
  return sections
}

export function ExamTopics() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<number | null>(null)

  useEffect(() => {
    fetch('./final_exam_topics.md')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then(md => { setSections(parseMd(md)); setLoading(false) })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [])

  if (loading) return <div className="card mt-3"><p>Loading exam topics…</p></div>
  if (error)   return <div className="card mt-3 callout callout-danger">Failed to load: {error}</div>

  return (
    <div>
      <h1 className="mb-1">Final Exam Topics</h1>
      <p className="mb-2">Organized by station type. Click a station to expand.</p>

      {/* Station nav pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {sections.map((s, i) => (
          <button
            key={i}
            className={`btn ${activeSection === i ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveSection(v => v === i ? null : i)}
          >
            {s.icon} {s.heading.split(':')[0].trim()}
          </button>
        ))}
      </div>

      {/* All sections or selected */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sections
          .filter((_, i) => activeSection === null || activeSection === i)
          .map((section, i) => (
            <SectionCard key={i} section={section} />
          ))
        }
      </div>
    </div>
  )
}

function SectionCard({ section }: { section: Section }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="card">
      <button className="accordion-header w-full" onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: '1.1rem' }}>{section.icon}</span>
        <span>{section.heading}</span>
        <span className={`accordion-chevron${open ? ' open' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="accordion-body">
          {/* Top-level bullets */}
          {section.content.length > 0 && (
            <ul className="item-list mb-2">
              {section.content.map((item, i) => (
                <li key={i} className="accent-blue" dangerouslySetInnerHTML={{ __html: fmtInline(item) }} />
              ))}
            </ul>
          )}

          {/* Subsections */}
          {section.subsections.map((sub, si) => (
            <div key={si} className="mt-2">
              <h4 className="mb-1" style={{ color: 'var(--text)', fontSize: '0.92rem' }}>{sub.heading}</h4>
              <ul className="item-list">
                {sub.items.map((item, ii) => (
                  <li key={ii} className="accent-blue" dangerouslySetInnerHTML={{ __html: fmtInline(item) }} />
                ))}
              </ul>
            </div>
          ))}

          {/* Code blocks */}
          {section.codeBlocks.map((cb, ci) => (
            <div key={ci} className="mt-2">
              {cb.lang && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>
                  {cb.lang}
                </span>
              )}
              <pre style={{ margin: 0 }}>{cb.code}</pre>
            </div>
          ))}

          {/* Tables */}
          {section.tables.map((rows, ti) => (
            <div key={ti} className="mt-2" style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>{rows[0]?.map((h, hi) => <th key={hi}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.slice(1).map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci2) => (
                        <td key={ci2} dangerouslySetInnerHTML={{ __html: fmtInline(cell) }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Basic inline markdown: **bold**, `code`
function fmtInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, `<code style="background:rgba(168,216,240,0.12);color:var(--text-code);padding:0.1em 0.3em;border-radius:3px;font-family:var(--font-mono);font-size:0.82em">$1</code>`)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}
