import type { SectionKey } from '../types'

interface Props {
  labId: string
  section: SectionKey
  label: string
  checked: boolean
  onToggle: (labId: string, section: SectionKey) => void
}

export function SectionCheck({ labId, section, label, checked, onToggle }: Props) {
  return (
    <label className={`section-check${checked ? ' done' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(labId, section)}
      />
      <span className="text-xs">{label}</span>
    </label>
  )
}
