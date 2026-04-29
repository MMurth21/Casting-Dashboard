import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import castingData from './data/actors'
import './App.css'
import ChemistryOverlay from './components/ChemistryOverlay'
import { calculateEnsembleChemistry } from './lib/chemistry.js'

// ── Helpers ──────────────────────────────────────────────
const fmt = (n) => `$${(n / 1_000_000).toFixed(0)}M`

function rtColorClass(score) {
  if (score >= 90) return 'rt-green'
  if (score >= 80) return 'rt-yellow'
  return 'rt-red'
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('')
}

function divaLevel(rating) {
  if (rating <= 3) return 1
  if (rating <= 6) return 2
  return 3
}

function availClass(avail) {
  if (!avail) return ''
  const v = avail.toLowerCase()
  if (v === 'pinned')      return 'avail-pinned'
  if (v === 'checking')    return 'avail-checking'
  if (v === 'unavailable') return 'avail-unavail'
  return ''
}

// ── Cost Cap Bar ──────────────────────────────────────────
function CostCapBar({ currentTotal, budgetLimit, isDark }) {
  const pct = Math.min((currentTotal / budgetLimit) * 100, 100)
  const isOver = currentTotal > budgetLimit
  const isWarn = !isOver && pct > 75

  return (
    <div className="cost-cap">
      <div className="cost-cap-header">
        <span className="cost-label">Cost Cap</span>
        <span className={`cost-total ${isOver ? 'over' : ''}`}>
          {fmt(currentTotal)}
          <span className="cost-divider"> / </span>
          {fmt(budgetLimit)}
        </span>
      </div>
      <div className="cost-bar-row">
        {isDark && (
          <img
            src={import.meta.env.BASE_URL + 'saber-hilt.png'}
            className="saber-hilt-img"
            alt=""
            draggable={false}
          />
        )}
        <div className="cost-bar-track">
          <div
            className={`cost-bar-fill ${isOver ? 'over' : isWarn ? 'warning' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Actor Card ────────────────────────────────────────────
function ActorCard({ actor, isBeingDragged, isAssigned, onDragStart, onDragEnd, onSelect }) {
  if (isBeingDragged) {
    return <div className="actor-card ghost" aria-hidden="true" />
  }

  return (
    <div
      className={`actor-card${isAssigned ? ' assigned' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, actor.id)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect && onSelect(actor)}
      title={`${actor.name} — click for profile · drag to cast`}
    >
      <div className="actor-avatar">{initials(actor.name)}</div>
      <div className="actor-info">
        <div className="actor-name">{actor.name}</div>
        <div className="actor-meta">{actor.metadata.type}</div>
        <div className="actor-stats">
          <span className={`stat rt ${rtColorClass(actor.stats.rtScore)}`}>🍅 {actor.stats.rtScore}%</span>
          <span className="stat cost">{fmt(actor.stats.cost)}</span>
        </div>
      </div>
      <div
        className={`diva-indicator diva-${divaLevel(actor.stats.divaRating)}`}
        title={`Diva Rating: ${actor.stats.divaRating}/10`}
      />
    </div>
  )
}

const AGENCY_URLS = {
  'WME':         'https://www.wmeagency.com',
  'CAA':         'https://www.caa.com',
  'UTA':         'https://www.unitedtalent.com',
  'ICM':         'https://www.icmpartners.com',
}

// ── Role accent colours (ties Panel 2 card to Panel 1 glows) ─
const ROLE_ACCENT = {
  "Kaelen Sol":             { border: '#3A6BC8', avatar: '#1A3A6E', glow: 'rgba(58,107,200,0.8)'  },
  "Vaneen Kor":             { border: '#C83A3A', avatar: '#6E1A1A', glow: 'rgba(200,58,58,0.8)'   },
  "Jaxen Vane":             { border: '#C83A3A', avatar: '#6E1A1A', glow: 'rgba(200,58,58,0.8)'   },
  "Chancellor Aris Thorne": { border: '#3A6BC8', avatar: '#1A3A6E', glow: 'rgba(58,107,200,0.8)'  },
  "T-0":                    { border: '#C8A020', avatar: '#5C4400', glow: 'rgba(200,160,32,0.8)'  },
  "Rey Skywalker":          { border: '#2D3A4A', avatar: '#1A242E', glow: 'rgba(80,120,160,0.6)'  },
}

// ── Panel 2 — FIFA Card ───────────────────────────────────
function Panel2({ actor, photo, onPhotoSet, note, onNoteChange, onClose, isDark }) {
  const [isFlipped, setIsFlipped]   = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const accent = ROLE_ACCENT[actor.role] || ROLE_ACCENT['Rey Skywalker']
  const pointerOrigin = useRef(null)

  const handleCardPointerDown = (e) => {
    pointerOrigin.current = { x: e.clientX, y: e.clientY }
  }
  const handleCardClick = (e) => {
    if (!pointerOrigin.current) return
    const dx = Math.abs(e.clientX - pointerOrigin.current.x)
    const dy = Math.abs(e.clientY - pointerOrigin.current.y)
    pointerOrigin.current = null
    if (dx > 4 || dy > 4) return
    setIsFlipped(f => !f)
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleFileDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => onPhotoSet(actor.id, ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="p2-overlay" onClick={onClose}>
      <div className="p2-scene" onClick={e => e.stopPropagation()}>

        <button className="p2-close" onClick={(e) => { e.stopPropagation(); onClose() }} aria-label="Close">✕</button>

        <div
          className={`p2-card${isFlipped ? ' flipped' : ''}`}
          style={{ '--accent': accent.border, cursor: 'pointer' }}
          onPointerDown={handleCardPointerDown}
          onClick={handleCardClick}
        >

          {/* ── Front — full-bleed photo / initials placeholder ── */}
          <div
            className={`p2-face p2-front${isDragOver ? ' drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true) }}
            onDragLeave={(e) => { e.stopPropagation(); setIsDragOver(false) }}
            onDrop={(e) => { e.stopPropagation(); handleFileDrop(e) }}
          >
            {/* Background: photo or accent-coloured placeholder */}
            {photo ? (
              <img src={photo} className="p2-photo" alt={actor.name} draggable={false} />
            ) : (
              <div className="p2-placeholder" style={{ background: accent.avatar }}>
                <div className="p2-placeholder-initials">{initials(actor.name)}</div>
                <div className="p2-drop-hint">Drop a photo to set headshot</div>
              </div>
            )}

            {/* Drop target overlay */}
            {isDragOver && (
              <div className="p2-drop-overlay">
                <span>Drop to set headshot</span>
              </div>
            )}

            {/* Bottom gradient with name + character */}
            <div className="p2-front-overlay">
              <div className="p2-front-name">{actor.name}</div>
              <div className="p2-front-character">{actor.role}</div>
            </div>

            {/* Flip affordance */}
            <div className="p2-flip-tab">Profile →</div>
          </div>

          {/* ── Back — stats & tape notes ── */}
          <div className="p2-face p2-back">
            <div className="p2-back-header">
              <div>
                <div className="p2-back-name">{actor.name}</div>
                <div className="p2-back-sub">
                  {AGENCY_URLS[actor.metadata.agency] ? (
                    <a
                      className="p2-agency-link"
                      href={AGENCY_URLS[actor.metadata.agency]}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                    >{actor.metadata.agency}</a>
                  ) : actor.metadata.agency}
                  {' · '}{actor.metadata.type}
                </div>
              </div>
              <div className={`p2-rt-badge p2-rt-${rtColorClass(actor.stats.rtScore)}`}>
                🍅 {actor.stats.rtScore}%
              </div>
            </div>

            <div className="p2-divider" style={{ background: accent.border, opacity: 0.2 }} />

            <div className="p2-section">
              <div className="p2-section-label">Tape Notes</div>
              <div className="p2-tape-notes">"{actor.metadata.tapeNotes}"</div>
              <textarea
                className="p2-notes-input"
                placeholder="Add your notes…"
                value={note}
                onChange={e => onNoteChange(actor.id, e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>

            <div className="p2-section">
              <div className="p2-section-label">Strengths</div>
              <div className="p2-chips">
                {actor.metadata.strengths.map(s => (
                  <span key={s} className="p2-chip" style={isDark ? {
                    borderColor: accent.border,
                    color: accent.border,
                    textShadow: `0 0 8px ${accent.glow}`,
                    boxShadow: `0 0 6px ${accent.glow.replace('0.8','0.25')}`,
                    background: accent.glow.replace('0.8','0.08'),
                  } : { borderColor: accent.border, color: accent.border }}>{s}</span>
                ))}
              </div>
            </div>

            <div className="p2-section">
              <div className="p2-section-label">Genre Experience</div>
              <div className="p2-chips">
                {actor.metadata.genreExperience.map(g => (
                  <span key={g} className="p2-chip">{g}</span>
                ))}
              </div>
            </div>

            <div className="p2-divider" style={{ background: accent.border, opacity: 0.2 }} />

            <div className="p2-meta-grid">
              <div className="p2-meta-item">
                <span className="p2-meta-label">Availability</span>
                <span className="p2-meta-value">{actor.metadata.availabilityWindow}</span>
              </div>
              <div className="p2-meta-item">
                <span className="p2-meta-label">Cost</span>
                <span className="p2-meta-value">{fmt(actor.stats.cost)}</span>
              </div>
              <div className="p2-meta-item">
                <span className="p2-meta-label">Diva Rating</span>
                <span className="p2-meta-value">{actor.stats.divaRating} / 10</span>
              </div>
            </div>

            {actor.metadata.currentEventsReason && (
              <div className="p2-sentiment-section">
                <div className="p2-section-label">Audience Sentiment</div>
                <div className={`p2-sentiment-badge p2-sentiment-${actor.background.currentEvents.toLowerCase()}`}>
                  {actor.background.currentEvents}
                </div>
                <div className="p2-sentiment-reason">{actor.metadata.currentEventsReason}</div>
              </div>
            )}

            {actor.metadata.articles?.length > 0 && (
              <div className="p2-articles">
                <div className="p2-section-label">In the Press</div>
                {actor.metadata.articles.map((a, i) => (
                  <a
                    key={i}
                    className="p2-article-link"
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                  >
                    <span className="p2-article-headline">{a.headline}</span>
                    <span className="p2-article-pub">{a.publication}</span>
                  </a>
                ))}
              </div>
            )}

            <div className="p2-hint">← Click to flip back</div>
          </div>

        </div>
      </div>
    </div>
  )
}

// Glow color per role when selected in the dropdown
const GLOW_CLASS = {
  "Kaelen Sol":             "glow-blue",
  "Chancellor Aris Thorne": "glow-blue",
  "Jaxen Vane":             "glow-red",
  "Vaneen Kor":             "glow-red",
  "T-0":                    "glow-yellow",
}

// Diamond grid positions — col/row in a 3×4 grid
//           [T-0]             row 1, col 2
//  [Kaelen]      [Jaxen]      row 2, cols 1 & 3
//           [Rey]             row 3, col 2  ← center
// [Chancellor]  [Vaneen]      row 4, cols 1 & 3
const GRID_POSITIONS = {
  "T-0":                    { gridColumn: 2, gridRow: 1 },
  "Kaelen Sol":             { gridColumn: 1, gridRow: 2 },
  "Jaxen Vane":             { gridColumn: 3, gridRow: 2 },
  "Rey Skywalker":          { gridColumn: 2, gridRow: 3 },
  "Chancellor Aris Thorne": { gridColumn: 1, gridRow: 4 },
  "Vaneen Kor":             { gridColumn: 3, gridRow: 4 },
}

// ── Panel 3 — Circular Gauge ─────────────────────────────
function CircleGauge({ score, color }) {
  const R = 38
  const C = 2 * Math.PI * R
  const filled = score != null ? (score / 100) * C : 0
  return (
    <svg viewBox="0 0 100 100" className="p3-gauge-svg" aria-hidden="true">
      <circle cx="50" cy="50" r={R} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={R} fill="none"
        stroke={score != null ? color : 'transparent'}
        strokeWidth="8"
        strokeDasharray={`${filled} ${C - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  )
}

function AudienceApproval({ score, actors }) {
  const color = score == null ? 'var(--text-muted)' : score >= 75 ? 'var(--status-high)' : score >= 50 ? 'var(--status-mid)' : 'var(--status-low)'
  const label = score == null ? '' : score >= 75 ? 'Positive' : score >= 50 ? 'Mixed' : 'Negative'
  const counts = { Positive: 0, Neutral: 0, Negative: 0 }
  actors.forEach(a => { counts[a.background.currentEvents] = (counts[a.background.currentEvents] || 0) + 1 })
  return (
    <div className="p3-card">
      <div className="p3-card-header">
        <span className="p3-card-label">Audience Approval</span>
        <span className="p3-card-sub">Current Events Sentiment</span>
      </div>
      <div className="p3-gauge-wrap">
        <CircleGauge score={score} color={color} />
        <div className="p3-gauge-center">
          <div className="p3-gauge-score" style={{ color }}>{score != null ? score : '—'}</div>
          {label && <div className="p3-gauge-label" style={{ color }}>{label}</div>}
        </div>
      </div>
      <div className="p3-sentiment-row">
        {[['Positive','var(--status-high)'],['Neutral','var(--status-mid)'],['Negative','var(--status-low)']].map(([k, c]) => (
          <div key={k} className="p3-sentiment-item">
            <div className="p3-sentiment-dot" style={{ background: c }} />
            <span className="p3-sentiment-val">{counts[k]}</span>
            <span className="p3-sentiment-key">{k}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ETHNICITY_SHORT = {
  'White': 'White', 'Hispanic/Latino': 'Hispanic',
  'Black/African American': 'Black', 'Asian': 'Asian',
  'Two or more races/Other': 'Other'
}

function DiversityIndex({ castCounts, baseline, score, total }) {
  const color = score == null ? 'var(--text-muted)' : score >= 70 ? 'var(--status-high)' : score >= 50 ? 'var(--status-mid)' : 'var(--status-low)'
  return (
    <div className="p3-card">
      <div className="p3-card-header">
        <span className="p3-card-label">Diversity Index</span>
        <span className="p3-card-sub">vs. US Census Baseline</span>
      </div>
      <div className="p3-diversity-top">
        <span className="p3-big-num" style={{ color }}>{score != null ? `${score}%` : '—'}</span>
        <span className="p3-big-sub">alignment</span>
      </div>
      <div className="p3-diversity-bars">
        {Object.keys(baseline).map(e => {
          const castPct = total > 0 ? castCounts[e] / total : 0
          return (
            <div key={e} className="p3-div-row">
              <span className="p3-div-label">{ETHNICITY_SHORT[e] || e}</span>
              <div className="p3-div-tracks">
                <div className="p3-div-track"><div className="p3-div-fill p3-census-fill" style={{ width: `${baseline[e] * 100}%` }} /></div>
                <div className="p3-div-track"><div className="p3-div-fill p3-cast-fill" style={{ width: `${castPct * 100}%` }} /></div>
              </div>
              <span className="p3-div-pct">{Math.round(castPct * 100)}%</span>
            </div>
          )
        })}
      </div>
      <div className="p3-div-legend">
        <span className="p3-legend-item"><span className="p3-legend-dot p3-census-dot" />Census</span>
        <span className="p3-legend-item"><span className="p3-legend-dot p3-cast-dot" />Cast</span>
      </div>
    </div>
  )
}

function ProfitPredictor({ predicted, base, assignedCount, totalSlots, avgRT, sentimentScore, isOverBudget }) {
  const fmtBig = (n) => n >= 1_000_000_000
    ? `$${(n / 1_000_000_000).toFixed(2)}B`
    : `$${(n / 1_000_000).toFixed(0)}M`
  const low   = predicted * 0.84
  const high  = predicted * 1.16
  const delta = predicted - base
  const deltaPct = ((Math.abs(delta) / base) * 100).toFixed(1)
  const color = predicted >= base ? 'var(--status-high)' : 'var(--status-mid)'
  const drivers = [
    { label: `RT Avg ${Math.round(avgRT)}%`, ok: avgRT >= 85 },
    {
      label: sentimentScore == null ? 'Sentiment ?' : sentimentScore >= 75 ? 'Sentiment +' : sentimentScore >= 50 ? 'Sentiment ~' : 'Sentiment −',
      ok: sentimentScore == null ? null : sentimentScore >= 75
    },
    { label: isOverBudget ? 'Over Budget' : 'On Budget', ok: !isOverBudget },
  ]
  return (
    <div className="p3-card">
      <div className="p3-card-header">
        <span className="p3-card-label">AI Profit Predictor</span>
        <span className="p3-card-sub">Global Box Office Estimate</span>
      </div>
      <div className="p3-profit-main">
        <div className="p3-big-num" style={{ color }}>{fmtBig(predicted)}</div>
        <div className="p3-profit-delta" style={{ color }}>{delta >= 0 ? '↑' : '↓'} {deltaPct}% vs $850M baseline</div>
      </div>
      <div className="p3-range">
        <span className="p3-range-label">Range</span>
        <span className="p3-range-vals">{fmtBig(low)} — {fmtBig(high)}</span>
      </div>
      <div className="p3-drivers">
        {drivers.map(d => (
          <span key={d.label} className="p3-driver-chip" style={{
            background:  d.ok === true ? 'var(--status-high-bg)' : d.ok === false ? 'var(--status-low-bg)' : 'var(--surface-2)',
            color:       d.ok === true ? 'var(--status-high)' : d.ok === false ? 'var(--status-low)' : 'var(--text-muted)',
            borderColor: d.ok === true ? 'var(--status-high-border)' : d.ok === false ? 'var(--status-low-border)' : 'var(--border)',
          }}>{d.label}</span>
        ))}
      </div>
      {assignedCount < totalSlots && (
        <div className="p3-cast-note">{assignedCount}/{totalSlots} roles cast — estimate will sharpen</div>
      )}
    </div>
  )
}

// ── Panel 3 — Chemistry Meter widget ────────────────────
function ChemistryMeter({ actors }) {
  if (actors.length < 2) {
    return (
      <div className="p3-card">
        <div className="p3-card-header">
          <span className="p3-card-label">Cast Chemistry</span>
          <span className="p3-card-sub">Ensemble compatibility score</span>
        </div>
        <div className="p3-diversity-top">
          <span className="p3-big-num" style={{ color: 'var(--text-muted)' }}>—</span>
          <span className="p3-big-sub">need 2+ cast</span>
        </div>
      </div>
    )
  }
  const { overall, pairs } = calculateEnsembleChemistry(actors)
  const color  = overall >= 70 ? 'var(--status-high)' : overall >= 40 ? 'var(--status-mid)' : 'var(--status-low)'
  const sorted = [...pairs].sort((a, b) => b.score - a.score)
  const best   = sorted[0]
  const worst  = sorted[sorted.length - 1]
  const byId   = Object.fromEntries(actors.map(a => [a.id, a]))
  const firstName = (id) => byId[id]?.name?.split(' ')[0] ?? ''
  return (
    <div className="p3-card">
      <div className="p3-card-header">
        <span className="p3-card-label">Cast Chemistry</span>
        <span className="p3-card-sub">Ensemble compatibility score</span>
      </div>
      <div className="p3-diversity-top">
        <span className="p3-big-num" style={{ color }}>{overall}</span>
        <span className="p3-big-sub">/ 100</span>
      </div>
      <div className="p3-chem-bar-wrap">
        <div className="p3-chem-bar-track">
          <div className="p3-chem-bar-fill" style={{ width: `${overall}%`, background: color }} />
        </div>
      </div>
      {pairs.length > 1 && (
        <div className="p3-chem-caption">
          {best && <span>Best: {firstName(best.actorAId)} + {firstName(best.actorBId)} ({best.score})</span>}
          {worst && worst.score !== best.score && <span>Risk: {firstName(worst.actorAId)} + {firstName(worst.actorBId)} ({worst.score})</span>}
        </div>
      )}
    </div>
  )
}

// ── Panel 3 — The Controller ─────────────────────────────
function Panel3({ assignedActors, analytics, budgetLimit, currentTotal }) {
  const [isOpen, setIsOpen] = useState(false)
  const { usCensusBaseline } = analytics
  const ethnicities = Object.keys(usCensusBaseline)

  const sentimentMap = { Positive: 100, Neutral: 50, Negative: 0 }
  const sentimentScore = assignedActors.length
    ? Math.round(assignedActors.reduce((sum, a) => sum + (sentimentMap[a.background.currentEvents] ?? 50), 0) / assignedActors.length)
    : null

  const castEthnicityCounts = Object.fromEntries(ethnicities.map(e => [e, 0]))
  assignedActors.forEach(a => {
    const e = a.background.ethnicity
    if (e in castEthnicityCounts) castEthnicityCounts[e]++
    else castEthnicityCounts['Two or more races/Other']++
  })
  const divTotal = assignedActors.length
  const diversityScore = divTotal > 0
    ? Math.round(Math.max(0, (1 - ethnicities.reduce((sum, e) =>
        sum + Math.abs((castEthnicityCounts[e] / divTotal) - usCensusBaseline[e]), 0) / 2) * 100))
    : null

  const avgRT = assignedActors.length
    ? assignedActors.reduce((sum, a) => sum + a.stats.rtScore, 0) / assignedActors.length
    : 85
  const rtFactor       = 0.75 + 0.5 * (avgRT / 100)
  const budgetFactor   = currentTotal > budgetLimit ? 0.94 : 1.0
  const sentFactor     = sentimentScore != null ? 0.88 + 0.24 * (sentimentScore / 100) : 1.0
  const castFactor     = 0.55 + 0.45 * (assignedActors.length / 6)
  const predicted      = analytics.expectedRevenue * rtFactor * budgetFactor * sentFactor * castFactor

  return (
    <div className={`exec-sidebar${isOpen ? ' exec-open' : ''}`}>
      <button
        className="exec-tab"
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Collapse Executive Summary' : 'Expand Executive Summary'}
      >
        <span className="exec-tab-label">Executive Summary</span>
        <span className="exec-tab-chevron">{isOpen ? '›' : '‹'}</span>
      </button>
      <div className="exec-panel">
        <div className="exec-widgets">
          <AudienceApproval score={sentimentScore} actors={assignedActors} />
          <DiversityIndex
            castCounts={castEthnicityCounts}
            baseline={usCensusBaseline}
            score={diversityScore}
            total={divTotal}
          />
          <ProfitPredictor
            predicted={predicted}
            base={analytics.expectedRevenue}
            assignedCount={assignedActors.length}
            totalSlots={6}
            avgRT={avgRT}
            sentimentScore={sentimentScore}
            isOverBudget={currentTotal > budgetLimit}
          />
          <ChemistryMeter actors={assignedActors} />
        </div>
      </div>
    </div>
  )
}

// ── SAG Cast List PDF generator ──────────────────────────
function buildCastListHTML(production, rows) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const fmtDate = d => d ? new Date(d + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>SAG-AFTRA Cast List — ${production.title}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Times New Roman',Times,serif;font-size:11pt;color:#000;background:#fff;padding:.75in}
.hdr{border-bottom:2pt solid #000;padding-bottom:10pt;margin-bottom:18pt}
.hdr-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6pt}
.sag-badge{font-family:Arial,sans-serif;font-size:8pt;font-weight:700;letter-spacing:.12em;border:1.5pt solid #333;padding:3pt 6pt;color:#333}
.doc-title{font-size:20pt;font-weight:700;letter-spacing:.06em;text-align:center}
.doc-sub{font-size:9pt;color:#666;text-align:center;margin-top:3pt}
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);border:1pt solid #000;margin-bottom:18pt}
.pc{padding:6pt 8pt;border-right:1pt solid #000;border-bottom:1pt solid #000}
.pc:nth-child(3n){border-right:none}
.pc:nth-last-child(-n+3){border-bottom:none}
.pl{font-size:7pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#666;margin-bottom:3pt}
.pv{font-size:10pt}
.cast-hd{font-size:9pt;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8pt}
table{width:100%;border-collapse:collapse;font-size:9.5pt}
thead tr{background:#000;color:#fff}
th{padding:5pt 6pt;text-align:left;font-size:7.5pt;letter-spacing:.08em;text-transform:uppercase}
td{padding:5pt 6pt;border-bottom:.5pt solid #ccc;vertical-align:middle}
tr:nth-child(even) td{background:#f9f9f9}
.cn{width:22pt;text-align:center;color:#888}
.cc{font-style:italic}
.ca{font-weight:600}
.foot{margin-top:28pt;border-top:1pt solid #000;padding-top:14pt}
.sigs{display:grid;grid-template-columns:repeat(3,1fr);gap:20pt}
.sig-line{border-bottom:1pt solid #000;height:22pt;margin-bottom:4pt}
.sig-lbl{font-size:8pt;color:#555}
.note{margin-top:18pt;font-size:8pt;color:#666;line-height:1.55}
@media print{body{padding:.5in}@page{margin:.5in;size:letter}}
</style></head><body>
<div class="hdr">
  <div class="hdr-top"><div class="sag-badge">SAG-AFTRA</div><div style="font-size:9pt;color:#555">Generated: ${today}</div></div>
  <div class="doc-title">CAST LIST</div>
  <div class="doc-sub">${production.agreement} Agreement</div>
</div>
<div class="pgrid">
  <div class="pc"><div class="pl">Production Title</div><div class="pv">${production.title||'—'}</div></div>
  <div class="pc"><div class="pl">Production Company</div><div class="pv">${production.company||'—'}</div></div>
  <div class="pc"><div class="pl">Project / Episode #</div><div class="pv">${production.projectNo||'—'}</div></div>
  <div class="pc"><div class="pl">Producer</div><div class="pv">${production.producer||'—'}</div></div>
  <div class="pc"><div class="pl">Director</div><div class="pv">${production.director||'—'}</div></div>
  <div class="pc"><div class="pl">Casting Director</div><div class="pv">${production.castingDirector||'—'}</div></div>
  <div class="pc"><div class="pl">Principal Photography Start</div><div class="pv">${fmtDate(production.shootStart)}</div></div>
  <div class="pc"><div class="pl">Principal Photography End</div><div class="pv">${fmtDate(production.shootEnd)}</div></div>
  <div class="pc"><div class="pl">SAG-AFTRA Agreement</div><div class="pv">${production.agreement}</div></div>
</div>
<div class="cast-hd">Principal Cast</div>
<table>
  <thead><tr><th>#</th><th>Character</th><th>Actor / Performer</th><th>SAG-AFTRA #</th><th>Role Type</th><th>Start Date</th><th>Days</th><th>Negotiated Rate</th></tr></thead>
  <tbody>${rows.map((r,i)=>`<tr>
    <td class="cn">${i+1}</td><td class="cc">${r.character}</td><td class="ca">${r.actor}</td>
    <td>${r.sagNo||'—'}</td><td>${r.roleType}</td><td>${fmtDate(r.startDate)}</td>
    <td style="text-align:center">${r.days||'—'}</td><td>${r.rate||'—'}</td>
  </tr>`).join('')}</tbody>
</table>
<div class="foot">
  <div class="sigs">
    <div><div class="sig-line"></div><div class="sig-lbl">Producer Signature</div></div>
    <div><div class="sig-line"></div><div class="sig-lbl">Casting Director Signature</div></div>
    <div><div class="sig-line"></div><div class="sig-lbl">SAG-AFTRA Representative</div></div>
  </div>
  <div class="note">This cast list is submitted in accordance with SAG-AFTRA ${production.agreement} Agreement requirements. All performers are subject to the terms and conditions of the applicable SAG-AFTRA collective bargaining agreement. Rates reflect negotiated minimums or above-scale agreements as applicable.</div>
</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`
}

// ── Cast List Modal ───────────────────────────────────────
function CastListModal({ assignedActors, onClose }) {
  const [prod, setProd] = useState({
    title: 'Project Echoes',
    company: 'Disney / Lucasfilm',
    agreement: 'Theatrical',
    projectNo: '',
    producer: '',
    director: '',
    castingDirector: '',
    shootStart: '',
    shootEnd: '',
  })

  const [rows, setRows] = useState(
    assignedActors.map(a => ({
      id: a.id,
      character: a.role,
      actor: a.name,
      sagNo: '',
      roleType: a.metadata.type === 'Voice / Mo-cap' ? 'Day Player' : 'Lead',
      startDate: '',
      days: '',
      rate: `$${(a.stats.cost / 1_000_000).toFixed(0)}M`,
    }))
  )

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const setProdField = (k, v) => setProd(p => ({ ...p, [k]: v }))
  const setRowField  = (id, k, v) => setRows(rs => rs.map(r => r.id === id ? { ...r, [k]: v } : r))

  const handleDownload = () => {
    const html = buildCastListHTML(prod, rows)
    const win = window.open('', '_blank', 'width=900,height=1100')
    win.document.write(html)
    win.document.close()
  }

  const ROLE_TYPES = ['Lead', 'Supporting Lead', 'Day Player', 'Weekly Player', 'Multiple Day', 'Voice / Mo-cap']

  return (
    <div className="cl-overlay" onClick={onClose}>
      <div className="cl-modal" onClick={e => e.stopPropagation()}>

        <div className="cl-modal-header">
          <div className="cl-modal-title-group">
            <span className="cl-sag-badge">SAG-AFTRA</span>
            <h2 className="cl-modal-title">Cast List</h2>
          </div>
          <div className="cl-modal-actions">
            <button className="cl-download-btn" onClick={handleDownload}>Download PDF</button>
            <button className="cl-modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="cl-modal-body">

          {/* Production Info */}
          <div className="cl-section-label">Production Details</div>
          <div className="cl-prod-grid">
            {[
              { key: 'title',           label: 'Production Title' },
              { key: 'company',         label: 'Production Company' },
              { key: 'projectNo',       label: 'Project / Episode #' },
              { key: 'producer',        label: 'Producer' },
              { key: 'director',        label: 'Director' },
              { key: 'castingDirector', label: 'Casting Director' },
            ].map(({ key, label }) => (
              <div className="cl-field" key={key}>
                <label className="cl-label">{label}</label>
                <input
                  className="cl-input"
                  value={prod[key]}
                  onChange={e => setProdField(key, e.target.value)}
                  placeholder="—"
                />
              </div>
            ))}
            <div className="cl-field">
              <label className="cl-label">SAG-AFTRA Agreement</label>
              <select className="cl-input cl-select" value={prod.agreement} onChange={e => setProdField('agreement', e.target.value)}>
                {['Theatrical','Low Budget','Modified Low Budget','Ultra Low Budget','Television'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="cl-field">
              <label className="cl-label">Shoot Start</label>
              <input className="cl-input" type="date" value={prod.shootStart} onChange={e => setProdField('shootStart', e.target.value)} />
            </div>
            <div className="cl-field">
              <label className="cl-label">Shoot End</label>
              <input className="cl-input" type="date" value={prod.shootEnd} onChange={e => setProdField('shootEnd', e.target.value)} />
            </div>
          </div>

          {/* Cast Table */}
          <div className="cl-section-label">Principal Cast <span className="cl-cast-count">{rows.length} of 6 roles cast</span></div>
          <div className="cl-table-wrap">
            <table className="cl-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Character</th>
                  <th>Actor / Performer</th>
                  <th>SAG-AFTRA #</th>
                  <th>Role Type</th>
                  <th>Start Date</th>
                  <th>Days</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id}>
                    <td className="cl-td-num">{i + 1}</td>
                    <td className="cl-td-char">{row.character}</td>
                    <td className="cl-td-actor">{row.actor}</td>
                    <td><input className="cl-cell-input" value={row.sagNo} onChange={e => setRowField(row.id, 'sagNo', e.target.value)} placeholder="—" /></td>
                    <td>
                      <select className="cl-cell-input cl-cell-select" value={row.roleType} onChange={e => setRowField(row.id, 'roleType', e.target.value)}>
                        {ROLE_TYPES.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </td>
                    <td><input className="cl-cell-input" type="date" value={row.startDate} onChange={e => setRowField(row.id, 'startDate', e.target.value)} /></td>
                    <td><input className="cl-cell-input cl-cell-narrow" value={row.days} onChange={e => setRowField(row.id, 'days', e.target.value)} placeholder="—" /></td>
                    <td><input className="cl-cell-input" value={row.rate} onChange={e => setRowField(row.id, 'rate', e.target.value)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Casting Data Report ───────────────────────────────────
function buildCDRHTML(production, rows) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const ethCounts = {}
  rows.forEach(r => {
    if (r.ethnicity && r.ethnicity !== 'Prefer not to say')
      ethCounts[r.ethnicity] = (ethCounts[r.ethnicity] || 0) + 1
  })
  const total = rows.length
  const summaryRows = Object.entries(ethCounts).map(([cat, n]) =>
    `<tr><td>${cat}</td><td style="text-align:center">${n}</td><td style="text-align:center">${Math.round(n/total*100)}%</td></tr>`
  ).join('') || '<tr><td colspan="3" style="color:#999">No data entered</td></tr>'

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>SAG-AFTRA Casting Data Report — ${production.title}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Times New Roman',Times,serif;font-size:10pt;color:#000;background:#fff;padding:.75in}
.hdr{border-bottom:2pt solid #000;padding-bottom:10pt;margin-bottom:18pt}
.hdr-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6pt}
.sag-badge{font-family:Arial,sans-serif;font-size:8pt;font-weight:700;letter-spacing:.12em;border:1.5pt solid #333;padding:3pt 6pt;color:#333}
.doc-title{font-size:20pt;font-weight:700;letter-spacing:.06em;text-align:center}
.doc-sub{font-size:9pt;color:#666;text-align:center;margin-top:3pt}
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);border:1pt solid #000;margin-bottom:18pt}
.pc{padding:6pt 8pt;border-right:1pt solid #000;border-bottom:1pt solid #000}
.pc:nth-child(3n){border-right:none}
.pc:nth-last-child(-n+3){border-bottom:none}
.pl{font-size:7pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#666;margin-bottom:3pt}
.pv{font-size:10pt}
.sect{font-size:9pt;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin:18pt 0 8pt;border-bottom:.5pt solid #ccc;padding-bottom:4pt}
table{width:100%;border-collapse:collapse;font-size:9pt}
thead tr{background:#000;color:#fff}
th{padding:5pt 6pt;text-align:left;font-size:7.5pt;letter-spacing:.08em;text-transform:uppercase}
td{padding:5pt 6pt;border-bottom:.5pt solid #ccc;vertical-align:middle}
tr:nth-child(even) td{background:#f9f9f9}
.smry-tbl{width:380pt;margin-top:2pt}
.smry-tbl thead tr{background:#333}
.foot{margin-top:28pt;border-top:1pt solid #000;padding-top:14pt}
.sigs{display:grid;grid-template-columns:repeat(3,1fr);gap:20pt;margin-bottom:14pt}
.sig-line{border-bottom:1pt solid #000;height:22pt;margin-bottom:4pt}
.sig-lbl{font-size:8pt;color:#555}
.disc{font-size:8pt;color:#666;line-height:1.6}
@media print{body{padding:.5in}@page{margin:.5in;size:letter landscape}}
</style></head><body>
<div class="hdr">
  <div class="hdr-top"><div class="sag-badge">SAG-AFTRA</div><div style="font-size:9pt;color:#555">Generated: ${today}</div></div>
  <div class="doc-title">CASTING DATA REPORT</div>
  <div class="doc-sub">Diversity &amp; Inclusion Employment Report — ${production.agreement} Agreement</div>
</div>
<div class="pgrid">
  <div class="pc"><div class="pl">Production Title</div><div class="pv">${production.title||'—'}</div></div>
  <div class="pc"><div class="pl">Production Company</div><div class="pv">${production.company||'—'}</div></div>
  <div class="pc"><div class="pl">Project / Episode #</div><div class="pv">${production.projectNo||'—'}</div></div>
  <div class="pc"><div class="pl">Producer</div><div class="pv">${production.producer||'—'}</div></div>
  <div class="pc"><div class="pl">Casting Director</div><div class="pv">${production.castingDirector||'—'}</div></div>
  <div class="pc"><div class="pl">Network / Distributor</div><div class="pv">${production.network||'—'}</div></div>
  <div class="pc"><div class="pl">Agreement Type</div><div class="pv">${production.agreement}</div></div>
  <div class="pc"><div class="pl">Shoot Start</div><div class="pv">${production.shootStart||'—'}</div></div>
  <div class="pc"><div class="pl">Release / Air Date</div><div class="pv">${production.releaseDate||'—'}</div></div>
</div>
<div class="sect">Performer Employment Data</div>
<table>
  <thead><tr><th>#</th><th>Character</th><th>Actor / Performer</th><th>SAG-AFTRA Status</th><th>Race / Ethnicity</th><th>Gender</th><th>Disability</th><th>Age Range</th></tr></thead>
  <tbody>${rows.map((r,i)=>`<tr>
    <td style="width:22pt;text-align:center;color:#888;font-size:9pt">${i+1}</td>
    <td style="font-style:italic">${r.character}</td>
    <td style="font-weight:600">${r.actor}</td>
    <td>${r.sagStatus}</td>
    <td>${r.ethnicity||'—'}</td>
    <td>${r.gender||'—'}</td>
    <td>${r.disability}</td>
    <td>${r.ageRange||'—'}</td>
  </tr>`).join('')}</tbody>
</table>
<div class="sect">Summary — Race / Ethnicity</div>
<table class="smry-tbl">
  <thead><tr><th>Category</th><th>Count</th><th>% of Cast</th></tr></thead>
  <tbody>${summaryRows}</tbody>
</table>
<div class="foot">
  <div class="sigs">
    <div><div class="sig-line"></div><div class="sig-lbl">Producer Signature</div></div>
    <div><div class="sig-line"></div><div class="sig-lbl">Casting Director Signature</div></div>
    <div><div class="sig-line"></div><div class="sig-lbl">SAG-AFTRA Representative</div></div>
  </div>
  <div class="disc">This Casting Data Report is submitted in compliance with SAG-AFTRA's Equal Employment Opportunity policies and applicable diversity reporting requirements. All data is self-reported by performers or as provided by the production. This document is confidential and intended solely for SAG-AFTRA diversity tracking purposes. Completion of this form is voluntary.</div>
</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`
}

function CastingDataReportModal({ assignedActors, onClose }) {
  const ETHNICITIES  = ['', 'White / Caucasian', 'Black / African American', 'Hispanic / Latino', 'Asian / Pacific Islander', 'Native American / Alaskan Native', 'Middle Eastern / North African', 'Multi-Racial / Other', 'Prefer not to say']
  const GENDERS      = ['', 'Man', 'Woman', 'Non-Binary / Gender Non-Conforming', 'Prefer not to say']
  const DISABILITIES = ['No', 'Yes', 'Prefer not to say']
  const AGE_RANGES   = ['', 'Under 18', '18–34', '35–49', '50–64', '65+', 'Prefer not to say']
  const SAG_STATUSES = ['SAG-AFTRA Member', 'Non-Member', 'Financial Core (Fi-Core)', 'Taft-Hartley']

  function mapEthnicity(e) {
    if (!e) return ''
    const l = e.toLowerCase()
    if (l.includes('white'))                              return 'White / Caucasian'
    if (l.includes('black') || l.includes('african'))     return 'Black / African American'
    if (l.includes('hispanic') || l.includes('latino'))   return 'Hispanic / Latino'
    if (l.includes('asian') || l.includes('pacific'))     return 'Asian / Pacific Islander'
    if (l.includes('native') || l.includes('alaskan'))    return 'Native American / Alaskan Native'
    if (l.includes('middle eastern') || l.includes('north african')) return 'Middle Eastern / North African'
    if (l.includes('two') || l.includes('multi') || l.includes('other')) return 'Multi-Racial / Other'
    return ''
  }

  const [prod, setProd] = useState({
    title: 'Project Echoes',
    company: 'Disney / Lucasfilm',
    agreement: 'Theatrical',
    projectNo: '',
    producer: '',
    castingDirector: '',
    network: 'Disney+',
    shootStart: '',
    releaseDate: '',
  })

  const [rows, setRows] = useState(
    assignedActors.map(a => ({
      id:         a.id,
      character:  a.role,
      actor:      a.name,
      sagStatus:  'SAG-AFTRA Member',
      ethnicity:  mapEthnicity(a.background?.ethnicity),
      gender:     '',
      disability: 'No',
      ageRange:   '',
    }))
  )

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const setProdField = (k, v) => setProd(p => ({ ...p, [k]: v }))
  const setRowField  = (id, k, v) => setRows(rs => rs.map(r => r.id === id ? { ...r, [k]: v } : r))

  const ethCounts = {}
  rows.forEach(r => {
    if (r.ethnicity && r.ethnicity !== 'Prefer not to say')
      ethCounts[r.ethnicity] = (ethCounts[r.ethnicity] || 0) + 1
  })

  const handleDownload = () => {
    const html = buildCDRHTML(prod, rows)
    const win = window.open('', '_blank', 'width=1100,height=900')
    win.document.write(html)
    win.document.close()
  }

  return (
    <div className="cl-overlay" onClick={onClose}>
      <div className="cl-modal cl-modal--wide" onClick={e => e.stopPropagation()}>

        <div className="cl-modal-header">
          <div className="cl-modal-title-group">
            <span className="cl-sag-badge">SAG-AFTRA</span>
            <h2 className="cl-modal-title">Casting Data Report</h2>
          </div>
          <div className="cl-modal-actions">
            <button className="cl-download-btn" onClick={handleDownload}>Download PDF</button>
            <button className="cl-modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="cl-modal-body">

          <div className="cl-section-label">Production Details</div>
          <div className="cl-prod-grid">
            {[
              { key: 'title',           label: 'Production Title' },
              { key: 'company',         label: 'Production Company' },
              { key: 'projectNo',       label: 'Project / Episode #' },
              { key: 'producer',        label: 'Producer' },
              { key: 'castingDirector', label: 'Casting Director' },
              { key: 'network',         label: 'Network / Distributor' },
            ].map(({ key, label }) => (
              <div className="cl-field" key={key}>
                <label className="cl-label">{label}</label>
                <input className="cl-input" value={prod[key]} onChange={e => setProdField(key, e.target.value)} placeholder="—" />
              </div>
            ))}
            <div className="cl-field">
              <label className="cl-label">SAG-AFTRA Agreement</label>
              <select className="cl-input cl-select" value={prod.agreement} onChange={e => setProdField('agreement', e.target.value)}>
                {['Theatrical','Low Budget','Modified Low Budget','Ultra Low Budget','Television'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="cl-field">
              <label className="cl-label">Shoot Start</label>
              <input className="cl-input" type="date" value={prod.shootStart} onChange={e => setProdField('shootStart', e.target.value)} />
            </div>
            <div className="cl-field">
              <label className="cl-label">Release / Air Date</label>
              <input className="cl-input" type="date" value={prod.releaseDate} onChange={e => setProdField('releaseDate', e.target.value)} />
            </div>
          </div>

          <div className="cl-section-label">
            Performer Employment Data
            <span className="cl-cast-count">{rows.length} performers</span>
          </div>
          <div className="cl-table-wrap">
            <table className="cl-table">
              <thead>
                <tr>
                  <th>#</th><th>Character</th><th>Actor / Performer</th>
                  <th>SAG-AFTRA Status</th><th>Race / Ethnicity</th>
                  <th>Gender</th><th>Disability</th><th>Age Range</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id}>
                    <td className="cl-td-num">{i + 1}</td>
                    <td className="cl-td-char">{row.character}</td>
                    <td className="cl-td-actor">{row.actor}</td>
                    <td>
                      <select className="cl-cell-input cl-cell-select" value={row.sagStatus} onChange={e => setRowField(row.id, 'sagStatus', e.target.value)}>
                        {SAG_STATUSES.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="cl-cell-input cl-cell-select cdr-eth-select" value={row.ethnicity} onChange={e => setRowField(row.id, 'ethnicity', e.target.value)}>
                        {ETHNICITIES.map(o => <option key={o} value={o}>{o || '— select —'}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="cl-cell-input cl-cell-select" value={row.gender} onChange={e => setRowField(row.id, 'gender', e.target.value)}>
                        {GENDERS.map(o => <option key={o} value={o}>{o || '— select —'}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="cl-cell-input cl-cell-select" value={row.disability} onChange={e => setRowField(row.id, 'disability', e.target.value)}>
                        {DISABILITIES.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="cl-cell-input cl-cell-select" value={row.ageRange} onChange={e => setRowField(row.id, 'ageRange', e.target.value)}>
                        {AGE_RANGES.map(o => <option key={o} value={o}>{o || '— select —'}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {Object.keys(ethCounts).length > 0 && (
            <>
              <div className="cl-section-label cdr-summary-label">Race / Ethnicity — Live Summary</div>
              <div className="cdr-summary">
                {Object.entries(ethCounts).map(([cat, n]) => (
                  <div className="cdr-summary-row" key={cat}>
                    <span className="cdr-summary-cat">{cat}</span>
                    <span className="cdr-summary-bar-wrap">
                      <span className="cdr-summary-bar" style={{ width: `${Math.round(n / rows.length * 100)}%` }} />
                    </span>
                    <span className="cdr-summary-pct">{n} · {Math.round(n / rows.length * 100)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Role Slot ─────────────────────────────────────────────
function RoleSlot({ roleName, roleData, assignedActor, isDropTarget, isActorBeingDragged, glowClass, gridStyle, slotRef, onDrop, onDragOver, onDragLeave, onSlotDragStart, onSlotDragEnd, onActorSelect }) {
  const isEmpty  = !assignedActor
  const isLocked = roleData.isLocked
  const draggable = !isEmpty && !isLocked

  const handleDrop = (e) => {
    e.preventDefault()
    if (!isLocked) onDrop(e, roleName)
  }

  const handleClick = () => {
    if (!isEmpty && onActorSelect) onActorSelect(assignedActor)
  }

  return (
    <div
      ref={slotRef}
      style={gridStyle}
      className={[
        'role-slot',
        isEmpty ? 'empty' : 'filled',
        isLocked ? 'locked' : '',
        isDropTarget ? 'highlighted' : '',
        draggable ? 'draggable' : '',
        isActorBeingDragged ? 'slot-dragging' : '',
        glowClass || '',
      ].join(' ')}
      draggable={draggable}
      onDragStart={draggable ? (e) => onSlotDragStart(e, assignedActor.id, roleName) : undefined}
      onDragEnd={draggable ? onSlotDragEnd : undefined}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); if (!isLocked) onDragOver(e, roleName) }}
      onDragLeave={onDragLeave}
    >
      {isLocked && <span className="lock-badge">Fixed</span>}

      {isEmpty ? (
        <>
          <div className="role-slot-shadow" />
          <div
            className="role-name"
            style={(() => {
              const a = ROLE_ACCENT[roleName] || ROLE_ACCENT['Rey Skywalker']
              return {
                color: a.border,
                textShadow: `0 0 8px ${a.glow}, 0 0 16px ${a.glow}`,
              }
            })()}
          >{roleName}</div>
        </>
      ) : (
        <>
          <div
            className={`role-slot-diva diva-${divaLevel(assignedActor.stats.divaRating)}`}
            title={`Diva Rating: ${assignedActor.stats.divaRating}/10`}
          />
          <div className="role-slot-avatar">{initials(assignedActor.name)}</div>
          <div className="role-slot-info">
            <div className="role-slot-actor">{assignedActor.name}</div>
            <div className="role-slot-meta">{assignedActor.metadata.type}</div>
            <div className="role-slot-role">{roleName}</div>
            <div className="role-slot-stats">
              <span className={`stat rt ${rtColorClass(assignedActor.stats.rtScore)}`}>🍅 {assignedActor.stats.rtScore}%</span>
              <span className="stat cost">{fmt(assignedActor.stats.cost)}</span>
            </div>
            {assignedActor.metadata?.availability && (
              <span className={`avail-tag ${availClass(assignedActor.metadata.availability)}`}>
                {assignedActor.metadata.availability}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ── Galaxy Stage ─────────────────────────────────────────
function GalaxyStage({ children, active }) {
  return (
    <div className={`galaxy-stage${active ? ' galaxy-active' : ''}`}>
      {active && (
        <>
          <div className="gx-nebula" />
          <div className="gx-stars-sm" />
          <div className="gx-stars-md" />
          <div className="gx-stars-lg" />
          <div className="gx-planet gx-planet-1" />
          <div className="gx-planet gx-planet-2" />
          <div className="gx-planet gx-planet-3" />
        </>
      )}
      <div className="gx-content">{children}</div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────
export default function App({ onBack }) {
  const { appState, actors } = castingData
  const [roles, setRoles] = useState(castingData.roles)
  const [draggedId, setDraggedId]   = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const poolRoles = Object.keys(castingData.roles).filter(r => !castingData.roles[r].isLocked)
  const [activeGroup, setActiveGroup]     = useState(poolRoles[0])
  const [selectedActor, setSelectedActor] = useState(null)
  const [actorPhotos, setActorPhotos]     = useState({})
  const [actorNotes, setActorNotes]       = useState({})
  const [showCastList, setShowCastList]   = useState(false)
  const [showCDR, setShowCDR]             = useState(false)
  const [isDark, setIsDark] = useState(() => localStorage.getItem('echoes-theme') === 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : ''
    localStorage.setItem('echoes-theme', isDark ? 'dark' : 'light')
    const styleId = 'xwing-cursor-style'
    let el = document.getElementById(styleId)
    if (isDark) {
      if (!el) { el = document.createElement('style'); el.id = styleId; document.head.appendChild(el) }
      el.textContent = `[data-theme="dark"], [data-theme="dark"] * { cursor: url('${import.meta.env.BASE_URL}xwing-cursor.png') 32 32, auto !important; }`
    } else {
      el?.remove()
    }
  }, [isDark])

  const handlePhotoSet = useCallback((actorId, dataUrl) => {
    setActorPhotos(prev => ({ ...prev, [actorId]: dataUrl }))
  }, [])

  const handleNoteChange = useCallback((actorId, text) => {
    setActorNotes(prev => ({ ...prev, [actorId]: text }))
  }, [])

  const isDragging     = useRef(false)
  const dragSourceRole = useRef(null)
  const dropSucceeded  = useRef(false)
  const castGridRef    = useRef(null)
  const slotRefs       = useRef({})

  // Live cost total from currently assigned actors
  const assignedIds    = Object.values(roles).map(r => r.assignedActorId).filter(Boolean)
  const assignedActors = actors.filter(a => assignedIds.includes(a.id))
  const currentTotal   = assignedActors.reduce((sum, a) => sum + a.stats.cost, 0)

  const actorsById  = useMemo(() => Object.fromEntries(actors.map(a => [a.id, a])), [actors])
  const filledRoles = assignedActors.map(actor => ({
    roleId:  actor.role,
    actorId: actor.id,
    slotRef: { current: slotRefs.current[actor.role] },
  }))

  const getAssignedActor = (roleName) => {
    const sourceRole = castingData.roles[roleName]
    // Locked roles always use the canonical source assignment, immune to state drift
    if (sourceRole?.isLocked) {
      return sourceRole.assignedActorId
        ? actors.find(a => a.id === sourceRole.assignedActorId) || null
        : null
    }
    const id = roles[roleName]?.assignedActorId
    if (!id) return null
    const actor = actors.find(a => a.id === id)
    if (!actor) return null
    // Never show a locked actor in a non-locked slot (guards against stale state)
    const isLockedActor = Object.values(castingData.roles).some(r => r.isLocked && r.assignedActorId === id)
    return isLockedActor ? null : actor
  }

  const handleDragStart = useCallback((e, actorId) => {
    setDraggedId(actorId)
    isDragging.current    = true
    dragSourceRole.current = null
    dropSucceeded.current  = false
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleSlotDragStart = useCallback((e, actorId, fromRole) => {
    setDraggedId(actorId)
    isDragging.current     = true
    dragSourceRole.current  = fromRole
    dropSucceeded.current   = false
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragEnd = useCallback(() => {
    // If drag came from a cast slot and never landed on another slot → unassign
    if (!dropSucceeded.current && dragSourceRole.current) {
      const src = dragSourceRole.current
      setRoles(prev => ({
        ...prev,
        [src]: { ...prev[src], assignedActorId: null }
      }))
    }
    setDraggedId(null)
    setDropTarget(null)
    isDragging.current     = false
    dragSourceRole.current  = null
    dropSucceeded.current   = false
  }, [])

  const handleDragOver = useCallback((e, roleName) => {
    e.preventDefault()
    setDropTarget(roleName)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDropTarget(null)
  }, [])

  const handleDrop = useCallback((e, roleName) => {
    e.preventDefault()
    if (!draggedId || roles[roleName]?.isLocked) return
    // Locked actors can never be dragged into any slot
    const isLockedActor = Object.values(castingData.roles).some(r => r.isLocked && r.assignedActorId === draggedId)
    if (isLockedActor) return

    dropSucceeded.current = true

    setRoles(prev => {
      const next = { ...prev }
      // Unassign the actor from any prior role
      Object.keys(next).forEach(rName => {
        if (next[rName].assignedActorId === draggedId) {
          next[rName] = { ...next[rName], assignedActorId: null }
        }
      })
      // Assign to the target role
      next[roleName] = { ...next[roleName], assignedActorId: draggedId }
      return next
    })

    setDraggedId(null)
    setDropTarget(null)
  }, [draggedId, roles])

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="panel-header">
        <div className="header-left">
          {onBack && (
            <button className="back-btn" onClick={onBack} title="All Projects">
              ← All Projects
            </button>
          )}
          <span className="studio-tag">Disney / Lucasfilm — Confidential</span>
          <h1>Project Echoes</h1>

        </div>
        <div className="header-right">
          <CostCapBar
            currentTotal={currentTotal}
            budgetLimit={appState.budgetLimit}
            isDark={isDark}
          />
          <div className="header-btns">
            <img
              src={import.meta.env.BASE_URL + 'jedi-logo.png'}
              alt="Toggle Film Mode"
              className={`jedi-toggle${isDark ? ' jedi-toggle--active' : ''}`}
              onClick={() => setIsDark(d => !d)}
              title={isDark ? 'Switch to Brief Mode' : 'Switch to Film Mode'}
              draggable={false}
            />
            <button
              className={`ship-btn${assignedActors.length === Object.keys(roles).length && currentTotal <= appState.budgetLimit ? ' ship-btn--ready' : ''}`}
              onClick={() => setShowCastList(true)}
              disabled={currentTotal > appState.budgetLimit}
              title={currentTotal > appState.budgetLimit ? 'Cast is over budget' : 'Generate SAG cast list'}
            >
              Ship Cast →
            </button>
            <button
              className="cdr-btn"
              onClick={() => setShowCDR(true)}
              title="Generate SAG-AFTRA Casting Data Report"
            >
              Cast Report →
            </button>
          </div>
        </div>
      </header>

      <GalaxyStage active={isDark}>
        {/* ── Cast Grid ── */}
        <section className="cast-section">
          <h2 className="section-title">The Cast</h2>
          <div className="cast-grid" ref={castGridRef}>
            <ChemistryOverlay
              filledRoles={filledRoles}
              actorsById={actorsById}
              containerRef={castGridRef}
            />
            {Object.entries(roles).map(([roleName, roleData]) => (
              <RoleSlot
                key={roleName}
                roleName={roleName}
                roleData={roleData}
                assignedActor={getAssignedActor(roleName)}
                isDropTarget={dropTarget === roleName && !roleData.isLocked}
                isActorBeingDragged={draggedId === getAssignedActor(roleName)?.id}
                glowClass={activeGroup === roleName ? GLOW_CLASS[roleName] : null}
                gridStyle={GRID_POSITIONS[roleName]}
                slotRef={el => { slotRefs.current[roleName] = el }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onSlotDragStart={handleSlotDragStart}
                onSlotDragEnd={handleDragEnd}
                onActorSelect={setSelectedActor}
              />
            ))}
          </div>
        </section>

      </GalaxyStage>

      {/* ── Talent Pool ── */}
      <section className="roster-section">
          <div className="pool-header">
            <span className="pool-label">Talent Pool</span>
            <select
              className="pool-select"
              value={activeGroup}
              onChange={e => setActiveGroup(e.target.value)}
            >
              {poolRoles.map(roleName => (
                <option key={roleName} value={roleName}>{roleName}</option>
              ))}
            </select>
          </div>

          {(() => {
            const groupActors = actors
              .filter(a => a.role === activeGroup)
              .sort((a, b) => b.stats.cost - a.stats.cost)
            const { subtitle } = castingData.roles[activeGroup]
            return (
              <div className="role-group">
                <div className="role-group-label">
                  <span className="role-group-name">{activeGroup}</span>
                  {subtitle && <span className="role-group-subtitle">— {subtitle}</span>}
                </div>
                <div className="roster-grid">
                  {groupActors.map(actor => (
                    <div key={actor.id} className="roster-slot">
                      <ActorCard
                        actor={actor}
                        isBeingDragged={draggedId === actor.id}
                        isAssigned={assignedIds.includes(actor.id)}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onSelect={setSelectedActor}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
      </section>

      <Panel3
        assignedActors={assignedActors}
        analytics={castingData.analytics}
        budgetLimit={appState.budgetLimit}
        currentTotal={currentTotal}
      />

      {showCastList && (
        <CastListModal
          assignedActors={assignedActors}
          onClose={() => setShowCastList(false)}
        />
      )}

      {showCDR && (
        <CastingDataReportModal
          assignedActors={assignedActors}
          onClose={() => setShowCDR(false)}
        />
      )}

      {selectedActor && (
        <Panel2
          actor={selectedActor}
          photo={actorPhotos[selectedActor.id] || null}
          onPhotoSet={handlePhotoSet}
          note={actorNotes[selectedActor.id] || ''}
          onNoteChange={handleNoteChange}
          onClose={() => setSelectedActor(null)}
          isDark={isDark}
        />
      )}
    </div>
  )
}
