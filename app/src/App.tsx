import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Dashboard } from './pages/Dashboard'
import { LabBrowser } from './pages/LabBrowser'
import { LabDetail } from './pages/LabDetail'
import { SearchPage } from './pages/SearchPage'
import { ExamTopics } from './pages/ExamTopics'
import { useDatabase } from './data/useDatabase'
import { useProgress } from './hooks/useProgress'

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚙️</div>
        <p style={{ color: 'var(--text-muted)' }}>Loading study database…</p>
      </div>
    </div>
  )
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <div className="callout callout-danger">
        <strong>Failed to load study_database.json</strong>
        <pre style={{ marginTop: '0.5rem', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{message}</pre>
        <p className="mt-2 text-sm">
          Make sure you're serving the app from a local server, not opening index.html directly as a file:// URL.
          Run: <code>python3 -m http.server 8080</code> from the <code>dist/</code> folder.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const dbState = useDatabase()
  const progress = useProgress()

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Nav />
        <main className="main-content">
          {dbState.status === 'loading' && <LoadingScreen />}
          {dbState.status === 'error'   && <ErrorScreen message={dbState.message} />}
          {dbState.status === 'ready'   && (
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    db={dbState.db}
                    labProgress={progress.labProgress}
                    totalProgress={progress.totalProgress}
                    isComplete={progress.isComplete}
                    onToggle={progress.toggle}
                    onReset={progress.resetAll}
                  />
                }
              />
              <Route
                path="/labs"
                element={
                  <LabBrowser
                    db={dbState.db}
                    labProgress={progress.labProgress}
                    isComplete={progress.isComplete}
                  />
                }
              />
              <Route
                path="/labs/:labId"
                element={
                  <LabDetail
                    db={dbState.db}
                    labProgress={progress.labProgress}
                    isComplete={progress.isComplete}
                    onToggle={progress.toggle}
                  />
                }
              />
              <Route path="/search" element={<SearchPage db={dbState.db} />} />
              <Route path="/exam"   element={<ExamTopics />} />
              <Route path="*"       element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  )
}
