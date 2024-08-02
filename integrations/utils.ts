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
export let js = dedent
export let json = dedent
export let yaml = dedent
export let txt = dedent

const REPO_ROOT = path.join(__dirname, '..')
const PUBLIC_PACKAGES = (await fs.readdir(path.join(REPO_ROOT, 'dist'))).map((name) =>
  name.replace('tailwindcss-', '@tailwindcss/').replace('.tgz', ''),
)

interface SpawnedProcess {
  dispose: () => void
  onStdout: (predicate: (message: string) => boolean) => Promise<void>
  onStderr: (predicate: (message: string) => boolean) => Promise<void>
}

interface ChildProcessOptions {
  cwd?: string
}

interface TestConfig {
  fs: {
    [filePath: string]: string
  }
}
interface TestContext {
  root: string
  exec(command: string, options?: ChildProcessOptions): Promise<string>
  spawn(command: string, options?: ChildProcessOptions): Promise<SpawnedProcess>
  getFreePort(): Promise<number>
  fs: {
    write(filePath: string, content: string): Promise<void>
    read(filePath: string): Promise<string>
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
        content = await overwriteVersionsInPackageJson(content)
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
      root,
      async exec(command: string, childProcessOptions: ChildProcessOptions = {}) {
        return execSync(command, {
          cwd: root,
          stdio: 'pipe',
          ...childProcessOptions,
        }).toString()
      },
      async spawn(command: string, childProcessOptions: ChildProcessOptions = {}) {
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
          ...childProcessOptions,
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
              console.log('Found actor for message!', { message })
              messages.splice(0, idx + 1)
              let actorIdx = actors.indexOf(next)
              actors.splice(actorIdx, 1)
              next.resolve()
              break
            }
          }
        }

        let stdout = ''
        let stderr = ''

        child.stdout.on('data', (result) => {
          console.log('on stdout.data', result.toString())
          stdout += result.toString()
          stdoutMessages.push(result.toString())
          notifyNext(stdoutActors, stdoutMessages)
        })
        child.stderr.on('data', (result) => {
          console.log('on stderr.data', result.toString())
          stderr += result.toString()
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
          console.log('stdout:', stdout)
          console.log('stderr:', stderr)
        })

        return {
          dispose,
          onStdout(predicate: (message: string) => boolean) {
            console.log('call onStdout')
            return new Promise<void>((resolve) => {
              stdoutActors.push({ predicate, resolve })
              notifyNext(stdoutActors, stdoutMessages)
            })
          },
          onStderr(predicate: (message: string) => boolean) {
            console.log('call onStderr')
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
        async read(filePath: string) {
          return await fs.readFile(path.join(root, filePath), 'utf8')
        },
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

async function overwriteVersionsInPackageJson(content: string): Promise<string> {
  let json = JSON.parse(content)

  // Resolve all workspace:^ versions to local tarballs
  ;['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach(
    (key) => {
      let dependencies = json[key] || {}
      for (let dependency in dependencies) {
        if (dependencies[dependency] === 'workspace:^') {
          dependencies[dependency] = resolveVersion(dependency)
        }
      }
    },
  )

  // Inject transitive dependency overwrite. This is necessary because
  // @tailwindcss/vite internally depends on a specific version of
  // @tailwindcss/oxide and we instead want to resolve it to the locally built
  // version.
  json.pnpm ||= {}
  json.pnpm.overrides ||= {}
  for (let pkg of PUBLIC_PACKAGES) {
    json.pnpm.overrides[pkg] = resolveVersion(pkg)
  }

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