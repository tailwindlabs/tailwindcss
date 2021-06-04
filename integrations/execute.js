let path = require('path')
let { spawn } = require('child_process')
let resolveToolRoot = require('./resolve-tool-root')

let runningProcessess = []

afterEach(() => {
  runningProcessess.splice(0).forEach((runningProcess) => runningProcess.stop())
})

module.exports = function $(command, options = {}) {
  let abortController = new AbortController()
  let cwd = resolveToolRoot()

  let args = command.split(' ')
  command = args.shift()
  command = command === 'node' ? command : path.resolve(cwd, 'node_modules', '.bin', command)

  let stdoutMessages = []
  let stderrMessages = []

  let stdoutActors = []
  let stderrActors = []

  function notifyNext(actors, messages) {
    if (actors.length <= 0) return
    let [next] = actors

    for (let [idx, message] of messages.entries()) {
      if (next.predicate(message)) {
        messages.splice(0, idx + 1)
        let actorIdx = actors.indexOf(next)
        actors.splice(actorIdx, 1)
        next.resolve()
        break
      }
    }
  }

  function notifyNextStdoutActor() {
    return notifyNext(stdoutActors, stdoutMessages)
  }

  function notifyNextStderrActor() {
    return notifyNext(stderrActors, stderrMessages)
  }

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
      stdoutMessages.push(data.toString())
      notifyNextStdoutActor()
      stdout += data
    })

    child.stderr.on('data', (data) => {
      stderrMessages.push(data.toString())
      notifyNextStderrActor()
      stderr += data
    })

    child.on('close', (code, signal) => {
      ;(signal === 'SIGTERM' ? resolve : code === 0 ? resolve : reject)({ code, stdout, stderr })
    })
  })

  runningProcessess.push(runningProcess)

  return Object.assign(runningProcess, {
    stop() {
      abortController.abort()
      return runningProcess
    },
    onStdout(predicate) {
      return new Promise((resolve) => {
        stdoutActors.push({ predicate, resolve })
        notifyNextStdoutActor()
      })
    },
    onStderr(predicate) {
      return new Promise((resolve) => {
        stderrActors.push({ predicate, resolve })
        notifyNextStderrActor()
      })
    },
  })
}
