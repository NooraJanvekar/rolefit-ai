import { useEffect, useState } from 'react'
import './App.css'
import Analyze from './Analyze.jsx'
import Landing from './Landing.jsx'
import Opportunities, { OpportunityDetail, OpportunityList } from './Opportunities.jsx'
import Profile from './Profile.jsx'
import { completion, titleOf } from './model.js'
import { Empty, Heading, Mark } from './components.jsx'

const storageKey = 'rolefit.workspace.v1'
const initial = { profile: {}, items: [], recent: [] }
const navigation = [
  ['overview', 'Overview', '⌂'], ['analyze', 'Analyze', '→'],
  ['opportunities', 'Opportunities', '▤'], ['profile', 'Career profile', '◎'],
]
const routeFromHash = () => window.location.hash.slice(1)

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey))
    return data?.profile && Array.isArray(data.items) ? { ...initial, ...data } : initial
  } catch {
    return initial
  }
}

function dateLabel(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value))
}

function Overview({ profile, items, recent, open }) {
  const [localDate] = useState(() => {
    const today = new Date()
    return new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  })
  const deadlines = items.filter((item) => item.deadline >= localDate && item.status !== 'Closed')
    .sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 4)
  const best = [...items].filter((item) => item.analysis.overall !== null)
    .sort((a, b) => b.analysis.overall - a.analysis.overall)[0]
  const completeness = completion(profile)
  return <>
    <Heading title="Your career workspace">A place to decide what to pursue and keep track of why.</Heading>
    <div className="overview-lead card"><div><h2>{profile.resumeText ? 'What are you considering next?' : 'Start with your career profile'}</h2>
      <p>{profile.resumeText ? 'Bring a posting and see how it lines up with what you want.' : 'Add your experience and priorities once, then use them to evaluate roles.'}</p>
      <a className="button primary" href={profile.resumeText ? '#analyze' : '#onboarding'}>{profile.resumeText ? 'Analyze a role' : 'Build your profile'} →</a></div>
      <div className="profile-meter"><span>Profile completeness</span><strong>{completeness}%</strong><progress aria-label="Profile completeness" max="100" value={completeness} /></div>
    </div>
    <div className="result-grid">
      <section className="card"><h2>Saved opportunities</h2><p className="metric">{items.length}</p><a href="#opportunities">View opportunities →</a></section>
      <section className="card"><h2>Highest alignment</h2><p className="metric">{best?.analysis.overall ?? '—'}</p>
        {best ? <a href={'#opportunities/' + best.id}>{titleOf(best)} →</a> : <p>Save an analyzed role to see it here.</p>}</section>
      <section className="card"><h2>Upcoming deadlines</h2>
        {deadlines.length ? <ul>{deadlines.map((item) => <li key={item.id}><a href={'#opportunities/' + item.id}>{titleOf(item)}</a> · {dateLabel(item.deadline)}</li>)}</ul>
          : <p>Deadlines appear here when you add them to a saved role.</p>}</section>
    </div>
    <section className="dashboard-recent"><h2>Recently analyzed</h2>
      {recent.length ? <OpportunityList items={recent} open={open} /> : <Empty title="Ready when you are"
        action={<a className="button" href="#analyze">Analyze a role</a>}>Your recent assessments will appear here.</Empty>}</section>
  </>
}

function App() {
  const [route, setRoute] = useState(routeFromHash)
  const [state, setState] = useState(load)
  const [collapsed, setCollapsed] = useState(false)
  const [storageError, setStorageError] = useState('')
  const [section, id] = route.split('/')
  const go = (destination) => { window.location.hash = destination }

  useEffect(() => {
    function onHashChange() {
      const next = routeFromHash()
      setRoute(next)
      if (next === 'how-it-works') requestAnimationFrame(() => document.getElementById(next)?.scrollIntoView())
      else {
        window.scrollTo(0, 0)
        requestAnimationFrame(() => document.getElementById('workspace-main')?.focus())
      }
    }
    function onStorage(event) {
      if (event.key === storageKey || event.key === null) setState(load())
    }
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  function persist(update) {
    try {
      const next = update(load())
      localStorage.setItem(storageKey, JSON.stringify(next))
      setState(next)
      setStorageError('')
      return true
    } catch {
      setStorageError('This browser could not save your changes. Check that browser storage is available and try again.')
      return false
    }
  }

  function save(item) {
    return persist((current) => ({ ...current, items: [item, ...current.items.filter((saved) => saved.id !== item.id)],
      recent: current.recent.map((recent) => recent.id === item.id ? item : recent) }))
  }

  function remove(itemId) {
    if (window.confirm('Delete this opportunity and its analysis from this browser?') &&
      persist((current) => ({ ...current, items: current.items.filter((item) => item.id !== itemId),
        recent: current.recent.filter((item) => item.id !== itemId) }))) go('opportunities')
  }

  function clear() {
    if (!window.confirm('Delete your profile, recent analyses, and saved opportunities from this browser?')) return
    try {
      localStorage.removeItem(storageKey)
      setState(initial)
      setStorageError('')
      go('overview')
    } catch {
      setStorageError('This browser could not delete your RoleFit data.')
    }
  }

  if (!section || section === 'how-it-works') return <Landing />
  const item = state.items.find((entry) => entry.id === id) ?? state.recent.find((entry) => entry.id === id)
  const open = (itemId) => go('opportunities/' + itemId)
  return <div className={collapsed ? 'workspace collapsed' : 'workspace'}>
    <aside className="sidebar">
      <div className="sidebar-top"><a className="brand" href="#" aria-label="RoleFit home"><Mark /><span className="nav-label">RoleFit</span></a>
        <button type="button" className="collapse-button" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>{collapsed ? '›' : '‹'}</button></div>
      <nav aria-label="Workspace">{navigation.map(([key, label, icon]) => <a href={'#' + key} key={key}
        aria-label={label} aria-current={section === key || (section === 'onboarding' && key === 'profile') ? 'page' : undefined}>
        <span aria-hidden="true" className="nav-icon">{icon}</span><span className="nav-label">{label}</span></a>)}</nav>
    </aside>
    <main className="workspace-main" id="workspace-main" tabIndex="-1">
      {storageError && <p className="error" role="alert">{storageError}</p>}
      {section === 'analyze' && <Analyze profile={state.profile} save={save}
        remember={(entry) => persist((current) => ({ ...current, recent: [entry, ...current.recent].slice(0, 8) }))} />}
      {(section === 'profile' || section === 'onboarding') && <Profile key={section} profile={state.profile}
        onboarding={section === 'onboarding'} clear={clear} save={(profile) => {
          const success = persist((current) => ({ ...current, profile }))
          if (success && section === 'onboarding') go('overview')
          return success
        }} />}
      {section === 'opportunities' && (id ? item
        ? <OpportunityDetail key={id} item={item} save={save} remove={remove} />
        : <Empty title="Opportunity unavailable" action={<a href="#opportunities">Return to opportunities</a>}>This opportunity isn’t in this browser.</Empty>
        : <Opportunities items={state.items} open={open} />)}
      {!['analyze', 'profile', 'onboarding', 'opportunities'].includes(section) &&
        <Overview {...state} open={open} />}
    </main>
  </div>
}

export default App
