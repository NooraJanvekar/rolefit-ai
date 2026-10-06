import { useState } from 'react'
import './App.css'

function App() {
  const priorities = [
    'Product',
    'TPM',
    'Strategy / Ops',
    'AI Exposure',
    'Startup',
    'Large Company',
    'Technical Depth',
    'Ownership',
    'California',
    'Texas',
    'Toronto',
    'Vancouver',
    'New York',
  ]

  const [selectedPriorities, setSelectedPriorities] = useState([])
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  const togglePriority = (priority) => {
    setSelectedPriorities((currentPriorities) => {
      if (currentPriorities.includes(priority)) {
        return currentPriorities.filter((item) => item !== priority)
      }

      return [...currentPriorities, priority]
    })
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">RoleFit AI</div>

        <button className="saved-button" type="button">
          Saved roles
        </button>
      </header>

      <main className="main-content">
        <section className="hero">
          <p className="eyebrow">CAREER DECISION TOOL</p>

          <h1>
            Find the roles that <span>actually</span> fit you.
          </h1>

          <p className="subtitle">
            Because job titles don't tell the whole story.
          </p>
        </section>

        <section className="input-grid">
          <div className="input-card">
            <div className="card-heading">
              <h2>Resume / Profile</h2>

              <p>
                Paste your resume, LinkedIn summary, or a short overview of
                your experience.
              </p>
            </div>

            <textarea
              placeholder="Paste your resume or profile here..."
              aria-label="Resume or profile"
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
            />

            <div className="character-count">
              {resumeText.length.toLocaleString()} characters
            </div>
          </div>

          <div className="input-card">
            <div className="card-heading">
              <h2>Job Description</h2>

              <p>
                Paste the role you're considering so we can compare it with
                your background.
              </p>
            </div>

            <textarea
              placeholder="Paste the job description here..."
              aria-label="Job description"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />

            <div className="character-count">
              {jobDescription.length.toLocaleString()} characters
            </div>
          </div>
        </section>

        <section className="preferences">
          <div className="preferences-heading">
            <h2>What matters to you?</h2>

            <p>
              Select a few priorities to personalize your analysis.
            </p>
          </div>

          <div className="chips">
            {priorities.map((priority) => (
              <button
                key={priority}
                type="button"
                className={
                  selectedPriorities.includes(priority)
                    ? 'chip selected'
                    : 'chip'
                }
                onClick={() => togglePriority(priority)}
              >
                {priority}
              </button>
            ))}
          </div>

          {selectedPriorities.length > 0 && (
            <p className="selection-summary">
              {selectedPriorities.length} selected
            </p>
          )}
        </section>

        <div className="cta-wrapper">
          <button
            type="button"
            className="analyze-button"
          >
            Analyze Fit
          </button>
        </div>

        <section className="results-placeholder">
          <h2>Analysis Results</h2>

          <p>
            Your personalized role-fit analysis will appear here.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App