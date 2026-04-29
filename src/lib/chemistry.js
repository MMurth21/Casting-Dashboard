// src/lib/chemistry.js — pure chemistry scoring, no React/DOM dependencies

function sentimentToScore(sentiment) {
  if (sentiment === 'positive') return 25
  if (sentiment === 'negative') return -25
  return 0
}

/**
 * calculatePairChemistry(actorA, actorB, context?)
 *   → { score: 0–100, tier: "green"|"yellow"|"red", factors: [...] }
 *
 * Starts at a neutral 60 and applies weighted adjustments.
 * context.romanticPair (bool, default false) gates the ageGapFlag.
 */
export function calculatePairChemistry(actorA, actorB, context = {}) {
  const romanticPair = context.romanticPair === true
  const cfA = actorA.chemistryFactors || {}
  const cfB = actorB.chemistryFactors || {}
  const factors = []
  let score = 60

  // ── 1. pastCollaboration: +/- 25 ─────────────────────────────────────────
  const aViewsB = (cfA.pastCollaborations || []).find(c => c.actorId === actorB.id)
  const bViewsA = (cfB.pastCollaborations || []).find(c => c.actorId === actorA.id)
  let collabContribution = 0
  let collabNote = 'No past collaboration on record'
  if (aViewsB || bViewsA) {
    const sA = aViewsB != null ? sentimentToScore(aViewsB.sentiment) : null
    const sB = bViewsA != null ? sentimentToScore(bViewsA.sentiment) : null
    if (sA != null && sB != null) {
      collabContribution = Math.round((sA + sB) / 2) // average asymmetric views
    } else {
      collabContribution = sA != null ? sA : sB
    }
    collabNote = (aViewsB || bViewsA).note
  }
  score += collabContribution
  factors.push({ name: 'pastCollaboration', weight: 25, contribution: collabContribution, note: collabNote })

  // ── 2. divaDelta: -15 if both >= 7, -8 if mismatch (one >= 8, other <= 4) ──
  const divaA = actorA.stats.divaRating
  const divaB = actorB.stats.divaRating
  let divaDeltaContribution = 0
  let divaDeltaNote = `Diva ratings ${divaA} and ${divaB} — no conflict`
  if (divaA >= 7 && divaB >= 7) {
    divaDeltaContribution = -15
    divaDeltaNote = `Both actors have high diva ratings (${divaA} and ${divaB}) — on-set tension risk`
  } else if ((divaA >= 8 && divaB <= 4) || (divaB >= 8 && divaA <= 4)) {
    divaDeltaContribution = -8
    divaDeltaNote = `Diva rating mismatch (${divaA} vs ${divaB}) — professional expectation clash`
  }
  score += divaDeltaContribution
  factors.push({ name: 'divaDelta', weight: 15, contribution: divaDeltaContribution, note: divaDeltaNote })

  // ── 3. ethosClash: -12 if method vs technical ─────────────────────────────
  const ethosA = cfA.actingEthos || ''
  const ethosB = cfB.actingEthos || ''
  const ethosClashFired =
    (ethosA === 'method' && ethosB === 'technical') ||
    (ethosA === 'technical' && ethosB === 'method')
  const ethosContribution = ethosClashFired ? -12 : 0
  const ethosNote = ethosClashFired
    ? `Acting ethos clash: ${ethosA} vs ${ethosB} — process incompatibility`
    : `Compatible ethos (${ethosA || 'unknown'} / ${ethosB || 'unknown'})`
  score += ethosContribution
  factors.push({ name: 'ethosClash', weight: 12, contribution: ethosContribution, note: ethosNote })

  // ── 4. trainingOverlap: +10 if any shared lineage entry ───────────────────
  const trainingA = cfA.trainingLineage || []
  const trainingB = cfB.trainingLineage || []
  const sharedTraining = trainingA.filter(t => trainingB.includes(t))
  const trainingContribution = sharedTraining.length > 0 ? 10 : 0
  const trainingNote = sharedTraining.length > 0
    ? `Shared training lineage: ${sharedTraining.join(', ')}`
    : 'No shared training lineage'
  score += trainingContribution
  factors.push({ name: 'trainingOverlap', weight: 10, contribution: trainingContribution, note: trainingNote })

  // ── 5. originOverlap: +6 if same originRegion ─────────────────────────────
  const originA = cfA.originRegion || ''
  const originB = cfB.originRegion || ''
  const originContribution = (originA && originA === originB) ? 6 : 0
  const originNote = originContribution
    ? `Same origin region: ${originA}`
    : `Different regions (${originA || 'unknown'} / ${originB || 'unknown'})`
  score += originContribution
  factors.push({ name: 'originOverlap', weight: 6, contribution: originContribution, note: originNote })

  // ── 6. franchiseOverlap: +6 if any shared franchise ──────────────────────
  const franchiseA = cfA.franchiseOverlap || []
  const franchiseB = cfB.franchiseOverlap || []
  const sharedFranchise = franchiseA.filter(f => franchiseB.includes(f))
  const franchiseContribution = sharedFranchise.length > 0 ? 6 : 0
  const franchiseNote = sharedFranchise.length > 0
    ? `Shared franchise experience: ${sharedFranchise.join(', ')}`
    : 'No shared franchise history'
  score += franchiseContribution
  factors.push({ name: 'franchiseOverlap', weight: 6, contribution: franchiseContribution, note: franchiseNote })

  // ── 7. sentimentRisk: -1 per (5 - sentiment) per actor, max -10 combined ──
  const sentA = cfA.publicSentiment ?? 0
  const sentB = cfB.publicSentiment ?? 0
  const rawRisk = Math.max(0, 5 - sentA) + Math.max(0, 5 - sentB)
  const sentimentContribution = -Math.min(rawRisk, 10)
  const sentimentNote =
    `Public sentiment: ${sentA >= 0 ? '+' : ''}${sentA} / ${sentB >= 0 ? '+' : ''}${sentB}` +
    ` → combined risk ${rawRisk} (capped at 10)`
  score += sentimentContribution
  factors.push({ name: 'sentimentRisk', weight: 10, contribution: sentimentContribution, note: sentimentNote })

  // ── 8. ageGapFlag: -10 if romantic pair and age diff > 20 yrs ─────────────
  const ageA = cfA.ageBracket
  const ageB = cfB.ageBracket
  let ageContribution = 0
  let ageNote = romanticPair
    ? 'Romantic pair: age gap within acceptable range'
    : 'Age gap not evaluated (non-romantic pairing)'
  if (romanticPair && ageA != null && ageB != null) {
    const gap = Math.abs(ageA - ageB)
    if (gap > 20) {
      ageContribution = -10
      ageNote = `Romantic pair: age gap of ${gap} years exceeds 20-year threshold`
    } else {
      ageNote = `Romantic pair: age gap of ${gap} years within acceptable range`
    }
  }
  score += ageContribution
  factors.push({ name: 'ageGapFlag', weight: 10, contribution: ageContribution, note: ageNote })

  // ── Clamp and tier ────────────────────────────────────────────────────────
  score = Math.max(0, Math.min(100, score))
  const tier = score >= 70 ? 'green' : score >= 40 ? 'yellow' : 'red'

  return { score, tier, factors }
}

/**
 * calculateEnsembleChemistry(actors)
 *   → { overall: 0–100 | null, pairs: [{ actorAId, actorBId, score, tier }] }
 *
 * overall is the mean of all pairwise scores.
 * Returns { overall: null, pairs: [] } if fewer than 2 actors supplied.
 */
export function calculateEnsembleChemistry(actors) {
  if (!actors || actors.length < 2) return { overall: null, pairs: [] }

  const pairs = []
  for (let i = 0; i < actors.length; i++) {
    for (let j = i + 1; j < actors.length; j++) {
      const { score, tier } = calculatePairChemistry(actors[i], actors[j])
      pairs.push({ actorAId: actors[i].id, actorBId: actors[j].id, score, tier })
    }
  }

  const overall = Math.round(pairs.reduce((sum, p) => sum + p.score, 0) / pairs.length)
  return { overall, pairs }
}
