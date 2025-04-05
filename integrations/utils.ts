import dedent from 'dedent'
import fastGlob from 'fast-glob'
import { exec, spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import { platform, tmpdir } from 'node:os'
import path from 'node:path'
import { stripVTControlCharacters } from 'node:util'
import { test as defaultTest, type ExpectStatic } from 'vitest'
import { escape } from '../packages/tailwindcss/src/utils/escape'

const REPO_ROOT = path.join(__dirname, '..')
const PUBLIC_PACKAGES = (await fs.readdir(path.join(REPO_ROOT, 'dist'))).map((name) =>
  name.replace('tailwindcss-', '@tailwindcss/').replace('.tgz', ''),
)

interface SpawnedProcess {
  dispose: () => void
  flush: () => void
  onStdout: (predicate: (message: string) => boolean) => Promise<void>
  onStderr: (predicate: (message: string) => boolean) => Promise<void>
}

interface ChildProcessOptions {
  cwd?: string
  env?: Record<string, string>
}

interface ExecOptions {
  ignoreStdErr?: boolean
  stdin?: string
}

interface TestConfig {
  fs: {
    [filePath: string]: string | Uint8Array
  }

  installDependencies?: boolean
}
interface TestContext {
  root: string
  expect: ExpectStatic
  exec(command: string, options?: ChildProcessOptions, execOptions?: ExecOptions): Promise<string>
  spawn(command: string, options?: ChildProcessOptions): Promise<SpawnedProcess>
  fs: {
    write(filePath: string, content: string, encoding?: BufferEncoding): Promise<void>
    create(filePaths: string[]): Promise<void>
    read(filePath: string): Promise<string>
    glob(pattern: string): Promise<[string, string][]>
    dumpFiles(pattern: string): Promise<string>
    expectFileToContain(
      filePath: string,
      contents: string | RegExp | (string | RegExp)[],
    ): Promise<void>
    expectFileNotToContain(filePath: string, contents: string | string[]): Promise<void>
  }
}
type TestCallback = (context: TestContext) => Promise<void> | void
interface TestFlags {
  only?: boolean
  skip?: boolean
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
  { only = false, skip = false, debug = false }: TestFlags = {},
) {
  return defaultTest(
    name,
    {
      timeout: TEST_TIMEOUT,
      retry: process.env.CI ? 2 : 0,
      only: only || (!process.env.CI && debug),
      skip,
      concurrent: true,
    },
    async (options) => {
      const rootDir = debug ? path.join(REPO_ROOT, '.debug') : TMP_ROOT
      await fs.mkdir(rootDir, { recursive: true })

      const root = await fs.mkdtemp(path.join(rootDir, 'tailwind-integrations'))

      if (debug) {
        console.log('Running test in debug mode. File system will be written to:')
        console.log(root)
        console.log()
      }

      const context = {
        root,
        expect: options.expect,
        async exec(
          command: string,
          childProcessOptions: ChildProcessOptions = {},
          execOptions: ExecOptions = {},
        ) {
          const cwd = childProcessOptions.cwd ?? root
          if (debug && cwd !== root) {
            let relative = path.relative(root, cwd)
            if (relative[0] !== '.') relative = `./${relative}`
            console.log(`> cd ${relative}`)
          }
          if (debug) console.log(`> ${command}`)
          return new Promise((resolve, reject) => {
            const child = exec(
              command,
              {
                cwd,
                ...childProcessOptions,
                env: childProcessOptions.env,
              },
              (error, stdout, stderr) => {
                if (error) {
                  if (execOptions.ignoreStdErr !== true) console.error(stderr)
                  if (only || debug) {
                    console.error(stdout)
                  }
                  reject(error)
                } else {
                  if (only || debug) {
                    console.log(stdout.toString() + '\n\n' + stderr.toString())
                  }
                  resolve(stdout.toString() + '\n\n' + stderr.toString())
                }
              },
            )
            if (execOptions.stdin) {
              child.stdin?.write(execOptions.stdin)
              child.stdin?.end()
            }
          })
        },
        async spawn(command: string, childProcessOptions: ChildProcessOptions = {}) {
          let resolveDisposal: (() => void) | undefined
          let rejectDisposal: ((error: Error) => void) | undefined
          const disposePromise = new Promise<void>((resolve, reject) => {
            resolveDisposal = resolve
            rejectDisposal = reject
          })

          const cwd = childProcessOptions.cwd ?? root
          if (debug && cwd !== root) {
            let relative = path.relative(root, cwd)
            if (relative[0] !== '.') relative = `./${relative}`
            console.log(`> cd ${relative}`)
          }
          if (debug) console.log(`>& ${command}`)
          const child = spawn(command, {
            cwd,
            shell: true,
            ...childProcessOptions,
            env: {
              ...process.env,
              ...childProcessOptions.env,
            },
          })

          function dispose() {
            if (!child.kill()) {
              child.kill('SIGKILL')
            }

            const timer = setTimeout(
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

          const stdoutMessages: string[] = []
          const stderrMessages: string[] = []

          const stdoutActors: SpawnActor[] = []
          const stderrActors: SpawnActor[] = []

          function notifyNext(actors: SpawnActor[], messages: string[]) {
            if (actors.length <= 0) return
            const [next] = actors

            for (const [idx, message] of messages.entries()) {
              if (next.predicate(message)) {
                messages.splice(0, idx + 1)
                const actorIdx = actors.indexOf(next)
                actors.splice(actorIdx, 1)
                next.resolve()
                break
              }
            }
          }

          const combined: ['stdout' | 'stderr', string][] = []

          child.stdout.on('data', (result) => {
            const content = result.toString()
            if (debug || only) console.log(content)
            combined.push(['stdout', content])
            for (const line of content.split('\n')) {
              stdoutMessages.push(stripVTControlCharacters(line))
            }
            notifyNext(stdoutActors, stdoutMessages)
          })
          child.stderr.on('data', (result) => {
            const content = result.toString()
            if (debug || only) console.error(content)
            combined.push(['stderr', content])
            for (const line of content.split('\n')) {
              stderrMessages.push(stripVTControlCharacters(line))
            }
            notifyNext(stderrActors, stderrMessages)
          })
          child.on('exit', onExit)
          child.on('error', (error) => {
            if (error.name !== 'AbortError') {
              throw error
            }
          })

          options.onTestFailed(() => {
            // In only or debug mode, messages are logged to the console
            // immediately.
            if (only || debug) return

            for (const [type, message] of combined) {
              if (type === 'stdout') {
                console.log(message)
              } else {
                console.error(message)
              }
            }
          })

          return {
            dispose,
            flush() {
              stdoutActors.splice(0)
              stderrActors.splice(0)

              stdoutMessages.splice(0)
              stderrMessages.splice(0)
            },
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
        fs: {
          async write(
            filename: string,
            content: string | Uint8Array,
            encoding: BufferEncoding = 'utf8',
          ): Promise<void> {
            const full = path.join(root, filename)
            const dir = path.dirname(full)
            await fs.mkdir(dir, { recursive: true })

            if (typeof content !== 'string') {
              return await fs.writeFile(full, content)
            }

            if (filename.endsWith('package.json')) {
              content = await overwriteVersionsInPackageJson(content)
            }

            // Ensure that files written on Windows use \r\n line ending
            if (IS_WINDOWS) {
              content = content.replace(/\n/g, '\r\n')
            }

            await fs.writeFile(full, content, encoding)
          },

          async create(filenames: string[]): Promise<void> {
            for (const filename of filenames) {
              const full = path.join(root, filename)

              const dir = path.dirname(full)
              await fs.mkdir(dir, { recursive: true })
              await fs.writeFile(full, '')
            }
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
            const files = await fastGlob(pattern, { cwd: root })
            return Promise.all(
              files.map(async (file) => {
                const content = await fs.readFile(path.join(root, file), 'utf8')
                return [
                  file,
                  // Drop license comment
                  content.replace(/[\s\n]*\/\*![\s\S]*?\*\/[\s\n]*/g, ''),
                ]
              }),
            )
          },
          async dumpFiles(pattern: string) {
            const files = await context.fs.glob(pattern)
            return `\n${files
              .slice()
              .sort((a: [string], z: [string]) => {
                const aParts = a[0].split('/')
                const zParts = z[0].split('/')

                const aFile = aParts.at(-1)
                const zFile = zParts.at(-1)

                // Sort by depth, shallow first
                if (aParts.length < zParts.length) return -1
                if (aParts.length > zParts.length) return 1

                // Sort by folder names, alphabetically
                for (let i = 0; i < aParts.length - 1; i++) {
                  const diff = aParts[i].localeCompare(zParts[i])
                  if (diff !== 0) return diff
                }

                // Sort by filename, sort files named `index` before others
                if (aFile?.startsWith('index') && !zFile?.startsWith('index')) return -1
                if (zFile?.startsWith('index') && !aFile?.startsWith('index')) return 1

                // Sort by filename, alphabetically
                return a[0].localeCompare(z[0])
              })
              .map(([file, content]) => `--- ${file} ---\n${content || '<EMPTY>'}`)
              .join('\n\n')
              .trim()}\n`
          },
          async expectFileToContain(filePath, contents) {
            return retryAssertion(async () => {
              const fileContent = await this.read(filePath)
              for (const content of Array.isArray(contents) ? contents : [contents]) {
                if (content instanceof RegExp) {
                  options.expect(fileContent).toMatch(content)
                } else {
                  options.expect(fileContent).toContain(content)
                }
              }
            })
          },
          async expectFileNotToContain(filePath, contents) {
            return retryAssertion(async () => {
              const fileContent = await this.read(filePath)
              for (const content of contents) {
                options.expect(fileContent).not.toContain(content)
              }
            })
          },
        },
      } satisfies TestContext

      config.fs['.gitignore'] ??= txt`
        node_modules/
      `

      for (const [filename, content] of Object.entries(config.fs)) {
        await context.fs.write(filename, content)
      }

      const shouldInstallDependencies = config.installDependencies ?? true

      try {
        // In debug mode, the directory is going to be inside the pnpm workspace
        // of the tailwindcss package. This means that `pnpm install` will run
        // pnpm install on the workspace instead (expect if the root dir defines
        // a separate workspace). We work around this by using the
        // `--ignore-workspace` flag.
        if (shouldInstallDependencies) {
          const ignoreWorkspace = debug && !config.fs['pnpm-workspace.yaml']
          await context.exec(`pnpm install${ignoreWorkspace ? ' --ignore-workspace' : ''}`)
        }
      } catch (error: any) {
        console.error(error)
        console.error(error.stdout?.toString())
        console.error(error.stderr?.toString())
        throw error
      }

      const disposables: (() => Promise<void>)[] = []

      async function dispose() {
        await Promise.all(disposables.map((dispose) => dispose()))

        if (!debug) {
          await gracefullyRemove(root)
        }
      }

      options.onTestFinished(dispose)

      // Make it a git repository, and commit all files
      if (only || debug) {
        try {
          await context.exec('git init', { cwd: root })
          await context.exec('git add --all', { cwd: root })
          await context.exec('git commit -m "before migration"', { cwd: root })
        } catch (error: any) {
          console.error(error)
          console.error(error.stdout?.toString())
          console.error(error.stderr?.toString())
          throw error
        }
      }

      return await testCallback(context)
    },
  )
}
test.only = (name: string, config: TestConfig, testCallback: TestCallback) => {
  return test(name, config, testCallback, { only: true })
}
test.skip = (name: string, config: TestConfig, testCallback: TestCallback) => {
  return test(name, config, testCallback, { skip: true })
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
  const json = JSON.parse(content)

  // Resolve all workspace:^ versions to local tarballs
  for (const key of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ]) {
    const dependencies = json[key] || {}
    for (const dependency in dependencies) {
      if (dependencies[dependency] === 'workspace:^') {
        dependencies[dependency] = resolveVersion(dependency)
      }
    }
  }

  // Inject transitive dependency overwrite. This is necessary because
  // @tailwindcss/vite internally depends on a specific version of
  // @tailwindcss/oxide and we instead want to resolve it to the locally built
  // version.
  json.pnpm ||= {}
  json.pnpm.overrides ||= {}
  for (const pkg of PUBLIC_PACKAGES) {
    if (pkg === 'tailwindcss') {
      // We want to be explicit about the `tailwindcss` package so our tests can
      // also import v3 without conflicting v4 tarballs.
      json.pnpm.overrides['@tailwindcss/node>tailwindcss'] = resolveVersion(pkg)
      json.pnpm.overrides['@tailwindcss/upgrade>tailwindcss'] = resolveVersion(pkg)
      json.pnpm.overrides['@tailwindcss/cli>tailwindcss'] = resolveVersion(pkg)
      json.pnpm.overrides['@tailwindcss/postcss>tailwindcss'] = resolveVersion(pkg)
      json.pnpm.overrides['@tailwindcss/vite>tailwindcss'] = resolveVersion(pkg)
    } else {
      json.pnpm.overrides[pkg] = resolveVersion(pkg)
    }
  }

  return JSON.stringify(json, null, 2)
}

function resolveVersion(dependency: string) {
  const tarball = path.join(REPO_ROOT, 'dist', pkgToFilename(dependency))
  return `file:${tarball}`
}

export function stripTailwindComment(content: string) {
  return content.replace(/\/\*! tailwindcss .*? \*\//g, '').trim()
}

export let svg = dedent
export let css = dedent
export let html = dedent
export let ts = dedent
export let js = dedent
export let jsx = dedent
export let json = dedent
export let yaml = dedent
export let txt = dedent

export function binary(str: string | TemplateStringsArray, ...values: unknown[]): Uint8Array {
  const base64 = typeof str === 'string' ? str : String.raw(str, ...values)

  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}

export function candidate(strings: TemplateStringsArray, ...values: any[]) {
  const output: string[] = []
  for (let i = 0; i < strings.length; i++) {
    output.push(strings[i])
    if (i < values.length) {
      output.push(values[i])
    }
  }

  return `.${escape(output.join('').trim())}`
}

export async function retryAssertion<T>(
  fn: () => Promise<T>,
  { timeout = ASSERTION_TIMEOUT, delay = 5 }: { timeout?: number; delay?: number } = {},
) {
  const end = Date.now() + timeout
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

export async function fetchStyles(base: string, path = '/'): Promise<string> {
  while (base.endsWith('/')) {
    base = base.slice(0, -1)
  }

  const index = await fetch(`${base}${path}`)
  const html = await index.text()

  const linkRegex = /<link rel="stylesheet" href="([a-zA-Z0-9\/_\.\?=%-]+)"/gi
  const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi

  const stylesheets: string[] = []

  const paths: string[] = []
  for (const match of html.matchAll(linkRegex)) {
    let path: string = match[1]
    if (path.startsWith('./')) {
      path = path.slice(1)
    }
    paths.push(path)
  }
  stylesheets.push(
    ...(await Promise.all(
      paths.map(async (path) => {
        const css = await fetch(`${base}${path}`, {
          headers: {
            Accept: 'text/css',
          },
        })
        return await css.text()
      }),
    )),
  )

  for (const match of html.matchAll(styleRegex)) {
    stylesheets.push(match[1])
  }

  return stylesheets.reduce((acc, css) => {
    return acc + '\n' + css
  }, '')
}

async function gracefullyRemove(dir: string) {
  // Skip removing the directory in CI because it can stall on Windows
  if (!process.env.CI) {
    await fs.rm(dir, { recursive: true, force: true }).catch((error) => {
      console.log(`Failed to remove ${dir}`, error)
    })
  }
}
