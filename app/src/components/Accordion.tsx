import { useState, type ReactNode } from 'react'

interface Props {
  title: string
  icon?: string
  children: ReactNode
  defaultOpen?: boolean
  headerRight?: ReactNode
}

export function Accordion({ title, icon, children, defaultOpen = false, headerRight }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button className="accordion-header w-full" onClick={() => setOpen(o => !o)}>
        {icon && <span>{icon}</span>}
        <span>{title}</span>
        {headerRight && <span style={{ marginLeft: '0.5rem' }}>{headerRight}</span>}
        <span className={`accordion-chevron${open ? ' open' : ''}`}>▼</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  )
}
