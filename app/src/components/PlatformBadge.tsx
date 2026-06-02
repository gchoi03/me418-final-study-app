interface Props { platform: string }

export function PlatformBadge({ platform }: Props) {
  const p = platform.toLowerCase()
  let cls = 'badge badge-mixed'
  let icon = '⚙️'
  if (p.includes('simulink') || p.includes('matlab')) { cls = 'badge badge-matlab'; icon = '📊' }
  else if (p.includes('python') && !p.includes('stm')) { cls = 'badge badge-python'; icon = '🐍' }
  else if (p.includes('stm') || p.includes('hardware')) { cls = 'badge badge-hw'; icon = '🔧' }
  // mixed hardware+python
  if ((p.includes('stm') || p.includes('hardware')) && p.includes('python')) {
    cls = 'badge badge-mixed'; icon = '🔧'
  }
  const short = platform.split('+')[0].trim()
  return <span className={cls}>{icon} {short}</span>
}
