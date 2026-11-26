import { titleOf } from './model.js'
import { useState } from 'react'
import { Field, Empty, Heading } from './components.jsx'
import { OpportunityFields } from './Analyze.jsx'
import Results from './ResultsPreview.jsx'

const statuses = ['Considering', 'Applied', 'Interviewing', 'Closed']

function postingLink(value) {
  if (!value) return null
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}
function Status({ value, onChange, all }) {
  return <label className="field">Status
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {all && <option value="">All statuses</option>}
      {statuses.map((status) => <option key={status}>{status}</option>)}
    </select>
  </label>
}

export function OpportunityList({ items, open }) {
  return <ul className="opportunity-list">{items.map((item) => <li key={item.id}>
    <button type="button" onClick={() => open(item.id)}><span><strong>{titleOf(item)}</strong>
      <small>{[item.company, item.location, item.status].filter(Boolean).join(' · ')}</small></span>
      <span className="row-score">{item.analysis.overall ?? '—'} <span aria-hidden="true">→</span></span></button>
  </li>)}</ul>
}

export default function Opportunities({ items, open }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [order, setOrder] = useState('recent')
  const filtered = items.filter((item) => (!status || item.status === status)
    && [item.title, item.company, item.location, item.notes].join(' ').toLowerCase().includes(query.trim().toLowerCase()))
  filtered.sort((a, b) => {
    if (order === 'fit') return (b.analysis.overall ?? -1) - (a.analysis.overall ?? -1)
    if (order === 'deadline') return (a.deadline || '9999').localeCompare(b.deadline || '9999')
    return b.dateAdded.localeCompare(a.dateAdded)
  })
  return <>
    <Heading title="Saved opportunities">Keep track of the roles you’re considering, what stood out, and what you still need to check.</Heading>
    {items.length ? <>
      <div className="card form-grid filters">
        <Field label="Search opportunities" type="search" value={query} onChange={setQuery} />
        <Status value={status} onChange={setStatus} all />
        <label className="field">Sort by<select value={order} onChange={(event) => setOrder(event.target.value)}>
          <option value="recent">Recently saved</option><option value="fit">Highest alignment</option><option value="deadline">Application deadline</option>
        </select></label>
      </div>
      {filtered.length ? <OpportunityList items={filtered} open={open} /> : <Empty title="No matching opportunities">Try a different search or status.</Empty>}
    </> : <Empty title="No saved opportunities" action={<a className="button primary" href="#analyze">Analyze a role</a>}>Save a role after analysis to keep its assessment and your notes together.</Empty>}
  </>
}

export function OpportunityDetail({ item, save, remove }) {
  const [draft, setDraft] = useState(item)
  const source = postingLink(item.url)
  const [message, setMessage] = useState('')
  const update = (key, value) => {
    setMessage('')
    setDraft((current) => ({ ...current, [key]: value }))
  }
  return <>
    <a className="back" href="#opportunities">← Saved opportunities</a>
    <Heading title={titleOf(item)}>{[item.company, item.location].filter(Boolean).join(' · ')}</Heading>
    <form className="card stack" onSubmit={(event) => {
      event.preventDefault()
      if (save(draft)) setMessage('Changes saved.')
    }}>
      <h2>Opportunity details</h2>
      {source && <a className="source-link" href={source} target="_blank" rel="noreferrer">Open original posting (new tab)</a>}
      <OpportunityFields values={draft} update={update} />
      <Status value={draft.status} onChange={(value) => update('status', value)} />
      <Field label="Personal notes" type="textarea" value={draft.notes} onChange={(value) => update('notes', value)} />
      <div className="actions"><button className="primary">Save changes</button>
        <button type="button" className="danger" onClick={() => remove(item.id)}>Delete opportunity</button>
        <span role="status">{message}</span></div>
    </form>
    <details className="card posting"><summary>Original job description</summary><p>{item.description}</p></details>
    <Results analysis={item.analysis} />
  </>
}
