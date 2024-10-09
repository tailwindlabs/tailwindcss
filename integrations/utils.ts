import dedent from 'dedent'
import fastGlob from 'fast-glob'
import killPort from 'kill-port'
import { exec, spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import net from 'node:net'
import { platform, tmpdir } from 'node:os'
import path from 'node:path'
import { test as defaultTest, expect } from 'vitest'

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

interface ExecOptions {
  ignoreStdErr?: boolean
}

interface TestConfig {
  fs: {
    [filePath: string]: string
  }
}
interface TestContext {
  root: string
  exec(command: string, options?: ChildProcessOptions, execOptions?: ExecOptions): Promise<string>
  spawn(command: string, options?: ChildProcessOptions): Promise<SpawnedProcess>
  getFreePort(): Promise<number>
  fs: {
    write(filePath: string, content: string): Promise<void>
    read(filePath: string): Promise<string>
    glob(pattern: string): Promise<[string, string][]>
    expectFileToContain(
      filePath: string,
      contents: string | string[] | RegExp | RegExp[],
    ): Promise<void>
    expectFileNotToContain(filePath: string, contents: string | string[]): Promise<void>
  }
}
type TestCallback = (context: TestContext) => Promise<void> | void
interface TestFlags {
  only?: boolean
  debug?: boolean
}

type SpawnActor = { predicate: (message: string) => boolean; resolve: () => void }

const IS_WINDOWS = platform() === 'win32'

const TEST_TIMEOUT = IS_WINDOWS ? 120000 : 60000
const ASSERTION_TIMEOUT = IS_WINDOWS ? 10000 : 5000

// On Windows CI, tmpdir returns a path containing a weird RUNNER~1 folder that
// apparently causes the vite builds to not work.
const TMP_ROOT =
  process.env.CI && IS_WINDOWS ? path.dirname(process.env.GITHUB_WORKSPACE!) : tmpdir()

export function test(
  name: string,
  config: TestConfig,
  testCallback: TestCallback,
  { only = false, debug = false }: TestFlags = {},
) {
  return (only || (!process.env.CI && debug) ? defaultTest.only : defaultTest)(
    name,
    { timeout: TEST_TIMEOUT, retry: debug ? 0 : 3 },
    async (options) => {
      let rootDir = debug ? path.join(REPO_ROOT, '.debug') : TMP_ROOT
      await fs.mkdir(rootDir, { recursive: true })

      let root = await fs.mkdtemp(path.join(rootDir, 'tailwind-integrations'))

      if (debug) {
        console.log('Running test in debug mode. File system will be written to:')
        console.log(root)
        console.log()
      }

      let context = {
        root,
        async exec(
          command: string,
          childProcessOptions: ChildProcessOptions = {},
          execOptions: ExecOptions = {},
        ) {
          let cwd = childProcessOptions.cwd ?? root
          if (debug && cwd !== root) {
            let relative = path.relative(root, cwd)
            if (relative[0] !== '.') relative = `./${relative}`
            console.log(`> cd ${relative}`)
          }
          if (debug) console.log(`> ${command}`)
          return new Promise((resolve, reject) => {
            exec(
              command,
              {
                cwd,
                ...childProcessOptions,
              },
              (error, stdout, stderr) => {
                if (error) {
                  if (execOptions.ignoreStdErr !== true) console.error(stderr)
                  reject(error)
                } else {
                  resolve(stdout.toString())
                }
              },
            )
          })
        },
        async spawn(command: string, childProcessOptions: ChildProcessOptions = {}) {
          let resolveDisposal: (() => void) | undefined
          let rejectDisposal: ((error: Error) => void) | undefined
          let disposePromise = new Promise<void>((resolve, reject) => {
            resolveDisposal = resolve
            rejectDisposal = reject
          })

          let cwd = childProcessOptions.cwd ?? root
          if (debug && cwd !== root) {
            let relative = path.relative(root, cwd)
            if (relative[0] !== '.') relative = `./${relative}`
            console.log(`> cd ${relative}`)
          }
          if (debug) console.log(`>& ${command}`)
          let child = spawn(command, {
            cwd,
            shell: true,
            env: {
              ...process.env,
            },
            ...childProcessOptions,
          })

          function dispose() {
            child.kill()

            let timer = setTimeout(
              () =>
                rejectDisposal?.(new Error(`spawned process (${command}) did not exit in time`)),
              ASSERTION_TIMEOUT,
            )
            disposePromise.finally(() => {
              clearTimeout(timer)
            })
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

          let combined: ['stdout' | 'stderr', string][] = []

          child.stdout.on('data', (result) => {
            let content = result.toString()
            if (debug) console.log(content)
            combined.push(['stdout', content])
            stdoutMessages.push(content)
            notifyNext(stdoutActors, stdoutMessages)
          })
          child.stderr.on('data', (result) => {
            let content = result.toString()
            if (debug) console.error(content)
            combined.push(['stderr', content])
            stderrMessages.push(content)
            notifyNext(stderrActors, stderrMessages)
          })
          child.on('exit', onExit)
          child.on('error', (error) => {
            if (error.name !== 'AbortError') {
              throw error
            }
          })

          options.onTestFailed(() => {
            // In debug mode, messages are logged to the console immediately
            if (debug) return

            for (let [type, message] of combined) {
              if (type === 'stdout') {
                console.log(message)
              } else {
                console.error(message)
              }
            }
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

                    try {
                      await killPort(port)
                    } catch {
                      // If the process can not be killed, we can't do anything
                    }
                  })
                  resolve(port)
                }
              })
            })
          })
        },
        fs: {
          async write(filename: string, content: string): Promise<void> {
            let full = path.join(root, filename)

            if (filename.endsWith('package.json')) {
              content = await overwriteVersionsInPackageJson(content)
            }

            // Ensure that files written on Windows use \r\n line ending
            if (IS_WINDOWS) {
              content = content.replace(/\n/g, '\r\n')
            }

            let dir = path.dirname(full)
            await fs.mkdir(dir, { recursive: true })
            await fs.writeFile(full, content)
          },
          async read(filePath: string) {
            let content = await fs.readFile(path.resolve(root, filePath), 'utf8')

            // Ensure that files read on Windows have \r\n line endings removed
            if (IS_WINDOWS) {
              content = content.replace(/\r\n/g, '\n')
            }

            return content
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
          async expectFileToContain(filePath, contents) {
            return retryAssertion(async () => {
              let fileContent = await this.read(filePath)
              for (let content of Array.isArray(contents) ? contents : [contents]) {
                if (content instanceof RegExp) {
                  expect(fileContent).toMatch(content)
                } else {
                  expect(fileContent).toContain(content)
                }
              }
            })
          },
          async expectFileNotToContain(filePath, contents) {
            return retryAssertion(async () => {
              let fileContent = await this.read(filePath)
              for (let content of contents) {
                expect(fileContent).not.toContain(content)
              }
            })
          },
        },
      } satisfies TestContext

      config.fs['.gitignore'] ??= txt`
        node_modules/
      `

      for (let [filename, content] of Object.entries(config.fs)) {
        await context.fs.write(filename, content)
      }

      try {
        // In debug mode, the directory is going to be inside the pnpm workspace
        // of the tailwindcss package. This means that `pnpm install` will run
        // pnpm install on the workspace instead (expect if the root dir defines
        // a separate workspace). We work around this by using the
        // `--ignore-workspace` flag.
        let ignoreWorkspace = debug && !config.fs['pnpm-workspace.yaml']
        await context.exec(`pnpm install${ignoreWorkspace ? ' --ignore-workspace' : ''}`)
      } catch (error: any) {
        console.error(error)
        console.error(error.stdout?.toString())
        console.error(error.stderr?.toString())
        throw error
      }

      let disposables: (() => Promise<void>)[] = []

      async function dispose() {
        await Promise.all(disposables.map((dispose) => dispose()))

        if (!debug) {
          await gracefullyRemove(root)
        }
      }

      options.onTestFinished(dispose)

      return await testCallback(context)
    },
  )
}
test.only = (name: string, config: TestConfig, testCallback: TestCallback) => {
  return test(name, config, testCallback, { only: true })
}
test.debug = (name: string, config: TestConfig, testCallback: TestCallback) => {
  return test(name, config, testCallback, { debug: true })
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

export let css = dedent
export let html = dedent
export let ts = dedent
export let js = dedent
export let json = dedent
export let yaml = dedent
export let txt = dedent

export function candidate(strings: TemplateStringsArray, ...values: any[]) {
  let output: string[] = []
  for (let i = 0; i < strings.length; i++) {
    output.push(strings[i])
    if (i < values.length) {
      output.push(values[i])
    }
  }

  return `.${escape(output.join('').trim())}`
}

// https://drafts.csswg.org/cssom/#serialize-an-identifier
export function escape(value: string) {
  if (arguments.length == 0) {
    throw new TypeError('`CSS.escape` requires an argument.')
  }
  var string = String(value)
  var length = string.length
  var index = -1
  var codeUnit
  var result = ''
  var firstCodeUnit = string.charCodeAt(0)

  if (
    // If the character is the first character and is a `-` (U+002D), and
    // there is no second character, […]
    length == 1 &&
    firstCodeUnit == 0x002d
  ) {
    return '\\' + string
  }

  while (++index < length) {
    codeUnit = string.charCodeAt(index)
    // Note: there’s no need to special-case astral symbols, surrogate
    // pairs, or lone surrogates.

    // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
    // (U+FFFD).
    if (codeUnit == 0x0000) {
      result += '\uFFFD'
      continue
    }

    if (
      // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
      // U+007F, […]
      (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
      codeUnit == 0x007f ||
      // If the character is the first character and is in the range [0-9]
      // (U+0030 to U+0039), […]
      (index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      // If the character is the second character and is in the range [0-9]
      // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
      (index == 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit == 0x002d)
    ) {
      // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
      result += '\\' + codeUnit.toString(16) + ' '
      continue
    }

    // If the character is not handled by one of the above rules and is
    // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
    // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
    // U+005A), or [a-z] (U+0061 to U+007A), […]
    if (
      codeUnit >= 0x0080 ||
      codeUnit == 0x002d ||
      codeUnit == 0x005f ||
      (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
      (codeUnit >= 0x0061 && codeUnit <= 0x007a)
    ) {
      // the character itself
      result += string.charAt(index)
      continue
    }

    // Otherwise, the escaped character.
    // https://drafts.csswg.org/cssom/#escape-a-character
    result += '\\' + string.charAt(index)
  }
  return result
}

export async function retryAssertion<T>(
  fn: () => Promise<T>,
  { timeout = ASSERTION_TIMEOUT, delay = 5 }: { timeout?: number; delay?: number } = {},
) {
  let end = Date.now() + timeout
  let error: any
  while (Date.now() < end) {
    try {
      return await fn()
    } catch (err) {
      error = err
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw error
}

export async function fetchStyles(port: number, path = '/'): Promise<string> {
  let index = await fetch(`http://localhost:${port}${path}`)
  let html = await index.text()

  let linkRegex = /<link rel="stylesheet" href="([a-zA-Z0-9\/_\.\?=%-]+)"/gi
  let styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi

  let stylesheets: string[] = []

  let paths: string[] = []
  for (let match of html.matchAll(linkRegex)) {
    let path: string = match[1]
    if (path.startsWith('./')) {
      path = path.slice(1)
    }
    paths.push(path)
  }
  stylesheets.push(
    ...(await Promise.all(
      paths.map(async (path) => {
        let css = await fetch(`http://localhost:${port}${path}`, {
          headers: {
            Accept: 'text/css',
          },
        })
        return await css.text()
      }),
    )),
  )

  for (let match of html.matchAll(styleRegex)) {
    stylesheets.push(match[1])
  }

  return stylesheets.reduce((acc, css) => {
    return acc + '\n' + css
  }, '')
}

async function gracefullyRemove(dir: string) {
  // Skip removing the directory in CI because it can stall on Windows
  if (!process.env.CI) {
    await fs.rm(dir, { recursive: true, force: true })
  }
}

async function dirExists(dir: string): Promise<boolean> {
  try {
    return await fs.stat(dir).then((stat) => stat.isDirectory())
  } catch {
    return false
  }
}
