import { useState } from 'react'
import { useProjects } from './hooks/useDb'

const GENRES = [
  'Action / Adventure', 'Drama', 'Sci-Fi', 'Fantasy', 'Thriller',
  'Comedy', 'Horror', 'Animation', 'Documentary', 'Musical', 'Other',
]

function fmt(n) {
  if (!n) return '—'
  return '$' + Number(n).toLocaleString()
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ── New Project Modal ────────────────────────────────────────────────────────

function NewProjectModal({ onClose, onCreated }) {
  const { addProject } = useProjects()
  const [form, setForm] = useState({
    name: '',
    studio: '',
    genre: GENRES[0],
    budgetLimit: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Project name is required.'); return }
    setSaving(true)
    try {
      const id = await addProject({
        name:        form.name.trim(),
        studio:      form.studio.trim(),
        genre:       form.genre,
        budgetLimit: form.budgetLimit ? Number(form.budgetLimit) : 0,
      })
      onCreated(id)
    } catch (err) {
      setError('Failed to create project. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="ph-overlay" onClick={onClose}>
      <div className="ph-modal" onClick={e => e.stopPropagation()}>
        <div className="ph-modal-header">
          <h2 className="ph-modal-title">New Project</h2>
          <button className="ph-modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="ph-form" onSubmit={handleSubmit}>
          <label className="ph-label">
            Project Name <span className="ph-req">*</span>
            <input
              className="ph-input"
              placeholder="e.g. Project Echoes"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              autoFocus
            />
          </label>

          <label className="ph-label">
            Studio / Production Company
            <input
              className="ph-input"
              placeholder="e.g. Disney / Lucasfilm"
              value={form.studio}
              onChange={e => set('studio', e.target.value)}
            />
          </label>

          <label className="ph-label">
            Genre
            <select
              className="ph-input ph-select"
              value={form.genre}
              onChange={e => set('genre', e.target.value)}
            >
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>
          </label>

          <label className="ph-label">
            Cast Budget
            <div className="ph-budget-wrap">
              <span className="ph-budget-prefix">$</span>
              <input
                className="ph-input ph-input-budget"
                type="number"
                min="0"
                placeholder="70,000,000"
                value={form.budgetLimit}
                onChange={e => set('budgetLimit', e.target.value)}
              />
            </div>
          </label>

          {error && <p className="ph-error">{error}</p>}

          <div className="ph-form-actions">
            <button type="button" className="ph-btn-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="ph-btn-primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create Project →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, onOpen, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="ph-project-card">
      <div className="ph-card-genre">{project.genre}</div>
      <div className="ph-card-name">{project.name}</div>
      {project.studio && <div className="ph-card-studio">{project.studio}</div>}
      <div className="ph-card-meta">
        {project.budgetLimit > 0 && (
          <span className="ph-card-budget">{fmt(project.budgetLimit)}</span>
        )}
        <span className="ph-card-time">{timeAgo(project.createdAt)}</span>
      </div>

      <div className="ph-card-actions">
        <button className="ph-btn-open" onClick={() => onOpen(project.id)}>
          Open →
        </button>
        {confirmDelete ? (
          <div className="ph-delete-confirm">
            <span>Delete?</span>
            <button className="ph-btn-danger" onClick={() => onDelete(project.id)}>Yes</button>
            <button className="ph-btn-ghost-sm" onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        ) : (
          <button className="ph-btn-ghost-sm" onClick={() => setConfirmDelete(true)}>
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

// ── Projects Home ─────────────────────────────────────────────────────────────

export default function ProjectsHome({ onOpenProject }) {
  const { projects, deleteProject } = useProjects()
  const [showModal, setShowModal] = useState(false)

  const handleCreated = (id) => {
    setShowModal(false)
    onOpenProject(id)
  }

  return (
    <div className="ph-root">
      <header className="ph-header">
        <div className="ph-header-left">
          <div className="ph-wordmark">Casting Director</div>
          <div className="ph-tagline">Your projects, your vision.</div>
        </div>
        <button className="ph-btn-new" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </header>

      <main className="ph-main">
        {projects.length === 0 ? (
          <div className="ph-empty">
            <div className="ph-empty-icon">🎬</div>
            <div className="ph-empty-heading">No projects yet</div>
            <div className="ph-empty-sub">Create your first project to get started.</div>
            <button className="ph-btn-primary ph-btn-lg" onClick={() => setShowModal(true)}>
              + New Project
            </button>
          </div>
        ) : (
          <>
            <div className="ph-section-label">
              {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
            </div>
            <div className="ph-grid">
              {projects.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={onOpenProject}
                  onDelete={deleteProject}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
