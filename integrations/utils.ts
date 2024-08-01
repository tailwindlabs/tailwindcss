import dedent from 'dedent'
import fastGlob from 'fast-glob'
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

interface TestConfig {
  fs: {
    [filePath: string]: string
  }
}
interface TestContext {
  exec: (command: string) => Promise<string>
  spawn: (command: string) => { dispose: () => void }
  fs: {
    glob: (pattern: string) => Promise<[string, string][]>
  }
}
type TestCallback = (context: TestContext) => Promise<void> | void

const REPO_ROOT = path.join(__dirname, '..')

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

    for (let [filename, content] of Object.entries(config.fs)) {
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
      spawn(command: string) {
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

        let dispose = () => {
          child.kill()

          let timer = setTimeout(
            () => rejectDisposal?.(new Error(`spawned proccess (${command}) did not exit in time`)),
            1000,
          )
          disposePromise.finally(() => clearTimeout(timer))
          return disposePromise
        }
        disposables.push(dispose)
        function onExit() {
          console.log(`spawned proccess (${command}) exited`)
          resolveDisposal?.()
        }

        let stdout = ''
        let stderr = ''
        child.stdout.on('data', (result) => (stdout += result.toString()))
        child.stderr.on('data', (result) => (stderr += result.toString()))
        child.on('exit', onExit)
        child.on('error', (error) => {
          if (error.name !== 'AbortError') {
            throw error
          }
        })

        options.onTestFailed(() => {
          console.log(stdout)
          console.error(stderr)
        })

        return { dispose }
      },
      fs: {
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

export async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    let server = net.createServer()
    server.listen(0, () => {
      let address = server.address()
      let port = address === null || typeof address === 'string' ? null : address.port

      server.close(() => {
        if (port === null) {
          reject(new Error(`Failed to get a free port: address is ${address}`))
        } else {
          resolve(port)
        }
      })
    })
  })
}

// Maps package names to their tarball filenames. See scripts/pack-packages.ts
// for more details.
function pkgToFilename(name: string) {
  return `${name.replace('@', '').replace('/', '-')}.tgz`
}

function overwriteVersionsInPackageJson(content: string): string {
  let json = JSON.parse(content)

  // Resolve all worksplace:^ versions to local tarballs
  ;['dependencies', 'devDependencies', 'peerDependencies'].forEach((key) => {
    let desp = json[key] || {}
    for (let dependecy in desp) {
      if (desp[dependecy] === 'workspace:^') {
        desp[dependecy] = resolveVersion(dependecy)
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
