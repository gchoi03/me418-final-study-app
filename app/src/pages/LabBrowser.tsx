import { useNavigate } from 'react-router-dom'
import type { Lab, StudyDatabase, SectionKey } from '../types'
import { ProgressBar } from '../components/ProgressBar'
import { PlatformBadge } from '../components/PlatformBadge'

interface Props {
  db: StudyDatabase
  labProgress: (id: string) => number
  isComplete: (labId: string, section: SectionKey) => boolean
}

export function LabBrowser({ db, labProgress }: Props) {
  const nav = useNavigate()

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1>All Labs</h1>
        <span className="text-muted text-sm">{db.labs.length} labs</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {db.labs.map(lab => (
          <LabRow
            key={lab.lab_id}
            lab={lab}
            pct={labProgress(lab.lab_id)}
            onClick={() => nav(`/labs/${lab.lab_id}`)}
          />
        ))}
      </div>
    </div>
  )
}

interface RowProps { lab: Lab; pct: number; onClick: () => void }

function LabRow({ lab, pct, onClick }: RowProps) {
  const equationCount = lab.important_equations.length
  const exerciseCount = (lab.matlab_simulink_exercises?.length ?? 0) + (lab.python_coding_exercises?.length ?? 0)
  const examCount     = lab.likely_exam_concepts.length

  return (
    <div className="card lab-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.05em' }}>
              {lab.lab_id.replace('_', ' ')}
            </span>
            <PlatformBadge platform={lab.platform} />
          </div>
          <h3 style={{ marginTop: '0.25rem', fontSize: '0.95rem' }}>{lab.title.replace(/^Lab \w+: /, '')}</h3>
          <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>{lab.date}</p>
        </div>

        {/* pill stats */}
        <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
          {equationCount > 0 && <Pill label={`${equationCount} eqns`} color="var(--accent)" />}
          {exerciseCount > 0 && <Pill label={`${exerciseCount} exs`}  color="var(--green)" />}
          {examCount > 0     && <Pill label={`${examCount} exam`}     color="var(--yellow)" />}
        </div>
      </div>

      <div className="mt-2">
        <ProgressBar pct={pct} label={`${pct}% studied`} />
      </div>

      {/* first two objectives as preview */}
      <ul className="item-list mt-2" style={{ gap: '0.25rem' }}>
        {lab.objectives.slice(0, 2).map((o, i) => (
          <li key={i} className="accent-blue" style={{ fontSize: '0.8rem' }}>{o}</li>
        ))}
      </ul>

      <div className="mt-2 text-xs" style={{ color: 'var(--accent)' }}>
        View full detail →
      </div>
    </div>
  )
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: '0.15rem 0.5rem',
      borderRadius: '999px',
      fontSize: '0.72rem',
      fontWeight: 600,
      background: `${color}22`,
      color,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}
