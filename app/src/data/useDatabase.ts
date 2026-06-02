import { useState, useEffect } from 'react'
import type { StudyDatabase } from '../types'

type State =
  | { status: 'loading' }
  | { status: 'ready'; db: StudyDatabase }
  | { status: 'error'; message: string }

let cached: StudyDatabase | null = null

export function useDatabase(): State {
  const [state, setState] = useState<State>(
    cached ? { status: 'ready', db: cached } : { status: 'loading' },
  )

  useEffect(() => {
    if (cached) return
    fetch('./study_database.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<StudyDatabase>
      })
      .then(db => {
        cached = db
        setState({ status: 'ready', db })
      })
      .catch(e => setState({ status: 'error', message: String(e) }))
  }, [])

  return state
}
