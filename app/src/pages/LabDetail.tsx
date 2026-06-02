import { useParams, useNavigate } from 'react-router-dom'
import type { StudyDatabase, SectionKey, CodeCompletionExercise, PythonExercise } from '../types'
import { Accordion } from '../components/Accordion'
import { CodeBlock } from '../components/CodeBlock'
import { ProgressBar } from '../components/ProgressBar'
import { PlatformBadge } from '../components/PlatformBadge'
import { SectionCheck } from '../components/SectionCheck'

interface Props {
  db: StudyDatabase
  labProgress: (id: string) => number
  isComplete: (labId: string, section: SectionKey) => boolean
  onToggle: (labId: string, section: SectionKey) => void
}

const SECTIONS: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'objectives', label: 'Objectives',        icon: '🎯' },
  { key: 'equations',  label: 'Key Equations',     icon: '📐' },
  { key: 'prelab',     label: 'Pre-lab Questions', icon: '❓' },
  { key: 'matlab',     label: 'MATLAB / Simulink', icon: '📊' },
  { key: 'python',     label: 'Python Coding',     icon: '🐍' },
  { key: 'hardware',   label: 'Hardware',          icon: '🔧' },
  { key: 'tuning',     label: 'Controller Tuning', icon: '🎛️' },
  { key: 'mistakes',   label: 'Common Mistakes',   icon: '⚠️' },
  { key: 'exam',       label: 'Exam Concepts',     icon: '🏆' },
]

export function LabDetail({ db, labProgress, isComplete, onToggle }: Props) {
  const { labId } = useParams<{ labId: string }>()
  const nav = useNavigate()
  const lab = db.labs.find(l => l.lab_id === labId)

  if (!lab) {
    return (
      <div className="card mt-3">
        <p>Lab not found: <code>{labId}</code></p>
        <button className="btn btn-ghost mt-2" onClick={() => nav('/labs')}>← Back to Labs</button>
      </div>
    )
  }

  const pct = labProgress(lab.lab_id)

  return (
    <div>
      {/* Back + header */}
      <button className="btn btn-ghost mb-2" onClick={() => nav('/labs')} style={{ fontSize: '0.85rem' }}>
        ← All Labs
      </button>

      <div className="card mb-2">
        <div className="flex items-center gap-2 mb-1" style={{ flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.05em' }}>
            {lab.lab_id.replace('_', ' ')}
          </span>
          <PlatformBadge platform={lab.platform} />
          <span className="text-xs text-muted" style={{ marginLeft: 'auto' }}>{lab.date}</span>
        </div>
        <h1 style={{ fontSize: '1.35rem' }}>{lab.title}</h1>
        <div className="mt-2">
          <ProgressBar pct={pct} label={`${pct}% of sections marked complete`} />
        </div>

        {/* Section checkboxes */}
        <div className="mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SECTIONS.map(s => (
            <SectionCheck
              key={s.key}
              labId={lab.lab_id}
              section={s.key}
              label={`${s.icon} ${s.label}`}
              checked={isComplete(lab.lab_id, s.key)}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>

      {/* Source note */}
      {lab.appendix_code_note && (
        <div className="callout callout-info mb-2" style={{ fontSize: '0.82rem' }}>
          📎 {lab.appendix_code_note}
        </div>
      )}

      {/* Objectives */}
      {lab.objectives.length > 0 && (
        <div className="card mb-2">
          <Accordion title="Objectives" icon="🎯" defaultOpen>
            <ul className="item-list">
              {lab.objectives.map((o, i) => <li key={i} className="accent-blue">{o}</li>)}
            </ul>
          </Accordion>
        </div>
      )}

      {/* Equations */}
      {lab.important_equations.length > 0 && (
        <div className="card mb-2">
          <Accordion title="Key Equations" icon="📐" defaultOpen>
            <ul className="item-list">
              {lab.important_equations.map((eq, i) => (
                <li key={i} className="accent-blue font-mono" style={{ fontSize: '0.83rem' }}>{eq}</li>
              ))}
            </ul>

            {/* Identified parameters box */}
            {lab.identified_parameters && (
              <div className="mt-2">
                <h4 className="text-xs text-muted mb-1">Identified Parameters</h4>
                <table className="data-table">
                  <tbody>
                    {Object.entries(lab.identified_parameters).map(([k, v]) => (
                      <tr key={k}>
                        <td className="font-mono" style={{ color: 'var(--text-code)' }}>{k}</td>
                        <td className="font-mono">{String(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Identified gains */}
            {lab.identified_gains_verbatim && (
              <div className="mt-2">
                <h4 className="text-xs text-muted mb-1">Gains (verbatim from report)</h4>
                {lab.gain_name_note && (
                  <div className="callout callout-warn mb-1" style={{ fontSize: '0.8rem' }}>
                    {lab.gain_name_note}
                  </div>
                )}
                <table className="data-table">
                  <tbody>
                    {Object.entries(lab.identified_gains_verbatim).map(([k, v]) => (
                      k !== 'source' && (
                        <tr key={k}>
                          <td className="font-mono" style={{ color: 'var(--text-code)' }}>{k}</td>
                          <td className="font-mono">{String(v)}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
                {lab.identified_gains_verbatim.source && (
                  <div className="callout callout-source mt-1" style={{ fontSize: '0.78rem' }}>
                    {String(lab.identified_gains_verbatim.source)}
                  </div>
                )}
              </div>
            )}
          </Accordion>
        </div>
      )}

      {/* Pre-lab questions */}
      {lab.prelab_questions.length > 0 && (
        <div className="card mb-2">
          <Accordion title="Pre-lab Questions" icon="❓">
            <ul className="item-list">
              {lab.prelab_questions.map((q, i) => <li key={i} className="accent-yellow">{q}</li>)}
            </ul>
          </Accordion>
        </div>
      )}

      {/* MATLAB / Simulink */}
      {(lab.matlab_simulink_exercises.length > 0 || (lab.matlab_code_verbatim ?? []).length > 0) && (
        <div className="card mb-2">
          <Accordion title="MATLAB / Simulink" icon="📊">
            {lab.matlab_simulink_exercises.length > 0 && (
              <>
                <h4 className="text-xs text-muted mb-1">Exercises</h4>
                <ul className="item-list mb-2">
                  {lab.matlab_simulink_exercises.map((ex, i) => <li key={i} className="accent-blue">{ex}</li>)}
                </ul>
              </>
            )}
            {(lab.matlab_code_verbatim ?? []).map((entry, i) => (
              <CodeBlock
                key={i}
                code={entry.code}
                label={entry.source}
                source={entry.description}
                note={entry.note}
              />
            ))}
          </Accordion>
        </div>
      )}

      {/* Python */}
      {lab.python_coding_exercises.length > 0 && (
        <div className="card mb-2">
          <Accordion title="Python Coding Exercises" icon="🐍">
            {lab.python_coding_exercises.map((ex, i) => (
              <PythonExerciseCard key={i} ex={ex} />
            ))}
          </Accordion>
        </div>
      )}

      {/* Experimental Results Tables */}
      {(lab.experimental_results_tables ?? []).length > 0 && (
        <div className="card mb-2">
          <Accordion title="Experimental Data Tables" icon="📋">
            {(lab.experimental_results_tables ?? []).map((tbl, i) => (
              <div key={i} className="mt-2">
                <h4 className="text-sm mb-1">{tbl.table}</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        {Object.keys(tbl.data[0] ?? {}).map(k => <th key={k}>{k}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {tbl.data.map((row, ri) => (
                        <tr key={ri}>
                          {Object.values(row).map((v, vi) => (
                            <td key={vi} className="font-mono">{String(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </Accordion>
        </div>
      )}

      {/* Code Completion Exercises */}
      {(lab.code_completion_exercises ?? []).length > 0 && (
        <div className="card mb-2">
          <Accordion title="Code Completion Exercises" icon="✏️">
            {(lab.code_completion_exercises ?? []).map((ex, i) => (
              <CodeCompletionCard key={i} ex={ex} />
            ))}
          </Accordion>
        </div>
      )}

      {/* Hardware */}
      {lab.hardware_procedures.length > 0 && (
        <div className="card mb-2">
          <Accordion title="Hardware Procedures" icon="🔧">
            {lab.reported_api_calls_verbatim && (
              <div className="mb-2">
                <h4 className="text-xs text-muted mb-1">API Calls (verbatim from report)</h4>
                <ul className="item-list">
                  {lab.reported_api_calls_verbatim.map((a, i) => (
                    <li key={i} className="accent-blue font-mono" style={{ fontSize: '0.82rem' }}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            <ul className="item-list">
              {lab.hardware_procedures.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </Accordion>
        </div>
      )}

      {/* Tuning */}
      {lab.controller_tuning_methods.length > 0 && (
        <div className="card mb-2">
          <Accordion title="Controller Tuning" icon="🎛️">
            <ul className="item-list">
              {lab.controller_tuning_methods.map((t, i) => <li key={i} className="accent-green">{t}</li>)}
            </ul>
          </Accordion>
        </div>
      )}

      {/* Common Mistakes */}
      {lab.common_mistakes.length > 0 && (
        <div className="card mb-2">
          <Accordion title="Common Mistakes" icon="⚠️">
            <ul className="item-list">
              {lab.common_mistakes.map((m, i) => <li key={i} className="accent-red">{m}</li>)}
            </ul>
          </Accordion>
        </div>
      )}

      {/* Exam Concepts */}
      {lab.likely_exam_concepts.length > 0 && (
        <div className="card mb-2">
          <Accordion title="Likely Exam Concepts" icon="🏆">
            <ul className="item-list">
              {lab.likely_exam_concepts.map((c, i) => <li key={i} className="accent-yellow">{c}</li>)}
            </ul>
          </Accordion>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="flex justify-between mt-3" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <button className="btn btn-ghost" onClick={() => nav('/labs')}>← All Labs</button>
        {(() => {
          const idx = db.labs.findIndex(l => l.lab_id === lab.lab_id)
          const prev = db.labs[idx - 1]
          const next = db.labs[idx + 1]
          return (
            <div className="flex gap-1">
              {prev && <button className="btn btn-ghost" onClick={() => nav(`/labs/${prev.lab_id}`)}>← {prev.lab_id.replace('_',' ')}</button>}
              {next && <button className="btn btn-primary" onClick={() => nav(`/labs/${next.lab_id}`)}>  {next.lab_id.replace('_',' ')} →</button>}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

function PythonExerciseCard({ ex }: { ex: PythonExercise }) {
  return (
    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
      <h4 style={{ marginBottom: '0.35rem' }}>{ex.title}</h4>
      {ex.source && <div className="callout callout-source mb-1" style={{ fontSize: '0.78rem' }}>Source: {ex.source}</div>}
      {ex.description && <p className="text-sm mb-1">{ex.description}</p>}
      {ex.described_behavior && <p className="text-sm mb-1">{ex.described_behavior}</p>}

      {ex.control_law_verbatim && (
        <CodeBlock code={ex.control_law_verbatim} label="Control law (verbatim from report)" />
      )}

      {ex.methods_from_report && (
        <div className="mt-1">
          <h4 className="text-xs text-muted mb-1">Methods (verbatim from report)</h4>
          <table className="data-table">
            <thead><tr><th>Method</th><th>Description</th></tr></thead>
            <tbody>
              {Object.entries(ex.methods_from_report).map(([m, d]) => (
                <tr key={m}>
                  <td className="font-mono" style={{ color: 'var(--text-code)' }}>{m}</td>
                  <td className="text-sm">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ex.variable_names && (
        <div className="mt-1">
          <h4 className="text-xs text-muted mb-1">Variable names from report</h4>
          <table className="data-table">
            <tbody>
              {Object.entries(ex.variable_names).map(([k, v]) => (
                <tr key={k}>
                  <td className="font-mono" style={{ color: 'var(--text-code)' }}>{k}</td>
                  <td className="text-sm">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ex.note && <div className="callout callout-warn mt-1" style={{ fontSize: '0.8rem' }}>⚠ {ex.note}</div>}
    </div>
  )
}

function CodeCompletionCard({ ex }: { ex: CodeCompletionExercise }) {
  return (
    <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
      <h4 className="mb-1">{ex.title}</h4>
      {ex.instructions && <p className="text-sm mb-1">{ex.instructions}</p>}
      {ex.specification && <p className="text-sm mb-1">{ex.specification}</p>}

      {ex.blanked_code && (
        <CodeBlock code={ex.blanked_code} label="Fill in the blanks" />
      )}

      {ex.skeleton && (
        <CodeBlock code={ex.skeleton} label="Skeleton" />
      )}

      {ex.answers && (
        <details className="mt-2">
          <summary className="btn btn-ghost text-xs" style={{ cursor: 'pointer', listStyle: 'none' }}>
            Show Answers
          </summary>
          <div className="mt-1">
            <table className="data-table">
              <thead><tr><th>Blank</th><th>Answer</th></tr></thead>
              <tbody>
                {Object.entries(ex.answers).map(([k, v]) => (
                  <tr key={k}>
                    <td className="text-sm">{k}</td>
                    <td className="font-mono" style={{ color: 'var(--text-code)' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      {ex.blanks && (
        <div className="mt-2">
          {ex.blanks.map((b, i) => (
            <div key={i} style={{ marginBottom: '0.5rem' }}>
              <div className="text-sm mb-1">{b.prompt}</div>
              <details>
                <summary className="btn btn-ghost text-xs" style={{ cursor: 'pointer', listStyle: 'none' }}>Answer</summary>
                <code style={{ display: 'block', marginTop: '0.25rem', padding: '0.3rem 0.6rem', background: 'var(--bg-raised)', borderRadius: '4px' }}>
                  {b.answer}
                </code>
              </details>
            </div>
          ))}
        </div>
      )}

      {ex.note && <div className="callout callout-warn mt-1" style={{ fontSize: '0.8rem' }}>⚠ {ex.note}</div>}
    </div>
  )
}
