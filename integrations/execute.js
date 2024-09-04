let fs = require('fs')
let path = require('path')
let { spawn } = require('child_process')
let resolveToolRoot = require('./resolve-tool-root')

let SHOW_OUTPUT = false

let runningProcesses = []

afterEach(() => {
  runningProcesses.splice(0).forEach((runningProcess) => runningProcess.stop())
})

function debounce(fn, ms) {
  let state = { timer: undefined }

  return (...args) => {
    if (state.timer) clearTimeout(state.timer)
    state.timer = setTimeout(() => fn(...args), ms)
  }
}

module.exports = function $(command, options = {}) {
  let abortController = new AbortController()
  let root = resolveToolRoot()
  let cwd = options.cwd ?? root

  let args = options.shell
    ? [command]
    : (() => {
        let args = command.trim().split(/\s+/)
        command = args.shift()
        command =
          command === 'node'
            ? command
            : (function () {
                let local = path.resolve(root, 'node_modules', '.bin', command)
                if (fs.existsSync(local)) {
                  return local
                }

                let hoisted = path.resolve(root, '..', '..', 'node_modules', '.bin', command)
                if (fs.existsSync(hoisted)) {
                  return hoisted
                }

                return `npx ${command}`
              })()
        return [command, args]
      })()

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

  let notifyNextStdoutActor = debounce(() => {
    return notifyNext(stdoutActors, stdoutMessages)
  }, 200)

  let notifyNextStderrActor = debounce(() => {
    return notifyNext(stderrActors, stderrMessages)
  }, 200)

  let runningProcess = new Promise((resolve, reject) => {
    let child = spawn(...args, {
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
    let combined = ''

    child.stdout.on('data', (data) => {
      if (SHOW_OUTPUT) {
        console.log(data.toString())
      }
      stdoutMessages.push(data.toString())
      notifyNextStdoutActor()
      stdout += data
      combined += data
    })

    child.stderr.on('data', (data) => {
      if (SHOW_OUTPUT) {
        console.error(data.toString())
      }
      stderrMessages.push(data.toString())
      notifyNextStderrActor()
      stderr += data
      combined += data
    })

    child.on('error', (err) => {
      if (err.name !== 'AbortError') {
        throw err
      }
    })

    child.on('close', (code, signal) => {
      ;(signal === 'SIGTERM' ? resolve : code === 0 ? resolve : reject)({
        code,
        stdout,
        stderr,
        combined,
      })
    })
  })

  runningProcesses.push(runningProcess)

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
