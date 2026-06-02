import { useNavigate } from 'react-router-dom'
import type { Lab, StudyDatabase } from '../types'
import type { SectionKey } from '../types'
import { ProgressBar } from '../components/ProgressBar'
import { PlatformBadge } from '../components/PlatformBadge'
import { SectionCheck } from '../components/SectionCheck'

interface Props {
  db: StudyDatabase
  labProgress: (id: string) => number
  totalProgress: (n: number) => number
  isComplete: (labId: string, section: SectionKey) => boolean
  onToggle: (labId: string, section: SectionKey) => void
  onReset: () => void
}

const KEY_NUMBERS = [
  { label: 'Motor Kss', value: '38.5 rad/s/V', note: 'Lab 3A' },
  { label: 'Motor τ',   value: '0.23 s',        note: 'Lab 3A' },
  { label: 'Motor ω_ss', value: '925 rad/s',     note: 'Lab 3A @ 24V' },
  { label: 'Pendulum ωₙ', value: '6.7 rad/s',   note: 'Lab 5A' },
  { label: 'Pendulum ζ', value: '0.41',          note: 'Lab 5A' },
  { label: 'Pendulum Kss', value: '0.018',       note: 'Lab 5A' },
  { label: 'PI gains (vel)', value: 'Kp=0.19, Ki=0.5', note: 'Lab 3B' },
  { label: 'PID gains (pos)', value: 'Kp=100, KI=350, KD=5.6', note: 'Lab 5B' },
]

const SECTION_LABELS: { key: SectionKey; label: string }[] = [
  { key: 'objectives', label: 'Objectives' },
  { key: 'equations',  label: 'Equations'  },
  { key: 'prelab',     label: 'Pre-lab'    },
  { key: 'matlab',     label: 'MATLAB'     },
  { key: 'python',     label: 'Python'     },
  { key: 'hardware',   label: 'Hardware'   },
  { key: 'tuning',     label: 'Tuning'     },
  { key: 'mistakes',   label: 'Mistakes'   },
  { key: 'exam',       label: 'Exam'       },
]

export function Dashboard({ db, labProgress, totalProgress, isComplete, onToggle, onReset }: Props) {
  const nav = useNavigate()
  const total = totalProgress(db.labs.length)
  const completedLabs = db.labs.filter(l => labProgress(l.lab_id) === 100).length

  return (
    <div>
      {/* Header */}
      <div className="mb-2">
        <h1>{db.course}</h1>
        <p className="mt-1">{db.professor} · {db.institution}</p>
      </div>

      {/* Stats row */}
      <div className="stat-row mt-3 mb-2">
        <div className="stat-box">
          <div className="stat-value">{db.labs.length}</div>
          <div className="stat-label">Labs</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{completedLabs}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{total}%</div>
          <div className="stat-label">Overall progress</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: 'var(--yellow)' }}>4</div>
          <div className="stat-label">Exam stations</div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="card mb-2">
        <div className="flex items-center justify-between mb-1">
          <h3>Study Progress</h3>
          <button className="btn btn-danger text-xs" onClick={onReset} style={{ padding: '0.2rem 0.6rem' }}>
            Reset
          </button>
        </div>
        <ProgressBar pct={total} label={`${total}% of all sections marked complete`} />
      </div>

      {/* Key numbers quick-ref */}
      <div className="card mb-2">
        <h3 className="mb-2">⚡ Key Numbers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
          {KEY_NUMBERS.map(n => (
            <div key={n.label} style={{
              background: 'var(--bg-raised)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              borderLeft: '2px solid var(--accent-dim)',
            }}>
              <div className="text-xs text-muted">{n.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-code)' }}>{n.value}</div>
              <div className="text-xs text-muted">{n.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lab cards */}
      <h2 className="mb-2 mt-3">Labs</h2>
      <div className="card-grid">
        {db.labs.map(lab => (
          <LabCard
            key={lab.lab_id}
            lab={lab}
            pct={labProgress(lab.lab_id)}
            isComplete={isComplete}
            onToggle={onToggle}
            onClick={() => nav(`/labs/${lab.lab_id}`)}
          />
        ))}
      </div>
    </div>
  )
}

interface LabCardProps {
  lab: Lab
  pct: number
  isComplete: (labId: string, section: SectionKey) => boolean
  onToggle: (labId: string, section: SectionKey) => void
  onClick: () => void
}

function LabCard({ lab, pct, isComplete, onToggle, onClick }: LabCardProps) {
  return (
    <div className="card lab-card" onClick={onClick}>
      <div className="lab-card-header">
        <div style={{ flex: 1 }}>
          <div className="lab-number">{lab.lab_id.replace('_', ' ')}</div>
          <div style={{ fontWeight: 600, fontSize: '0.93rem', marginTop: '0.1rem', lineHeight: 1.3 }}>
            {lab.title.replace(/^Lab \w+: /, '')}
          </div>
          <div className="lab-date mt-1">{lab.date}</div>
        </div>
      </div>

      <div className="mb-1">
        <PlatformBadge platform={lab.platform} />
      </div>

      <ProgressBar pct={pct} label={`${pct}% complete`} />

      {/* Section checkboxes — stop propagation so clicking checkbox doesn't navigate */}
      <div
        className="mt-2"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}
        onClick={e => e.stopPropagation()}
      >
        {SECTION_LABELS.map(s => (
          <SectionCheck
            key={s.key}
            labId={lab.lab_id}
            section={s.key}
            label={s.label}
            checked={isComplete(lab.lab_id, s.key)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}
