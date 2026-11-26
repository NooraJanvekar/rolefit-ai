import { Mark } from './components.jsx'

const benefits = [
  ['Where does my experience fit?', 'See which parts of your experience line up with the posting and where you might need a stronger example.'],
  ['Am I eligible?', 'Check requirements like graduation dates and work authorization, and flag anything you need to confirm.'],
  ['What should I do next?', 'Save the roles you want to come back to, along with your notes and the application deadline.'],
]

export default function Landing() {
  return <div className="landing">
    <header className="landing-nav wrap">
      <a href="#" className="brand"><Mark /> RoleFit<span className="brand-ai"> AI</span></a>
      <nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a className="button" href="#overview">Open workspace <span aria-hidden="true">→</span></a></nav>
    </header>
    <main id="main">
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="kicker">For internships and early-career roles</p>
          <h1>Find your<br /><em>next move.</em></h1>
          <p className="hero-description">You found a role that looks interesting. Now figure out how it fits your experience, what you want to learn, and what you’d need to check before applying.</p>
          <div className="actions"><a className="button primary" href="#onboarding">Build your profile <span aria-hidden="true">→</span></a>
            <a className="text-link" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a></div>
        </div>
        <figure className="hero-visual" aria-labelledby="preview-label">
          <div className="preview-card">
            <div className="preview-top"><span className="preview-icon" aria-hidden="true">→</span><div><strong>Product Intern</strong><small>Illustrative analysis</small></div></div>
            <div className="preview-alignment"><div><small>Overall alignment</small><strong>Strong fit</strong></div><span className="preview-ring" aria-hidden="true">✓</span></div>
            <div className="preview-details">
              <div><span>Skills alignment</span><strong>Strong</strong></div>
              <div><span>Experience alignment</span><strong>Partial</strong></div>
              <div><span>Career alignment</span><strong>Strong</strong></div>
            </div>
            <div className="preview-check"><span aria-hidden="true">◇</span><div><strong>Verify eligibility</strong><small>Confirm the required graduation window.</small></div></div>
          </div>
          <figcaption id="preview-label">A look at a RoleFit assessment</figcaption>
        </figure>
      </section>
      <section className="how" id="how-it-works"><div className="wrap">
        <h2>Is this role worth applying to?</h2>
        <p>Start with your profile and a job posting. RoleFit helps you answer the questions I kept coming back to during my own internship search.</p>
        <div className="benefits">{benefits.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
        <a className="button primary" href="#analyze">Analyze an opportunity <span aria-hidden="true">→</span></a>
      </div></section>
    </main>
    <footer className="wrap footer"><a href="#" className="brand"><Mark /> RoleFit</a><span>Clarity for your next career move.</span></footer>
  </div>
}
