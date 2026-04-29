import { useState, useEffect } from 'react'
import { calculatePairChemistry } from '../lib/chemistry.js'

const TIER_COLOR = {
  green:  'var(--chem-green)',
  yellow: 'var(--chem-yellow)',
  red:    'var(--chem-red)',
}

export default function ChemistryOverlay({ filledRoles, actorsById, containerRef }) {
  // Bumped by ResizeObserver so the component re-renders with fresh getBoundingClientRect() values
  const [, setRev] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setRev(r => r + 1))
    ro.observe(el)
    return () => ro.disconnect()
  }, [containerRef])

  if (!containerRef.current || filledRoles.length < 2) return null

  const containerRect = containerRef.current.getBoundingClientRect()
  const { width, height } = containerRect
  if (!width || !height) return null

  // Compute slot centers relative to the container
  const centers = {}
  for (const { roleId, slotRef } of filledRoles) {
    const el = slotRef.current
    if (!el) continue
    const r = el.getBoundingClientRect()
    centers[roleId] = {
      x: r.left + r.width  / 2 - containerRect.left,
      y: r.top  + r.height / 2 - containerRect.top,
    }
  }

  // Build one line per unique pair
  const lines = []
  for (let i = 0; i < filledRoles.length; i++) {
    for (let j = i + 1; j < filledRoles.length; j++) {
      const a = filledRoles[i]
      const b = filledRoles[j]
      const ca = centers[a.roleId]
      const cb = centers[b.roleId]
      if (!ca || !cb) continue

      const actorA = actorsById[a.actorId]
      const actorB = actorsById[b.actorId]
      if (!actorA || !actorB) continue

      const { score, tier, factors } = calculatePairChemistry(actorA, actorB)

      // Pick the factor with the largest absolute contribution for the tooltip
      const topFactor = factors
        .filter(f => f.contribution !== 0)
        .sort((p, q) => Math.abs(q.contribution) - Math.abs(p.contribution))[0]
      const tooltipText = `Score: ${score} — ${topFactor ? topFactor.note : 'Neutral baseline'}`

      lines.push({
        key:         `${a.roleId}|${b.roleId}`,
        x1: ca.x, y1: ca.y,
        x2: cb.x, y2: cb.y,
        stroke:      TIER_COLOR[tier] || TIER_COLOR.yellow,
        strokeWidth: tier === 'yellow' ? 2 : 3,
        tooltipText,
      })
    }
  }

  if (lines.length === 0) return null

  return (
    <svg
      width={width}
      height={height}
      style={{
        position:      'absolute',
        top:           0,
        left:          0,
        pointerEvents: 'none',
        zIndex:        1,
        overflow:      'visible',
      }}
      aria-hidden="true"
    >
      {lines.map(l => (
        <line
          key={l.key}
          x1={l.x1} y1={l.y1}
          x2={l.x2} y2={l.y2}
          stroke={l.stroke}
          strokeWidth={l.strokeWidth}
          strokeOpacity={0.75}
          strokeLinecap="round"
        >
          <title>{l.tooltipText}</title>
        </line>
      ))}
    </svg>
  )
}
