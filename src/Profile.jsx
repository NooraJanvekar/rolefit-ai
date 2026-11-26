import { sections } from './model.js'
import { useState } from 'react'
import { Field, Heading, Priorities } from './components.jsx'

export default function Profile({ profile, onboarding, save, clear }) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState(profile)
  const [message, setMessage] = useState('')
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  return <>
    <Heading title={onboarding ? sections[step].title : 'Career profile'}>
      {onboarding ? 'Start with what you know. You can come back and fill in the rest anytime.' : 'Keep your experience and priorities up to date so they’re ready the next time you find a role.'}
    </Heading>
    {onboarding && <div className="progress-row"><span>Step {step + 1} of {sections.length}</span>
      <progress aria-label="Profile setup progress" value={step + 1} max={sections.length} /></div>}
    <form className="stack" onSubmit={(event) => {
      event.preventDefault()
      if (onboarding && step < sections.length - 1) {
        setStep(step + 1)
      } else if (save(draft)) {
        setMessage('Profile saved.')
      }
    }}>
      {(onboarding ? [sections[step]] : sections).map(({ title, fields }) => <section className="card" key={title}>
        {!onboarding && <h2>{title}</h2>}
        <div className="form-grid">{fields.map(([key, label, type]) => <Field key={key}
          label={label} type={type} value={draft[key]} limit={key === 'resumeText' ? 16000 : 1500}
          onChange={(value) => update(key, value)} />)}</div>
        {title === sections[1].title && <Priorities value={draft.priorities} onChange={(value) => update('priorities', value)} />}
      </section>)}
      <div className="actions">
        <button className="primary">{onboarding && step < sections.length - 1 ? 'Continue' : 'Save profile'}</button>
        {onboarding && step > 0 && <button type="button" onClick={() => setStep(step - 1)}>Back</button>}
        {onboarding && <button type="button" onClick={() => save(draft)}>Finish later</button>}
        <span role="status">{message}</span>
      </div>
    </form>
    <section className="card privacy">
      <h2>Your data</h2><p>Your profile and opportunities are saved in this browser. Anyone with access to this browser profile may be able to access them.</p>
      <button type="button" className="danger" onClick={clear}>Delete all RoleFit data</button>
    </section>
  </>
}
