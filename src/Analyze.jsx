import { opportunityFields } from './model.js'
import { useEffect, useRef, useState } from 'react'
import { Field, Heading, Priorities } from './components.jsx'
import Results from './ResultsPreview.jsx'

export function OpportunityFields({ values, update }) {
  return <div className="form-grid">{opportunityFields.map(([key, label, type]) => <Field
    key={key} label={label} type={type} value={values[key]} onChange={(value) => update(key, value)} />)}</div>
}

function validDeadline(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return ''
  const date = new Date(value)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value ? value : ''
}

export default function Analyze({ profile, save, remember }) {
  const [draft, setDraft] = useState({})
  const [resumeText, setResumeText] = useState(profile.resumeText ?? '')
  const [priorities, setPriorities] = useState(profile.priorities ?? [])
  const [consent, setConsent] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const result = useRef(null)
  const activeRequest = useRef(null)
  useEffect(() => () => activeRequest.current?.abort(), [])
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))

  async function submit(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    setAnalysis(null)
    setSaved(false)
    const controller = new AbortController()
    activeRequest.current = controller
    try {
      const { resumeText: _resume, priorities: _priorities, ...background } = profile
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription: draft.description, selectedPriorities: priorities, profile: background, consent }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(42000)]),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.analysis) throw new Error(data.error || 'Analysis is unavailable. Try again shortly.')
      if (controller.signal.aborted) return
      const inferred = data.analysis.details
      const opportunity = {
        ...draft,
        title: draft.title || inferred.title,
        company: draft.company || inferred.company,
        location: draft.location || inferred.location,
        deadline: draft.deadline || validDeadline(inferred.deadline),
        id: crypto.randomUUID(), dateAdded: new Date().toISOString(), status: 'Considering', notes: '',
      }
      setDraft(opportunity)
      setAnalysis(data.analysis)
      remember({ ...opportunity, analysis: data.analysis })
      requestAnimationFrame(() => result.current?.focus())
    } catch (failure) {
      if (controller.signal.aborted) return
      setError(failure.name === 'TimeoutError' ? 'Analysis took too long. Your draft is still here.' : failure.message)
    } finally {
      activeRequest.current = null
      if (!controller.signal.aborted) setBusy(false)
    }
  }

  return <>
    <Heading title="Analyze a role">See how an opportunity fits your experience, what you want next, and what you need to verify.</Heading>
    <form onSubmit={submit} className="stack">
      <fieldset className="stack form-shell" disabled={busy}>
        <section className="card"><h2>The opportunity</h2>
          <OpportunityFields values={draft} update={update} />
          <Field label="Job description" type="textarea" required limit={24000} value={draft.description}
            onChange={(value) => { update('description', value); setAnalysis(null) }}
            placeholder="Paste the responsibilities and requirements from the posting." />
        </section>
        <section className="card"><h2>Your background</h2>
          <Field label="Resume or profile" type="textarea" required limit={16000} value={resumeText}
            onChange={(value) => { setResumeText(value); setAnalysis(null) }}
            placeholder="Paste your resume or share a short overview of your experience." />
          <Priorities value={priorities} onChange={(value) => { setPriorities(value); setAnalysis(null) }} />
        </section>
        <section className="card consent">
          <label><input type="checkbox" checked={consent} required onChange={(event) => setConsent(event.target.checked)} />
            I agree to send this posting, my resume, and my career profile to OpenAI for analysis. I can remove contact details before submitting.
          </label>
          <button className="primary">{busy ? 'Analyzing role…' : analysis ? 'Run analysis again' : 'Analyze fit'}</button>
          <div role="status">{busy && 'Reviewing the posting against your background and priorities.'}</div>
          {error && <p className="error" role="alert">{error}</p>}
        </section>
      </fieldset>
    </form>
    {analysis && <div className="result-block" tabIndex="-1" ref={result}>
      <div className="actions"><h2>Your analysis</h2>
        <button className="primary" disabled={saved} onClick={() => setSaved(save({ ...draft, analysis }))}>{saved ? 'Opportunity saved' : 'Save opportunity'}</button>
      </div>
      <Results analysis={analysis} />
    </div>}
  </>
}
