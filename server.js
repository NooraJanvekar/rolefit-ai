import express from 'express'
import 'dotenv/config'
import { resolve } from 'node:path'
import { analyzeOpportunity } from './analysis.js'

const app = express()
const port = Number(process.env.PORT || 3001)
const host = process.env.HOST || '127.0.0.1'
const maxConcurrentAnalyses = 2
let activeAnalyses = 0
let windowStarted = 0
let requestsInWindow = 0

app.disable('x-powered-by')
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'RoleFit backend is running.',
  })
})

app.post('/api/analyze', async (req, res) => {
  const { resumeText, jobDescription, selectedPriorities } = req.body ?? {}

  if (typeof resumeText !== 'string' || !resumeText.trim()) {
    return res.status(400).json({
      error: 'Please add your resume or profile.',
    })
  }

  if (typeof jobDescription !== 'string' || !jobDescription.trim()) {
    return res.status(400).json({
      error: 'Please add the job description.',
    })
  }

  if (
    !Array.isArray(selectedPriorities) ||
    !selectedPriorities.every((priority) => typeof priority === 'string')
  ) {
    return res.status(400).json({
      error: 'Priorities must be a list of text values.',
    })
  }

  const { profile = {}, consent } = req.body
  if (resumeText.length > 16000 || jobDescription.length > 24000 ||
    selectedPriorities.length > 24 || selectedPriorities.some((item) => item.length > 100) ||
    !profile || typeof profile !== 'object' || Array.isArray(profile) ||
    Object.keys(profile).length > 12 || Object.values(profile).some((item) => typeof item !== 'string' || item.length > 1500)) {
    return res.status(400).json({ error: 'Shorten your inputs and try again.' })
  }

  if (consent !== true) {
    return res.status(400).json({ error: 'Confirm that your text can be sent to OpenAI.' })
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'Analysis is unavailable until the server has an OpenAI API key.' })
  }

  const now = Date.now()
  if (now - windowStarted >= 60000) {
    windowStarted = now
    requestsInWindow = 0
  }
  if (activeAnalyses >= maxConcurrentAnalyses || requestsInWindow >= 10) {
    return res.status(429).json({ error: 'Analysis is busy. Try again in a minute.' })
  }

  activeAnalyses += 1
  requestsInWindow += 1
  try {
    const analysis = await analyzeOpportunity({
      resumeText: resumeText.trim(), jobDescription: jobDescription.trim(), selectedPriorities, profile,
    })
    res.json({ analysis })
  } catch (error) {
    if (error.status === 429) {
      return res.status(429).json({ error: 'OpenAI has limited requests for now. Try again in a minute.' })
    }
    if (error.name === 'APIConnectionTimeoutError') {
      return res.status(504).json({ error: 'Analysis took too long. Try again or shorten the posting.' })
    }
    res.status(502).json({ error: 'Analysis could not be completed. Your draft is still here.' })
  } finally {
    activeAnalyses -= 1
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(resolve('dist')))
}

// Express requires four parameters for an error handler.
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Your text is too long. Please shorten it and try again.',
    })
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'The request could not be read. Please try again.',
    })
  }

  res.status(500).json({
    error: 'Something went wrong on the server. Please try again.',
  })
})

const server = app.listen(port, host, () => {
  console.log(`RoleFit backend: http://${host}:${port}`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use.`,
    )
  } else {
    console.error('Could not start the backend:', error.message)
  }

  process.exitCode = 1
})
