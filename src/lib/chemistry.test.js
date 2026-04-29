// src/lib/chemistry.test.js
// Plain Node.js — no test framework. Run: node src/lib/chemistry.test.js
import { calculatePairChemistry, calculateEnsembleChemistry } from './chemistry.js'

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`PASS: ${name}`)
    passed++
  } catch (e) {
    console.log(`FAIL: ${name} — ${e.message}`)
    failed++
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed')
}

// Minimal actor factory — all chemistry factors neutral/clean by default
let _uid = 0
function makeActor(overrides = {}) {
  const id = overrides.id || `actor-${++_uid}`
  const base = {
    id,
    stats: { rtScore: 80, cost: 5000000, divaRating: 2 },
    chemistryFactors: {
      originRegion: 'US-West',
      trainingLineage: ['School-Alpha'],
      actingEthos: 'intuitive',
      pastCollaborations: [],
      publicSentiment: 5,
      franchiseOverlap: [],
      ageBracket: 35,
    },
  }
  // Allow deep-merging chemistryFactors separately
  if (overrides.chemistryFactors) {
    base.chemistryFactors = { ...base.chemistryFactors, ...overrides.chemistryFactors }
    delete overrides.chemistryFactors
  }
  return { ...base, ...overrides }
}

// ── Test 1: No overlap → yellow ───────────────────────────────────────────
test('Two actors with no overlap return yellow tier', () => {
  // Different region, training, franchise; neutral sentiment (3) → score = 60 - 4 = 56
  const a = makeActor({
    id: 't1-a',
    chemistryFactors: {
      originRegion: 'US-West', trainingLineage: ['School-A'], actingEthos: 'intuitive',
      pastCollaborations: [], publicSentiment: 3, franchiseOverlap: [], ageBracket: 35,
    },
  })
  const b = makeActor({
    id: 't1-b',
    chemistryFactors: {
      originRegion: 'UK', trainingLineage: ['School-B'], actingEthos: 'intuitive',
      pastCollaborations: [], publicSentiment: 3, franchiseOverlap: [], ageBracket: 35,
    },
  })
  const result = calculatePairChemistry(a, b)
  assert(result.tier === 'yellow', `Expected yellow, got ${result.tier} (score: ${result.score})`)
  assert(result.score === 56, `Expected score 56, got ${result.score}`)
})

// ── Test 2: Positive past collab → green ─────────────────────────────────
test('Two actors with positive past collaboration return green tier', () => {
  // Both sentiment +5 (risk 0). Collab +25. Score = 60 + 25 = 85.
  const a = makeActor({
    id: 't2-a',
    chemistryFactors: {
      originRegion: 'US-West', trainingLineage: [], actingEthos: 'intuitive',
      pastCollaborations: [{ actorId: 't2-b', sentiment: 'positive', note: 'Co-starred in acclaimed film' }],
      publicSentiment: 5, franchiseOverlap: [], ageBracket: 35,
    },
  })
  const b = makeActor({
    id: 't2-b',
    chemistryFactors: {
      originRegion: 'UK', trainingLineage: [], actingEthos: 'intuitive',
      pastCollaborations: [{ actorId: 't2-a', sentiment: 'positive', note: 'Co-starred in acclaimed film' }],
      publicSentiment: 5, franchiseOverlap: [], ageBracket: 35,
    },
  })
  const result = calculatePairChemistry(a, b)
  assert(result.tier === 'green', `Expected green, got ${result.tier} (score: ${result.score})`)
  const cf = result.factors.find(f => f.name === 'pastCollaboration')
  assert(cf.contribution === 25, `Expected +25 collab contribution, got ${cf.contribution}`)
})

// ── Test 3: Negative past collab → red ────────────────────────────────────
test('Two actors with negative past collaboration return red tier', () => {
  // Both sentiment +5 (risk 0). Collab -25. Score = 60 - 25 = 35.
  const a = makeActor({
    id: 't3-a',
    chemistryFactors: {
      originRegion: 'US-West', trainingLineage: [], actingEthos: 'intuitive',
      pastCollaborations: [{ actorId: 't3-b', sentiment: 'negative', note: 'Documented public feud' }],
      publicSentiment: 5, franchiseOverlap: [], ageBracket: 35,
    },
  })
  const b = makeActor({
    id: 't3-b',
    chemistryFactors: {
      originRegion: 'UK', trainingLineage: [], actingEthos: 'intuitive',
      pastCollaborations: [{ actorId: 't3-a', sentiment: 'negative', note: 'Documented public feud' }],
      publicSentiment: 5, franchiseOverlap: [], ageBracket: 35,
    },
  })
  const result = calculatePairChemistry(a, b)
  assert(result.tier === 'red', `Expected red, got ${result.tier} (score: ${result.score})`)
  assert(result.score === 35, `Expected score 35, got ${result.score}`)
})

// ── Test 4: Both diva >= 7 → -15 divaDelta ────────────────────────────────
test('Both high-diva actors (>= 7) incur -15 divaDelta contribution', () => {
  const a = makeActor({
    id: 't4-a',
    stats: { rtScore: 80, cost: 1000000, divaRating: 8 },
    chemistryFactors: {
      originRegion: 'US-West', trainingLineage: [], actingEthos: 'intuitive',
      pastCollaborations: [], publicSentiment: 5, franchiseOverlap: [], ageBracket: 35,
    },
  })
  const b = makeActor({
    id: 't4-b',
    stats: { rtScore: 80, cost: 1000000, divaRating: 7 },
    chemistryFactors: {
      originRegion: 'UK', trainingLineage: [], actingEthos: 'intuitive',
      pastCollaborations: [], publicSentiment: 5, franchiseOverlap: [], ageBracket: 35,
    },
  })
  const result = calculatePairChemistry(a, b)
  const divaDelta = result.factors.find(f => f.name === 'divaDelta')
  assert(divaDelta.contribution === -15, `Expected -15, got ${divaDelta.contribution}`)
  assert(result.score === 45, `Expected score 45 (60-15), got ${result.score}`)
})

// ── Test 5: Method + technical → -12 ethosClash ───────────────────────────
test('Method + technical ethos pair incurs -12 ethosClash contribution', () => {
  const a = makeActor({
    id: 't5-a',
    chemistryFactors: {
      originRegion: 'US-West', trainingLineage: [], actingEthos: 'method',
      pastCollaborations: [], publicSentiment: 5, franchiseOverlap: [], ageBracket: 35,
    },
  })
  const b = makeActor({
    id: 't5-b',
    chemistryFactors: {
      originRegion: 'UK', trainingLineage: [], actingEthos: 'technical',
      pastCollaborations: [], publicSentiment: 5, franchiseOverlap: [], ageBracket: 35,
    },
  })
  const result = calculatePairChemistry(a, b)
  const ethos = result.factors.find(f => f.name === 'ethosClash')
  assert(ethos.contribution === -12, `Expected -12, got ${ethos.contribution}`)
  assert(result.score === 48, `Expected score 48 (60-12), got ${result.score}`)
})

// ── Test 6: Empty array → { overall: null, pairs: [] } ────────────────────
test('calculateEnsembleChemistry on empty array returns { overall: null, pairs: [] }', () => {
  const result = calculateEnsembleChemistry([])
  assert(result.overall === null, `Expected overall null, got ${result.overall}`)
  assert(Array.isArray(result.pairs) && result.pairs.length === 0, 'Expected empty pairs array')
})

// ── Test 7: 10-actor pool → 45 pairs (C(10,2)) ────────────────────────────
test('calculateEnsembleChemistry on 10-actor pool returns 45 pairs', () => {
  const pool = Array.from({ length: 10 }, (_, i) => makeActor({ id: `pool-${i}` }))
  const result = calculateEnsembleChemistry(pool)
  assert(result.pairs.length === 45, `Expected 45 pairs (C(10,2)), got ${result.pairs.length}`)
  assert(typeof result.overall === 'number', `Expected overall to be a number, got ${typeof result.overall}`)
})

// ── Summary ───────────────────────────────────────────────────────────────
console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
