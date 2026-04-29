import { useState } from 'react'
import { useActors } from '../hooks/useDb'

// ── Helpers ───────────────────────────────────────────────────────────────────

const CONFIDENCE_STYLES = {
  high:   { label: 'High',   bg: '#EAF4EE', color: '#2D6A4F' },
  medium: { label: 'Medium', bg: '#FBF6E9', color: '#7A6B3A' },
  low:    { label: 'Low',    bg: '#FEE2E2', color: '#9B2C2C' },
}

const TYPES       = ['Heroic Lead', 'Villain Lead', 'Anti-Hero', 'Supporting', 'Political Authority', 'Voice / Mo-cap', 'Character', 'Comic Relief', 'Other']
const ETHNICITIES = ['White', 'Hispanic/Latino', 'Black/African American', 'Asian', 'Two or more races/Other', 'Middle Eastern/North African', 'Pacific Islander', 'Native American']
const AVAIL       = ['Pinned', 'Checking', 'Unavailable']
const SENTIMENTS  = ['Positive', 'Neutral', 'Negative']
const GENRES      = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Fantasy', 'Romance', 'Animation', 'Documentary', 'Musical', 'Historical']

function ConfidenceBadge({ level }) {
  if (!level) return null
  const s = CONFIDENCE_STYLES[level] ?? CONFIDENCE_STYLES.low
  return (
    <span className="arf-badge" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

function SourceLink({ url, name }) {
  if (!url) return null
  return (
    <a className="arf-source-link" href={url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
      {name ?? 'Source'} ↗
    </a>
  )
}

// ── Research field row ────────────────────────────────────────────────────────

function FieldRow({ label, field = {}, value, onChange, textarea, placeholder }) {
  return (
    <div className="arf-field-row">
      <div className="arf-field-header">
        <span className="arf-field-label">{label}</span>
        <span className="arf-field-meta">
          <ConfidenceBadge level={field.confidence} />
          <SourceLink url={field.source_url} name={field.source_name} />
        </span>
      </div>
      {textarea ? (
        <textarea
          className="pd-input pd-textarea arf-input"
          rows={3}
          placeholder={placeholder ?? '—'}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input
          className="pd-input arf-input"
          placeholder={placeholder ?? '—'}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      )}
      {field.note && <p className="arf-field-note">{field.note}</p>}
    </div>
  )
}

function SelectRow({ label, value, onChange, options }) {
  return (
    <div className="arf-field-row">
      <div className="arf-field-header">
        <span className="arf-field-label">{label}</span>
      </div>
      <select className="pd-input arf-input" value={value ?? ''} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ── Disambiguation panel ──────────────────────────────────────────────────────

function DisambiguationPanel({ candidates, onSelect }) {
  return (
    <div className="arf-section">
      <div className="arf-section-title">Multiple actors found — select the right one</div>
      <p className="arf-section-sub">The name matches more than one person. Pick the correct actor to continue research.</p>
      <div className="arf-candidates">
        {candidates.map((c, i) => (
          <button key={i} className="arf-candidate-btn" onClick={() => onSelect(c.name)}>
            <div className="arf-candidate-name">{c.name}</div>
            {c.primary_credits && <div className="arf-candidate-credits">{c.primary_credits}</div>}
            {c.approximate_age && <div className="arf-candidate-meta">~{c.approximate_age} yrs</div>}
            {c.imdb_url && (
              <a href={c.imdb_url} target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()} className="arf-source-link">
                IMDb ↗
              </a>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Credits table ─────────────────────────────────────────────────────────────

function CreditsTable({ credits }) {
  if (!credits?.length) return <p className="arf-empty-note">No credits found.</p>
  return (
    <div className="arf-table-wrap">
      <table className="arf-table">
        <thead>
          <tr>
            <th>Title</th><th>Year</th><th>Role</th><th>Type</th><th>Source</th>
          </tr>
        </thead>
        <tbody>
          {credits.filter(c => c.title).map((c, i) => (
            <tr key={i}>
              <td>{c.title}</td>
              <td>{c.year ?? '—'}</td>
              <td>{c.role ?? '—'}</td>
              <td>{c.type ?? '—'}</td>
              <td>
                {c.source_url
                  ? <a href={c.source_url} target="_blank" rel="noreferrer" className="arf-source-link">Link ↗</a>
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Awards table ──────────────────────────────────────────────────────────────

function AwardsTable({ awards }) {
  if (!awards?.length) return <p className="arf-empty-note">No major awards found.</p>
  return (
    <div className="arf-table-wrap">
      <table className="arf-table">
        <thead>
          <tr>
            <th>Award</th><th>Category</th><th>Year</th><th>Result</th><th>Source</th>
          </tr>
        </thead>
        <tbody>
          {awards.filter(a => a.award).map((a, i) => (
            <tr key={i}>
              <td>{a.award}</td>
              <td>{a.category ?? '—'}</td>
              <td>{a.year ?? '—'}</td>
              <td>
                <span className={`arf-result-badge arf-result-${(a.result ?? '').toLowerCase()}`}>
                  {a.result ?? '—'}
                </span>
              </td>
              <td>
                {a.source_url
                  ? <a href={a.source_url} target="_blank" rel="noreferrer" className="arf-source-link">Link ↗</a>
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Chip input ────────────────────────────────────────────────────────────────

function ChipInput({ label, items, options, onChange }) {
  const toggle = (item) => {
    const next = items.includes(item) ? items.filter(x => x !== item) : [...items, item]
    onChange(next)
  }
  return (
    <div className="arf-field-row">
      <div className="arf-field-header">
        <span className="arf-field-label">{label}</span>
      </div>
      <div className="arf-chips">
        {options.map(o => (
          <button
            key={o} type="button"
            className={`arf-chip${items.includes(o) ? ' active' : ''}`}
            onClick={() => toggle(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function ActorResearchModal({ projectId, roles, onClose, onSaved }) {
  const { addActor } = useActors(projectId)

  // Step state: 'input' | 'loading' | 'disambiguation' | 'results'
  const [step,    setStep]    = useState('input')
  const [error,   setError]   = useState('')
  const [saving,  setSaving]  = useState(false)

  // Input state
  const [roleName,   setRoleName]   = useState(roles[0]?.name ?? '')
  const [actorInput, setActorInput] = useState('')

  // Research result state (editable)
  const [research, setResearch] = useState(null)
  const [edited,   setEdited]   = useState({})

  // Casting-specific (user fills)
  const [casting, setCasting] = useState({
    type:               '',
    rtScore:            '',
    cost:               '',
    divaRating:         '',
    ethnicity:          '',
    availability:       'Checking',
    availabilityWindow: '',
    tapeNotes:          '',
    currentEvents:      'Positive',
    currentEventsReason:'',
    strengths:          [],
    genreExperience:    [],
  })
  const setC = (k, v) => setCasting(p => ({ ...p, [k]: v }))

  // Edited research value getter/setter
  const val = (path) => {
    if (path in edited) return edited[path]
    // Traverse the research object using dot-notation path
    const parts = path.split('.')
    let obj = research
    for (const p of parts) { if (obj == null) return ''; obj = obj[p] }
    return typeof obj === 'object' ? (obj?.value ?? '') : (obj ?? '')
  }
  const setVal = (path, v) => setEdited(p => ({ ...p, [path]: v }))

  // Get the raw field meta (for confidence/source)
  const meta = (path) => {
    const parts = path.split('.')
    let obj = research
    for (const p of parts) { if (obj == null) return {}; obj = obj[p] }
    return typeof obj === 'object' && !Array.isArray(obj) ? obj : {}
  }

  // ── Research call ─────────────────────────────────────────────────────────

  const handleResearch = async (nameOverride) => {
    const name = nameOverride ?? actorInput.trim()
    if (!name) { setError('Enter an actor name first.'); return }
    setError('')
    setStep('loading')

    try {
      const res = await fetch('/api/research', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ actorName: name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Research failed')

      if (data.disambiguation_needed) {
        setResearch(data)
        setStep('disambiguation')
        return
      }

      setResearch(data)

      // Pre-fill casting fields from research
      const rep = data.representation
      const agency =
        rep?.theatrical_agent?.company ??
        rep?.manager?.company ??
        rep?.commercial_agent?.company ?? ''

      setCasting(p => ({
        ...p,
        type: '',
        agency,
        genreExperience: deriveGenres(data.credits ?? []),
      }))

      setStep('results')
    } catch (err) {
      setError(err.message)
      setStep('input')
    }
  }

  function deriveGenres(credits) {
    const typeMap = { film: 'Action', tv: 'Drama', stage: 'Drama', commercial: 'Comedy' }
    return [...new Set(credits.map(c => typeMap[c.type?.toLowerCase()] ?? 'Drama'))]
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!roleName) { setError('Select a role.'); return }
    if (!actorInput.trim()) { setError('Actor name is required.'); return }
    setSaving(true)
    try {
      const rep    = research?.representation ?? {}
      const agency = val('representation.theatrical_agent.company')
        || rep?.manager?.company || casting.agency || ''

      const articles = (research?.credits ?? [])
        .filter(c => c.source_url && c.title)
        .slice(0, 3)
        .map(c => ({
          headline:    `${c.role ? `${c.role} in ` : ''}${c.title}${c.year ? ` (${c.year})` : ''}`,
          publication: 'IMDb',
          url:         c.source_url,
        }))

      await addActor({
        roleName:            roleName,
        name:                val('full_name') || actorInput.trim(),
        rtScore:             Number(casting.rtScore) || 0,
        cost:                Number(casting.cost)    || 0,
        divaRating:          Number(casting.divaRating) || 1,
        ethnicity:           casting.ethnicity,
        currentEvents:       casting.currentEvents,
        currentEventsReason: casting.currentEventsReason,
        tapeNotes:           casting.tapeNotes,
        type:                casting.type,
        agency,
        availability:        casting.availability,
        availabilityWindow:  casting.availabilityWindow,
        strengths:           casting.strengths,
        genreExperience:     casting.genreExperience,
        articles,
      })

      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="ph-overlay arf-overlay" onClick={onClose}>
      <div className="arf-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="arf-header">
          <div>
            <div className="arf-header-title">Add Actor</div>
            {step === 'results' && research && (
              <div className="arf-header-sub">
                Review and edit research results before saving
              </div>
            )}
          </div>
          <button className="ph-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="arf-body">

          {/* ── Step 1: Input ── */}
          <div className="arf-section">
            <div className="arf-section-title">
              {step === 'results' ? 'Actor' : 'Search'}
            </div>
            <div className="arf-input-row">
              <div className="arf-field-row" style={{ flex: 1 }}>
                <label className="pd-label">
                  Role
                  <select
                    className="pd-input"
                    value={roleName}
                    onChange={e => setRoleName(e.target.value)}
                    disabled={step === 'loading'}
                  >
                    {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                  </select>
                </label>
              </div>
              <div className="arf-field-row" style={{ flex: 2 }}>
                <label className="pd-label">
                  Actor Name
                  <input
                    className="pd-input"
                    placeholder="e.g. Cate Blanchett"
                    value={actorInput}
                    onChange={e => setActorInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && step !== 'loading' && handleResearch()}
                    disabled={step === 'loading'}
                  />
                </label>
              </div>
              <button
                className="ph-btn-primary arf-research-btn"
                onClick={() => handleResearch()}
                disabled={step === 'loading' || !actorInput.trim()}
              >
                {step === 'loading' ? 'Researching…' : 'Research'}
              </button>
            </div>
          </div>

          {/* ── Loading ── */}
          {step === 'loading' && (
            <div className="arf-loading">
              <div className="arf-spinner" />
              <div className="arf-loading-text">
                Searching web sources for <strong>{actorInput}</strong>…
              </div>
              <div className="arf-loading-sub">
                This may take 20–40 seconds while the API verifies sources.
              </div>
            </div>
          )}

          {/* ── Disambiguation ── */}
          {step === 'disambiguation' && research?.candidates && (
            <DisambiguationPanel
              candidates={research.candidates}
              onSelect={(name) => { setActorInput(name); handleResearch(name) }}
            />
          )}

          {/* ── Results ── */}
          {step === 'results' && research && (<>

            {/* Identity */}
            <div className="arf-section">
              <div className="arf-section-title">Identity</div>
              <div className="arf-grid-2">
                <FieldRow label="Full Name"      field={meta('full_name')}     value={val('full_name')}     onChange={v => setVal('full_name', v)} />
                <FieldRow label="Date of Birth"  field={meta('date_of_birth')} value={val('date_of_birth')} onChange={v => setVal('date_of_birth', v)} placeholder="YYYY-MM-DD or YYYY" />
                <FieldRow label="Height"         field={meta('height')}        value={val('height')}        onChange={v => setVal('height', v)} placeholder="e.g. 5′7″" />
                <FieldRow label="Union Status"   field={meta('union_status')}  value={val('union_status')}  onChange={v => setVal('union_status', v)} placeholder="e.g. SAG-AFTRA" />
              </div>
            </div>

            {/* Physical */}
            <div className="arf-section">
              <div className="arf-section-title">Physical Profile</div>
              <div className="arf-grid-2">
                <FieldRow label="Hair Color" field={meta('physical_description.hair_color')} value={val('physical_description.hair_color')} onChange={v => setVal('physical_description.hair_color', v)} />
                <FieldRow label="Eye Color"  field={meta('physical_description.eye_color')}  value={val('physical_description.eye_color')}  onChange={v => setVal('physical_description.eye_color', v)} />
              </div>
            </div>

            {/* Skills */}
            <div className="arf-section">
              <div className="arf-section-title">Skills & Training</div>
              <div className="arf-grid-2">
                <FieldRow label="Accents / Languages" field={meta('accents_languages')} value={val('accents_languages')} onChange={v => setVal('accents_languages', v)} placeholder="e.g. RP British, Southern US" />
                <FieldRow label="Training"            field={meta('training')}           value={val('training')}           onChange={v => setVal('training', v)} placeholder="e.g. RADA, Juilliard" />
              </div>
            </div>

            {/* Representation */}
            <div className="arf-section">
              <div className="arf-section-title">Representation</div>
              <div className="arf-grid-2">
                {[
                  ['Theatrical Agent', 'representation.theatrical_agent'],
                  ['Manager',          'representation.manager'],
                  ['Commercial Agent', 'representation.commercial_agent'],
                  ['Publicist',        'representation.publicist'],
                  ['Attorney',         'representation.attorney'],
                ].map(([label, path]) => {
                  const f = meta(path)
                  return (
                    <div key={path} className="arf-rep-block">
                      <div className="arf-field-header">
                        <span className="arf-field-label">{label}</span>
                        <span className="arf-field-meta">
                          <ConfidenceBadge level={f.confidence} />
                          <SourceLink url={f.source_url} name={f.source_name} />
                        </span>
                      </div>
                      <input className="pd-input arf-input" placeholder="Company" value={val(`${path}.company`)} onChange={e => setVal(`${path}.company`, e.target.value)} />
                      <input className="pd-input arf-input" placeholder="Agent / Contact name" value={val(`${path}.agent_name`)} onChange={e => setVal(`${path}.agent_name`, e.target.value)} style={{ marginTop: 6 }} />
                      {f.note && <p className="arf-field-note">{f.note}</p>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Credits */}
            <div className="arf-section">
              <div className="arf-section-title">Credits</div>
              <CreditsTable credits={research.credits} />
            </div>

            {/* Awards */}
            <div className="arf-section">
              <div className="arf-section-title">Awards</div>
              <AwardsTable awards={research.awards} />
            </div>

            {/* Casting Details */}
            <div className="arf-section arf-section--casting">
              <div className="arf-section-title">Casting Details</div>
              <p className="arf-section-sub">These fields are not researchable — fill them based on your professional assessment.</p>
              <div className="arf-grid-2">
                <SelectRow label="Type"         value={casting.type}       onChange={v => setC('type', v)}       options={TYPES} />
                <SelectRow label="Ethnicity"    value={casting.ethnicity}  onChange={v => setC('ethnicity', v)}  options={ETHNICITIES} />
                <FieldRow  label="RT Score (0–100)" value={casting.rtScore}    onChange={v => setC('rtScore', v)}    placeholder="e.g. 88" />
                <FieldRow  label="Cost ($)"         value={casting.cost}       onChange={v => setC('cost', v)}       placeholder="e.g. 8000000" />
                <FieldRow  label="Diva Rating (1–10)" value={casting.divaRating} onChange={v => setC('divaRating', v)} placeholder="1 = no-fuss, 10 = difficult" />
                <SelectRow label="Availability" value={casting.availability} onChange={v => setC('availability', v)} options={AVAIL} />
                <FieldRow  label="Availability Window" value={casting.availabilityWindow} onChange={v => setC('availabilityWindow', v)} placeholder="e.g. April – October 2026" />
                <SelectRow label="Current Events" value={casting.currentEvents} onChange={v => setC('currentEvents', v)} options={SENTIMENTS} />
              </div>
              <FieldRow label="Current Events Reason" value={casting.currentEventsReason} onChange={v => setC('currentEventsReason', v)} textarea placeholder="Brief explanation of public sentiment…" />
              <FieldRow label="Tape Notes" value={casting.tapeNotes} onChange={v => setC('tapeNotes', v)} textarea placeholder="Your casting director notes on this actor…" />
              <ChipInput label="Strengths"        items={casting.strengths}       options={['Physicality', 'Emotional Depth', 'Comic Timing', 'Intensity', 'Voice', 'Charisma', 'Versatility', 'Sincerity', 'Screen Authority', 'Naturalism']} onChange={v => setC('strengths', v)} />
              <ChipInput label="Genre Experience" items={casting.genreExperience} options={GENRES} onChange={v => setC('genreExperience', v)} />
            </div>

          </>)}

          {error && <div className="arf-error">{error}</div>}
        </div>

        {/* Footer */}
        {step === 'results' && (
          <div className="arf-footer">
            <button className="ph-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="ph-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Actor →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
