import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProject, useRoles, useActors } from '../hooks/useDb'

const ACCENT_OPTIONS = [
  { label: 'Blue',  value: 'blue',  hex: '#3B5BDB' },
  { label: 'Red',   value: 'red',   hex: '#C92A2A' },
  { label: 'Gold',  value: 'yellow', hex: '#E67700' },
  { label: 'Navy',  value: 'navy',  hex: '#1A2B4A' },
  { label: 'Teal',  value: 'teal',  hex: '#0B7285' },
  { label: 'Rose',  value: 'rose',  hex: '#A61E4D' },
]

function fmtBudget(n) {
  if (!n) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

// ── Role Form ─────────────────────────────────────────────────────────────────

const EMPTY = { name: '', subtitle: '', bio: '', isLocked: false, shadow: false, accentColor: 'blue' }

function RoleForm({ projectId, onSaved, onCancel }) {
  const { addRole } = useRoles(projectId)
  const [form, setForm]   = useState(EMPTY)
  const [error, setError] = useState('')
  const [busy, setBusy]   = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Role name is required.'); return }
    setBusy(true)
    try {
      await addRole({ name: form.name.trim(), subtitle: form.subtitle.trim(),
        bio: form.bio.trim(), isLocked: form.isLocked, shadow: form.shadow,
        accentColor: form.accentColor })
      setForm(EMPTY)
      setError('')
      onSaved()
    } catch {
      setError('Failed to save role.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="pd-role-form" onSubmit={submit}>
      <div className="pd-form-title">New Role</div>

      {/* Name + Subtitle */}
      <div className="pd-form-row">
        <label className="pd-label">
          Role Name <span className="pd-req">*</span>
          <input autoFocus className="pd-input" placeholder="e.g. Rey Skywalker"
            value={form.name} onChange={e => set('name', e.target.value)} />
        </label>
        <label className="pd-label">
          Subtitle
          <input className="pd-input" placeholder="e.g. The Anchor"
            value={form.subtitle} onChange={e => set('subtitle', e.target.value)} />
        </label>
      </div>

      {/* Bio */}
      <label className="pd-label">
        Role Bio
        <textarea className="pd-input pd-textarea"
          placeholder="Describe who this character is and what they bring to the story…"
          value={form.bio} onChange={e => set('bio', e.target.value)} />
      </label>

      {/* Accent colour */}
      <div className="pd-label">
        Accent Color
        <div className="pd-swatches">
          {ACCENT_OPTIONS.map(opt => (
            <button key={opt.value} type="button"
              className={`pd-swatch-btn${form.accentColor === opt.value ? ' active' : ''}`}
              onClick={() => set('accentColor', opt.value)}
            >
              <span className="pd-swatch-dot" style={{ background: opt.hex }} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="pd-toggles">
        <div className="pd-toggle-row" onClick={() => set('shadow', !form.shadow)}>
          <button type="button" className={`pd-toggle-track${form.shadow ? ' on' : ''}`}>
            <span className="pd-toggle-thumb" />
          </button>
          <div>
            <div className="pd-toggle-text-name">Shadow Character</div>
            <div className="pd-toggle-text-sub">Hidden from public casting calls</div>
          </div>
        </div>
        <div className="pd-toggle-row" onClick={() => set('isLocked', !form.isLocked)}>
          <button type="button" className={`pd-toggle-track${form.isLocked ? ' on' : ''}`}>
            <span className="pd-toggle-thumb" />
          </button>
          <div>
            <div className="pd-toggle-text-name">Lock Role</div>
            <div className="pd-toggle-text-sub">Actor assignment is fixed</div>
          </div>
        </div>
      </div>

      {error && <p className="ph-error">{error}</p>}

      <div className="pd-form-actions">
        <button type="button" className="ph-btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="submit" className="ph-btn-primary" disabled={busy}>
          {busy ? 'Saving…' : 'Add Role →'}
        </button>
      </div>
    </form>
  )
}

// ── Role Card ─────────────────────────────────────────────────────────────────

function RoleCard({ role, actorCount, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const accent = ACCENT_OPTIONS.find(o => o.value === role.accentColor)
  const hex    = accent?.hex ?? '#9E9993'

  return (
    <div className="pd-role-card">
      <div className="pd-role-card-top">
        <div className="pd-role-accent-bar" style={{ background: hex }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pd-role-name">
            {role.name}
            {role.isLocked && <span className="pd-role-badge pd-role-badge--locked">Locked</span>}
            {role.shadow   && <span className="pd-role-badge pd-role-badge--shadow">Shadow</span>}
          </div>
          {role.subtitle && <div className="pd-role-subtitle">{role.subtitle}</div>}
        </div>
      </div>

      {role.bio && <p className="pd-role-bio">{role.bio}</p>}

      <div className="pd-role-footer">
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>
            <span className="pd-role-color-dot" style={{ background: hex }} />
            <span className="pd-role-color-label">{role.accentColor}</span>
          </span>
          {actorCount > 0 && (
            <span className="pd-role-color-label">{actorCount} candidate{actorCount !== 1 ? 's' : ''}</span>
          )}
        </span>
        {confirmDelete ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Delete?</span>
            <button className="ph-btn-danger" onClick={() => onDelete(role.id)}>Yes</button>
            <button className="ph-btn-ghost-sm" onClick={() => setConfirmDelete(false)}>No</button>
          </span>
        ) : (
          <button className="ph-btn-ghost-sm" onClick={() => setConfirmDelete(true)}>Delete</button>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProjectDetail() {
  const { id }      = useParams()
  const projectId   = Number(id)
  const { project } = useProject(projectId)
  const { roles, deleteRole } = useRoles(projectId)
  const { actors }  = useActors(projectId)
  const [showForm, setShowForm] = useState(false)

  const actorCountByRole = actors.reduce((acc, a) => {
    acc[a.roleName] = (acc[a.roleName] ?? 0) + 1
    return acc
  }, {})

  if (project === undefined) {
    return (
      <div className="pd-not-found">
        <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
      </div>
    )
  }

  if (project === null) {
    return (
      <div className="pd-not-found">
        <p>Project not found.</p>
        <Link to="/projects">← Back to Projects</Link>
      </div>
    )
  }

  return (
    <div className="pd-root">
      {/* Top bar */}
      <header className="pd-topbar">
        <Link to="/projects" className="pd-back">← All Projects</Link>
        <div className="pd-divider" />
        <h1 className="pd-topbar-title">{project.name}</h1>
      </header>

      <main className="pd-main">
        {/* Project meta */}
        <section className="pd-meta-card">
          <div className="pd-meta-eyebrow">Project Details</div>
          <div className="pd-meta-grid">
            <div>
              <div className="pd-meta-item-label">Studio</div>
              <div className="pd-meta-item-value">{project.studio || '—'}</div>
            </div>
            <div>
              <div className="pd-meta-item-label">Genre</div>
              <div className="pd-meta-item-value">{project.genre || '—'}</div>
            </div>
            <div>
              <div className="pd-meta-item-label">Cast Budget</div>
              <div className="pd-meta-item-value">{fmtBudget(project.budgetLimit)}</div>
            </div>
            <div>
              <div className="pd-meta-item-label">Created</div>
              <div className="pd-meta-item-value">
                {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section>
          <div className="pd-section-header">
            <div>
              <div className="pd-section-title">Roles</div>
              <div className="pd-section-sub">
                {roles.length === 0 ? 'No roles added yet.' : `${roles.length} role${roles.length === 1 ? '' : 's'}`}
              </div>
            </div>
            {!showForm && (
              <button className="ph-btn-primary" onClick={() => setShowForm(true)}>+ Add Role</button>
            )}
          </div>

          {showForm && (
            <div style={{ marginBottom: 16 }}>
              <RoleForm projectId={projectId} onSaved={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
            </div>
          )}

          {roles.length > 0 ? (
            <div className="pd-roles-grid">
              {roles.map(r => <RoleCard key={r.id} role={r} actorCount={actorCountByRole[r.name] ?? 0} onDelete={deleteRole} />)}
            </div>
          ) : !showForm && (
            <div className="pd-roles-empty">
              <div className="pd-roles-empty-icon">🎭</div>
              <div className="pd-roles-empty-text">Add your first role to start building the cast.</div>
              <button className="ph-btn-ghost" onClick={() => setShowForm(true)}>+ Add Role</button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
