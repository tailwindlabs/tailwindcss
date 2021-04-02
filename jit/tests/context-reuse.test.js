const path = require('path')
const process = require('child_process')
const { promisify } = require('util')
const exec = promisify(process.exec)

test('a build re-uses the context across multiple files with the same config', async () => {
  const filepath = path.resolve(__dirname, './context-reuse.worker.js')

  const { stdout } = await exec(`node ${filepath}`)

  const results = JSON.parse(stdout.trim())

  expect(results[0].activeContexts).toBe(1)
  expect(results[1].activeContexts).toBe(1)
  expect(results[2].activeContexts).toBe(1)
  expect(results[3].activeContexts).toBe(1)
})
