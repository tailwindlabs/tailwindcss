import dedent from 'dedent'
import fastGlob from 'fast-glob'
import killPort from 'kill-port'
import { execSync, spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import net from 'node:net'
import { homedir, platform, tmpdir } from 'node:os'
import path from 'node:path'
import { test as defaultTest } from 'vitest'

export let css = dedent
export let html = dedent
export let ts = dedent
export let json = dedent

const REPO_ROOT = path.join(__dirname, '..')

interface SpawnedProcess {
  dispose: () => void
  onStdout: (predicate: (message: string) => boolean) => Promise<void>
  onStderr: (predicate: (message: string) => boolean) => Promise<void>
}

interface TestConfig {
  fs: {
    [filePath: string]: string
  }
}
interface TestContext {
  exec(command: string): Promise<string>
  spawn(command: string): Promise<SpawnedProcess>
  getFreePort(): Promise<number>
  fs: {
    write(filePath: string, content: string): Promise<void>
    glob(pattern: string): Promise<[string, string][]>
  }
}
type TestCallback = (context: TestContext) => Promise<void> | void

type SpawnActor = { predicate: (message: string) => boolean; resolve: () => void }

export function test(
  name: string,
  config: TestConfig,
  testCallback: TestCallback,
  { only = false } = {},
) {
  return (only ? defaultTest.only : defaultTest)(name, { timeout: 30000 }, async (options) => {
    let root = await fs.mkdtemp(
      // On Windows CI, tmpdir returns a path containing a weird RUNNER~1 folder
      // that apparently causes the vite builds to not work.
      path.join(
        process.env.CI && platform() === 'win32' ? homedir() : tmpdir(),
        'tailwind-integrations',
      ),
    )

    async function write(filename: string, content: string): Promise<void> {
      let full = path.join(root, filename)

      if (filename.endsWith('package.json')) {
        content = overwriteVersionsInPackageJson(content)
      }

      // Ensure that files written on Windows use \r\n line ending
      if (platform() === 'win32') {
        content = content.replace(/\n/g, '\r\n')
      }

      let dir = path.dirname(full)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(full, content)
    }

    for (let [filename, content] of Object.entries(config.fs)) {
      await write(filename, content)
    }

    try {
      execSync('pnpm install', { cwd: root })
    } catch (error: any) {
      console.error(error.stdout.toString())
      console.error(error.stderr.toString())
      throw error
    }

    let disposables: (() => Promise<void>)[] = []
    async function dispose() {
      await Promise.all(disposables.map((dispose) => dispose()))
      await fs.rm(root, { recursive: true, maxRetries: 3, force: true })
    }
    options.onTestFinished(dispose)

    let context = {
      async exec(command: string) {
        return execSync(command, { cwd: root }).toString()
      },
      async spawn(command: string) {
        let resolveDisposal: (() => void) | undefined
        let rejectDisposal: ((error: Error) => void) | undefined
        let disposePromise = new Promise<void>((resolve, reject) => {
          resolveDisposal = resolve
          rejectDisposal = reject
        })

        let child = spawn(command, {
          cwd: root,
          shell: true,
          env: {
            ...process.env,
          },
        })

        function dispose() {
          child.kill()

          let timer = setTimeout(
            () => rejectDisposal?.(new Error(`spawned process (${command}) did not exit in time`)),
            1000,
          )
          disposePromise.finally(() => clearTimeout(timer))
          return disposePromise
        }
        disposables.push(dispose)
        function onExit() {
          resolveDisposal?.()
        }

        let stdoutMessages: string[] = []
        let stderrMessages: string[] = []

        let stdoutActors: SpawnActor[] = []
        let stderrActors: SpawnActor[] = []

        function notifyNext(actors: SpawnActor[], messages: string[]) {
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

        child.stdout.on('data', (result) => {
          stdoutMessages.push(result.toString())
          notifyNext(stdoutActors, stdoutMessages)
        })
        child.stderr.on('data', (result) => {
          stderrMessages.push(result.toString())
          notifyNext(stderrActors, stderrMessages)
        })
        child.on('exit', onExit)
        child.on('error', (error) => {
          if (error.name !== 'AbortError') {
            throw error
          }
        })

        options.onTestFailed(() => {
          stdoutMessages.map((message) => console.log(message))
          stderrMessages.map((message) => console.error(message))
        })

        return {
          dispose,
          onStdout(predicate: (message: string) => boolean) {
            return new Promise<void>((resolve) => {
              stdoutActors.push({ predicate, resolve })
              notifyNext(stdoutActors, stdoutMessages)
            })
          },
          onStderr(predicate: (message: string) => boolean) {
            return new Promise<void>((resolve) => {
              stderrActors.push({ predicate, resolve })
              notifyNext(stderrActors, stderrMessages)
            })
          },
        }
      },
      async getFreePort(): Promise<number> {
        return new Promise((resolve, reject) => {
          let server = net.createServer()
          server.listen(0, () => {
            let address = server.address()
            let port = address === null || typeof address === 'string' ? null : address.port

            server.close(() => {
              if (port === null) {
                reject(new Error(`Failed to get a free port: address is ${address}`))
              } else {
                disposables.push(async () => {
                  // Wait for 10ms in case the process was just killed
                  await new Promise((resolve) => setTimeout(resolve, 10))

                  // kill-port uses `lsof` on macOS which is expensive and can
                  // block for multiple seconds. In order to avoid that for a
                  // server that is no longer running, we check if the port is
                  // still in use first.
                  let isPortTaken = await testIfPortTaken(port)
                  if (!isPortTaken) {
                    return
                  }

                  await killPort(port)
                })
                resolve(port)
              }
            })
          })
        })
      },
      fs: {
        write,
        async glob(pattern: string) {
          let files = await fastGlob(pattern, { cwd: root })
          return Promise.all(
            files.map(async (file) => {
              let content = await fs.readFile(path.join(root, file), 'utf8')
              return [file, content]
            }),
          )
        },
      },
    } satisfies TestContext

    await testCallback(context)
  })
}
test.only = (name: string, config: TestConfig, testCallback: TestCallback) => {
  return test(name, config, testCallback, { only: true })
}

// Maps package names to their tarball filenames. See scripts/pack-packages.ts
// for more details.
function pkgToFilename(name: string) {
  return `${name.replace('@', '').replace('/', '-')}.tgz`
}

function overwriteVersionsInPackageJson(content: string): string {
  let json = JSON.parse(content)

  // Resolve all workspace:^ versions to local tarballs
  ;['dependencies', 'devDependencies', 'peerDependencies'].forEach((key) => {
    let dependencies = json[key] || {}
    for (let dependency in dependencies) {
      if (dependencies[dependency] === 'workspace:^') {
        dependencies[dependency] = resolveVersion(dependency)
      }
    }
  })

  // Inject transitive dependency overwrite. This is necessary because
  // @tailwindcss/vite internally depends on a specific version of
  // @tailwindcss/oxide and we instead want to resolve it to the locally built
  // version.
  json.pnpm ||= {}
  json.pnpm.overrides ||= {}
  json.pnpm.overrides['@tailwindcss/oxide'] = resolveVersion('@tailwindcss/oxide')

  return JSON.stringify(json, null, 2)
}

function resolveVersion(dependency: string) {
  let tarball = path.join(REPO_ROOT, 'dist', pkgToFilename(dependency))
  return `file:${tarball}`
}

export function stripTailwindComment(content: string) {
  return content.replace(/\/\*! tailwindcss .*? \*\//g, '').trim()
}

function testIfPortTaken(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    let client = new net.Socket()
    client.once('connect', () => {
      resolve(true)
      client.end()
    })
    client.once('error', (error: any) => {
      if (error.code !== 'ECONNREFUSED') {
        resolve(true)
      } else {
        resolve(false)
      }
      client.end()
    })
    client.connect({ port: port, host: 'localhost' })
  })
}
