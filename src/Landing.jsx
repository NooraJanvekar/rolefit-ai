import { Mark } from './components.jsx'

const benefits = [
  ['See where you fit', 'Compare your experience with what the role asks for, with evidence you can review.'],
  ['Check what could hold you back', 'Spot eligibility requirements and figure out what you still need to ask.'],
  ['Keep track of what’s worth pursuing', 'Save the roles you’re considering and come back to your notes when it’s time to apply.'],
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
          <p className="kicker">Career decisions, made clearer</p>
          <h1>Find your<br /><em>next move.</em></h1>
          <p className="hero-description">See how an internship or early-career role fits your experience, your priorities, and where you want to go next.</p>
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
        <h2>Job titles only tell you so much.</h2>
        <p>RoleFit helps you work through the details that matter before you spend time applying.</p>
        <div className="benefits">{benefits.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
        <a className="button primary" href="#analyze">Analyze an opportunity <span aria-hidden="true">→</span></a>
      </div></section>
    </main>
    <footer className="wrap footer"><a href="#" className="brand"><Mark /> RoleFit</a><span>Clarity for your next career move.</span></footer>
  </div>
}
