import assert from 'node:assert/strict'
import test from 'node:test'
import { scoreAnalysis } from '../analysis.js'

const input = {
  resumeText: 'Built an analytics dashboard',
  jobDescription: 'Build an analytics dashboard',
  selectedPriorities: [],
}
function example() {
  const dimension = {
    rating: 'strong', confidence: 'high', explanation: 'The work aligns.',
    evidence: [{ profile: 'analytics dashboard', posting: 'analytics dashboard' }], gaps: [],
  }
  return {
    summary: 'Relevant experience', details: { title: '', company: '', location: '', deadline: '' },
    skills: structuredClone(dimension), experience: structuredClone(dimension), career: structuredClone(dimension),
    eligibility: [], recommendations: [],
  }
}

test('weights the three alignment dimensions separately from eligibility', () => {
  const value = example()
  value.experience.rating = 'partial'
  value.career.rating = 'limited'
  value.eligibility.push({ requirement: 'Graduation', status: 'Confirmed blocker', evidence: 'Dates differ.' })
  const result = scoreAnalysis(value, input)
  assert.equal(result.overall, 70)
  assert.equal(result.coveredWeight, 100)
  assert.equal(result.eligibility[0].status, 'Confirmed blocker')
  const prioritized = scoreAnalysis(value, { ...input, selectedPriorities: ['Ownership'] })
  assert.equal(prioritized.overall, 60)
  assert.equal(prioritized.scores.career.weight, 35)
})

test('discards unsupported quotes and reports coverage for grounded signals', () => {
  const value = example()
  value.skills.evidence[0].profile = 'Invented experience'
  value.career.rating = 'unclear'
  const result = scoreAnalysis(value, input)
  assert.equal(result.scores.skills.score, null)
  assert.equal(result.scores.career.score, null)
  assert.deepEqual(result.skills.evidence, [])
  assert.equal(result.coveredWeight, 40)
})

test('reports no score when every dimension lacks evidence', () => {
  const value = example()
  for (const key of ['skills', 'experience', 'career']) value[key].evidence = []
  const result = scoreAnalysis(value, input)
  assert.equal(result.overall, null)
  assert.equal(result.coveredWeight, 0)
})

test('rejects malformed structured output', () => {
  const value = example()
  value.skills.rating = 'excellent'
  assert.throws(() => scoreAnalysis(value, input), /Invalid analysis format/)
})
