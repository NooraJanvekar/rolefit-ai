import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { once } from 'node:events'
import test from 'node:test'

test('health and analyze validation on the HTTP API', async (t) => {
  const reservation = createServer()
  reservation.listen(0, '127.0.0.1')
  await once(reservation, 'listening')
  const { port } = reservation.address()
  await new Promise((resolve) => reservation.close(resolve))
  const child = spawn(process.execPath, ['server.js'], {
    env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), OPENAI_API_KEY: '' },
    stdio: ['ignore', 'pipe', 'inherit'],
  })
  t.after(() => child.kill())
  await once(child.stdout, 'data', { signal: AbortSignal.timeout(5000) })
  const base = 'http://127.0.0.1:' + port
  const health = await fetch(base + '/api/health')
  assert.equal(health.status, 200)
  assert.equal(health.headers.get('cache-control'), 'no-store')
  const post = (body) => fetch(base + '/api/analyze', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  const body = { resumeText: 'Built dashboards', jobDescription: 'Build dashboards', selectedPriorities: [] }
  assert.equal((await post({ ...body, resumeText: '' })).status, 400)
  assert.equal((await post({ ...body, selectedPriorities: 'Product' })).status, 400)
  assert.equal((await post({ ...body, profile: { degree: [] } })).status, 400)
  assert.equal((await post(body)).status, 400)
  assert.equal((await post({ ...body, consent: true })).status, 503)
  assert.equal((await post({ ...body, jobDescription: 'a'.repeat(110000) })).status, 413)
})
