import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProjects } from '../hooks/useDb'

const GENRES = [
  'Action / Adventure', 'Drama', 'Sci-Fi', 'Fantasy', 'Thriller',
  'Comedy', 'Horror', 'Animation', 'Documentary', 'Musical', 'Other',
]

function fmtBudget(n) {
  if (!n) return null
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── New Project Modal ─────────────────────────────────────────────────────────

function NewProjectModal({ onClose, onCreated }) {
  const { addProject } = useProjects()
  const [form, setForm]   = useState({ name: '', studio: '', genre: GENRES[0], budgetLimit: '' })
  const [error, setError] = useState('')
  const [busy, setBusy]   = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Project name is required.'); return }
    setBusy(true)
    try {
      const id = await addProject({
        name:        form.name.trim(),
        studio:      form.studio.trim(),
        genre:       form.genre,
        budgetLimit: form.budgetLimit ? Number(form.budgetLimit) : 0,
      })
      onCreated(id)
    } catch {
      setError('Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="ph-overlay" onClick={onClose}>
      <div className="ph-modal" onClick={e => e.stopPropagation()}>
        <div className="ph-modal-header">
          <h2 className="ph-modal-title">New Project</h2>
          <button className="ph-modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="ph-form" onSubmit={submit}>
          <label className="ph-label">
            Project Name <span className="ph-req">*</span>
            <input autoFocus className="ph-input" placeholder="e.g. Project Echoes"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </label>
          <label className="ph-label">
            Studio / Production Company
            <input className="ph-input" placeholder="e.g. Disney / Lucasfilm"
              value={form.studio} onChange={e => set('studio', e.target.value)} />
          </label>
          <label className="ph-label">
            Genre
            <select className="ph-input ph-select" value={form.genre} onChange={e => set('genre', e.target.value)}>
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>
          </label>
          <label className="ph-label">
            Cast Budget
            <div className="ph-budget-wrap">
              <span className="ph-budget-prefix">$</span>
              <input className="ph-input ph-input-budget" type="number" min="0"
                placeholder="70000000" value={form.budgetLimit}
                onChange={e => set('budgetLimit', e.target.value)} />
            </div>
          </label>
          {error && <p className="ph-error">{error}</p>}
          <div className="ph-form-actions">
            <button type="button" className="ph-btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
            <button type="submit" className="ph-btn-primary" disabled={busy}>
              {busy ? 'Creating…' : 'Create Project →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({ project, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="ph-project-card">
      <div className="ph-card-genre">{project.genre}</div>
      <div className="ph-card-name">{project.name}</div>
      {project.studio && <div className="ph-card-studio">{project.studio}</div>}
      <div className="ph-card-meta">
        {project.budgetLimit > 0 && <span className="ph-card-budget">{fmtBudget(project.budgetLimit)}</span>}
        <span className="ph-card-time">{timeAgo(project.createdAt)}</span>
      </div>
      <div className="ph-card-actions">
        <Link to={`/projects/${project.id}`} className="ph-btn-open">Open →</Link>
        {confirmDelete ? (
          <div className="ph-delete-confirm">
            <span>Delete?</span>
            <button className="ph-btn-danger" onClick={() => onDelete(project.id)}>Yes</button>
            <button className="ph-btn-ghost-sm" onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        ) : (
          <button className="ph-btn-ghost-sm" onClick={() => setConfirmDelete(true)}>Delete</button>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProjectsList() {
  const navigate = useNavigate()
  const { projects, deleteProject } = useProjects()
  const [showModal, setShowModal] = useState(false)

  const handleCreated = (id) => {
    setShowModal(false)
    navigate(`/projects/${id}`)
  }

  return (
    <div className="ph-root">
      <header className="ph-header">
        <div className="ph-header-left">
          <div className="ph-wordmark">Casting Director</div>
          <div className="ph-tagline">Your projects, your vision.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/echoes" className="ph-btn-ghost-sm">Demo: Project Echoes</Link>
          <button className="ph-btn-new" onClick={() => setShowModal(true)}>+ New Project</button>
        </div>
      </header>

      <main className="ph-main">
        {projects === undefined ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading…</div>
        ) : projects.length === 0 ? (
          <div className="ph-empty">
            <div className="ph-empty-icon">🎬</div>
            <div className="ph-empty-heading">No projects yet</div>
            <div className="ph-empty-sub">Create your first project to start building a cast.</div>
            <button className="ph-btn-primary ph-btn-lg" onClick={() => setShowModal(true)}>+ New Project</button>
          </div>
        ) : (
          <>
            <div className="ph-section-label">
              {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
            </div>
            <div className="ph-grid">
              {projects.map(p => (
                <ProjectCard key={p.id} project={p} onDelete={deleteProject} />
              ))}
            </div>
          </>
        )}
      </main>

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
    </div>
  )
}
