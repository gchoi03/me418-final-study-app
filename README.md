# ME 418 Final Exam Study App

A React + Vite + TypeScript study app for **ME 418 — Dynamic Systems and Control** at Cal Poly SLO.

Built from actual lab report PDFs (Labs 1A through 5B). All equations, code patterns, variable names, and tuning values are sourced directly from the reports.

---

## Running Locally

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Other commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Type-check + production build → `app/dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Run TypeScript without emitting |

---

## What's in Phase 1

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Progress overview, key numbers quick-ref, per-lab section checkboxes |
| Lab Browser | `/labs` | All 8 labs with platform badges, progress bars, and objective previews |
| Lab Detail | `/labs/:labId` | Full lab content — equations, code, exercises, mistakes, exam concepts |
| Search | `/search` | Full-text search across all lab content with highlighted results |
| Exam Topics | `/exam` | `final_exam_topics.md` rendered by station type (Pen & Paper, MATLAB, Python, Hardware) |

Progress is saved in `localStorage` and persists across sessions.

---

## Project Structure

```
app/
├── public/
│   ├── study_database.json     # Source of truth — all lab data
│   └── final_exam_topics.md    # Exam topics by station
├── src/
│   ├── components/
│   │   ├── Accordion.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── Nav.tsx
│   │   ├── PlatformBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   └── SectionCheck.tsx
│   ├── data/
│   │   └── useDatabase.ts      # Fetches study_database.json at runtime
│   ├── hooks/
│   │   ├── useProgress.ts      # localStorage progress tracking
│   │   └── useSearch.ts        # Full-text search over the database
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── ExamTopics.tsx
│   │   ├── LabBrowser.tsx
│   │   ├── LabDetail.tsx
│   │   └── SearchPage.tsx
│   ├── types/
│   │   └── index.ts            # TypeScript types for the database schema
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Data Sources

| File | Description |
|------|-------------|
| `study_database.json` | Structured lab data extracted from PDF lab reports. Includes objectives, equations, pre-lab questions, MATLAB exercises, Python coding exercises, hardware procedures, controller tuning methods, common mistakes, and likely exam concepts for all 8 labs. |
| `final_exam_topics.md` | Exam prep organized by station type: Pen & Paper, MATLAB/Simulink, Python/Jupyter, Hardware. Includes code snippets verbatim from the reports. |

Code entries in `study_database.json` are sourced exclusively from text extracted directly from the PDF lab reports. Appendix code blocks that were embedded as image screenshots are flagged with a `source` note rather than invented.

---

## Key Numbers (from the database)

| Parameter | Value | Lab |
|-----------|-------|-----|
| DC Motor Kss | 38.5 rad/s/V | 3A |
| DC Motor τ | 0.23 s | 3A |
| Motor ω_ss | 925 rad/s at 24V | 3A |
| Pendulum ωₙ | 6.7 rad/s | 5A |
| Pendulum ζ | 0.41 | 5A |
| Pendulum Kss | 0.018 | 5A |
| Optimal PI (velocity) | Kp=0.19, Ki=0.5 | 3B |
| Optimal PID (position) | Kp=100, KI=350, KD=5.6 | 5B |

---

## Phase 2 (not yet built)

- Flashcard mode (per lab, per section)
- Quiz mode (multiple choice from `likely_exam_concepts`)
- Coding challenges (fill-in-the-blank from `code_completion_exercises`)
- Final exam simulator (timed, by station type)
