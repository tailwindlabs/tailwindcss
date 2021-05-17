let path = require('path')
let { spawn } = require('child_process')
let resolveToolRoot = require('./resolve-tool-root')

let runningProcessess = []

afterEach(() => {
  runningProcessess.splice(0).forEach((abort) => abort())
})

module.exports = function $(command, options = {}) {
  let abortController = new AbortController()
  let cwd = resolveToolRoot()

  let args = command.split(' ')
  command = args.shift()
  command = path.resolve(cwd, 'node_modules', '.bin', command)

  let runningProcess = new Promise((resolve, reject) => {
    let child = spawn(command, args, {
      ...options,
      env: {
        ...process.env,
        ...options.env,
      },
      signal: abortController.signal,
      cwd,
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data
    })

    child.stderr.on('data', (data) => {
      stderr += data
    })

    child.on('close', (code, signal) => {
      ;(signal === 'SIGTERM' ? resolve : code === 0 ? resolve : reject)({ code, stdout, stderr })
    })
  })

  runningProcessess.push(() => {
    abortController.abort()
  })

  return Object.assign(runningProcess, {
    stop() {
      abortController.abort()
      return runningProcess
    },
  })
}
