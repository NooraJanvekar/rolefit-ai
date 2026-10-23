import { useState } from 'react'
import './App.css'
import ResultsPreview from './ResultsPreview.jsx'

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

function App() {
  const [selectedPriorities, setSelectedPriorities] = useState([])
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [receipt, setReceipt] = useState(null)

  const clearFeedback = () => {
    setError('')
    setReceipt(null)
  }

  const togglePriority = (priority) => {
    clearFeedback()

    setSelectedPriorities((currentPriorities) => {
      if (currentPriorities.includes(priority)) {
        return currentPriorities.filter((item) => item !== priority)
      }

      return [...currentPriorities, priority]
    })
  }

  const handleAnalyze = async () => {
    if (isLoading) return

    clearFeedback()

    if (!resumeText.trim() && !jobDescription.trim()) {
      setError('Please add your resume and the job description.')
      return
    }

    if (!resumeText.trim()) {
      setError('Please add your resume or profile.')
      return
    }

    if (!jobDescription.trim()) {
      setError('Please add the job description.')
      return
    }

    setIsLoading(true)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          selectedPriorities,
        }),
        signal: controller.signal,
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          data?.error ||
            'The request failed. Check that your updated backend is running.',
        )
      }

      if (
        !data?.received ||
        typeof data.received.resumeCharacters !== 'number' ||
        typeof data.received.jobDescriptionCharacters !== 'number' ||
        !Array.isArray(data.received.priorities) ||
        !data.received.priorities.every(
          (priority) => typeof priority === 'string',
        )
      ) {
        throw new Error('The server returned an unexpected response.')
      }

      setReceipt(data.received)
    } catch (requestError) {
      if (requestError.name === 'AbortError') {
        setError(
          'The request took too long. Check that your backend is running and try again.',
        )
      } else if (requestError instanceof TypeError) {
        setError(
          'Could not reach the backend. Check that both terminals are running.',
        )
      } else {
        setError(
          requestError.message || 'Something went wrong. Please try again.',
        )
      }
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }
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
              disabled={isLoading}
              onChange={(event) => {
                setResumeText(event.target.value)
                clearFeedback()
              }}
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
              disabled={isLoading}
              onChange={(event) => {
                setJobDescription(event.target.value)
                clearFeedback()
              }}
            />

            <div className="character-count">
              {jobDescription.length.toLocaleString()} characters
            </div>
          </div>
        </section>

        <section className="preferences">
          <div className="preferences-heading">
            <h2>What matters to you?</h2>

            <p>Select a few priorities to personalize your analysis.</p>
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
                aria-pressed={selectedPriorities.includes(priority)}
                disabled={isLoading}
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
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Analyze Fit'}
          </button>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </div>

        <div aria-live="polite" aria-busy={isLoading}>
          {isLoading && (
            <section className="results-placeholder">
              <p>Sending your inputs...</p>
            </section>
          )}

          {receipt && (
            <section className="results-placeholder">
              <h2>Backend connection successful</h2>

              <p>Your resume, job description, and priorities were received.</p>

              <p>
                Resume: {receipt.resumeCharacters.toLocaleString()} characters
                {' · '}
                Job description:{' '}
                {receipt.jobDescriptionCharacters.toLocaleString()} characters
              </p>

              <p>
                Priorities:{' '}
                {receipt.priorities.length > 0
                  ? receipt.priorities.join(', ')
                  : 'None selected'}
              </p>

              <p>
                This confirms the connection. AI analysis is not connected yet.
              </p>
            </section>
          )}
        </div>

        {receipt ? (
          <ResultsPreview />
        ) : (
          !isLoading && (
            <section className="results-placeholder">
              <h2>Analysis Results</h2>

              <p>
                Your personalized role-fit analysis will appear here.
              </p>
            </section>
          )
        )}
      </main>
    </div>
  )
}

export default App