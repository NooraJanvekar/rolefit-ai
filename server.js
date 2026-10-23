import express from 'express'
import 'dotenv/config'

const app = express()
const port = 3001

app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'RoleFit backend is running.',
  })
})

app.post('/api/analyze', (req, res) => {
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

  res.json({
    message: 'Your inputs reached the backend successfully.',
    received: {
      resumeCharacters: resumeText.trim().length,
      jobDescriptionCharacters: jobDescription.trim().length,
      priorities: selectedPriorities,
    },
  })
})

// Express requires four parameters for an error handler.
app.use((err, req, res, next) => {
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

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`RoleFit backend: http://127.0.0.1:${port}`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      'Port 3001 is already in use. Stop the older backend terminal with Control + C, then try again.',
    )
  } else {
    console.error('Could not start the backend:', error.message)
  }

  process.exitCode = 1
})