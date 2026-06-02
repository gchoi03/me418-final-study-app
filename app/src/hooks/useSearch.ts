import { useMemo } from 'react'
import type { Lab, SearchResult } from '../types'

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+|[,;:()\[\]{}]/).filter(t => t.length > 1)
}

function score(haystack: string, needles: string[]): number {
  const h = haystack.toLowerCase()
  return needles.reduce((sum, needle) => {
    if (h.includes(needle)) return sum + 1
    return sum
  }, 0)
}

function extractStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(extractStrings)
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(extractStrings)
  }
  return []
}

const SECTION_LABELS: Record<string, string> = {
  objectives: 'Objectives',
  important_equations: 'Equations',
  prelab_questions: 'Pre-lab Questions',
  matlab_simulink_exercises: 'MATLAB/Simulink',
  python_coding_exercises: 'Python Exercises',
  hardware_procedures: 'Hardware Procedures',
  controller_tuning_methods: 'Controller Tuning',
  common_mistakes: 'Common Mistakes',
  likely_exam_concepts: 'Exam Concepts',
  matlab_code_verbatim: 'MATLAB Code',
  code_completion_exercises: 'Code Completion',
  reported_api_calls_verbatim: 'API Calls',
  reported_control_laws_verbatim: 'Control Laws',
}

export function useSearch(labs: Lab[], query: string): SearchResult[] {
  return useMemo(() => {
    const q = query.trim()
    if (q.length < 2) return []
    const needles = tokenize(q)
    if (needles.length === 0) return []

    const results: SearchResult[] = []

    for (const lab of labs) {
      for (const [sectionKey, label] of Object.entries(SECTION_LABELS)) {
        const fieldValue = (lab as Record<string, unknown>)[sectionKey]
        if (!fieldValue) continue
        const strings = extractStrings(fieldValue)
        for (const text of strings) {
          const s = score(text, needles)
          if (s > 0) {
            results.push({ labId: lab.lab_id, labTitle: lab.title, section: label, text, score: s })
          }
        }
      }
    }

    return results
      .sort((a, b) => b.score - a.score || a.labId.localeCompare(b.labId))
      .slice(0, 60)
  }, [labs, query])
}
