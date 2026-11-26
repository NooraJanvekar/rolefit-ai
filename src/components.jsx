import { priorities } from './model.js'
export function Mark() {
  return <span className="mark" aria-hidden="true"><i /><i /><i /></span>
}

export function Heading({ title, children }) {
  return <header className="page-heading"><h1>{title}</h1>{children && <p>{children}</p>}</header>
}

export function Field({ label, value = '', onChange, type = 'text', limit = 1500, required, placeholder }) {
  const props = { value, onChange: (event) => onChange(event.target.value), maxLength: limit, required, placeholder }
  return <label className={type === 'textarea' ? 'field wide' : 'field'}>{label}
    {type === 'textarea' ? <textarea {...props} /> : <input {...props} type={type} />}
  </label>
}

export function Empty({ title, children, action }) {
  return <div className="card empty"><h2>{title}</h2><p>{children}</p>{action}</div>
}

export function Priorities({ value = [], onChange }) {
  return <fieldset className="priorities"><legend>Career priorities</legend><div className="chips">
    {priorities.map((item) => <button key={item} type="button" aria-pressed={value.includes(item)}
      onClick={() => onChange(value.includes(item) ? value.filter((priority) => priority !== item) : [...value, item])}>{item}</button>)}
  </div></fieldset>
}
