import { useState, useCallback } from 'react'
import type { ProgressStore, SectionKey } from '../types'

const STORAGE_KEY = 'me418_progress_v1'

function load(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressStore) : {}
  } catch {
    return {}
  }
}

function save(store: ProgressStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // storage full or unavailable — silent fail
  }
}

export function useProgress() {
  const [store, setStore] = useState<ProgressStore>(load)

  const toggle = useCallback((labId: string, section: SectionKey) => {
    setStore(prev => {
      const entry = prev[labId] ?? { labId, completedSections: [] }
      const already = entry.completedSections.includes(section)
      const completedSections = already
        ? entry.completedSections.filter(s => s !== section)
        : [...entry.completedSections, section]
      const next = { ...prev, [labId]: { labId, completedSections } }
      save(next)
      return next
    })
  }, [])

  const isComplete = useCallback(
    (labId: string, section: SectionKey) =>
      store[labId]?.completedSections.includes(section) ?? false,
    [store],
  )

  const labProgress = useCallback(
    (labId: string): number => {
      const done = store[labId]?.completedSections.length ?? 0
      const total = 9 // total sections per lab
      return Math.round((done / total) * 100)
    },
    [store],
  )

  const totalProgress = useCallback(
    (totalLabs: number): number => {
      const allDone = Object.values(store).reduce(
        (sum, e) => sum + e.completedSections.length,
        0,
      )
      const allPossible = totalLabs * 9
      return allPossible > 0 ? Math.round((allDone / allPossible) * 100) : 0
    },
    [store],
  )

  const resetAll = useCallback(() => {
    setStore({})
    save({})
  }, [])

  return { store, toggle, isComplete, labProgress, totalProgress, resetAll }
}
