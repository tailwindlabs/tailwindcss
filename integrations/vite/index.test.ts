import dedent from 'dedent'
import { execSync, spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import { platform, homedir, tmpdir } from 'node:os'
import path from 'node:path'
import { test as defaultTest, expect } from 'vitest'
import fastGlob from 'fast-glob'
import net from 'node:net'

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

function windowsify(content: string) {
  if (platform() === 'win32') {
    return content.replace(/\n/g, '\r\n')
  }
  return content
}

function stripTailwindComment(content: string) {
  return content.replace(/\/\*! tailwindcss .*? \*\//g, '').trim()
}

let css = dedent
let html = dedent
let ts = dedent
let json = dedent

function test(
  name: string,
  config: TestConfig,
  test: (context: TestContext) => Promise<void> | void,
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
        function resolveVersion(dependency: string) {
          let tarball = path.join(__dirname, '..', '..', 'dist', pkgToFilename(dependency))
          return `file:${tarball}`
        }

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

        // Inject transitive dependency overwrite
        json.pnpm = json.pnpm || {}
        json.pnpm.overrides = json.pnpm.overrides || {}
        json.pnpm.overrides['@tailwindcss/oxide'] = resolveVersion('@tailwindcss/oxide')

        content = JSON.stringify(json, null, 2)
      }

      let dir = path.dirname(full)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(full, windowsify(content))
    }

    try {
      execSync('pnpm install', { cwd: root })
    } catch (error: any) {
      console.error(error.stdout.toString())
      console.error(error.stderr.toString())
      throw error
    }

    function cleanup() {
      fs.rm(root, { recursive: true })
    }
    options.onTestFinished(cleanup)

    let context = {
      async exec(command: string) {
        return execSync(command, { cwd: root }).toString()
      },
      spawn(command: string) {
        const abortController = new AbortController()
        let child = spawn(command, {
          cwd: root,
          signal: abortController.signal,
          shell: true,
          env: {
            ...process.env,
          },
        })
        let stdout = '',
          stderr = ''
        child.stdout.on('data', (result) => {
          console.log(result.toString())
          stdout += result.toString()
        })
        child.stderr.on('data', (result) => {
          console.error(result.toString())
          stderr += result.toString()
        })
        child.on('error', (err) => {
          if (err.name !== 'AbortError') {
            throw err
          }
        })

        options.onTestFailed(() => {
          console.log(stdout)
          console.error(stderr)
        })
        options.onTestFinished(() => abortController.abort())
        return {
          dispose() {
            abortController.abort()
          },
        }
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

    await test(context)
  })
}
test.only = (
  name: string,
  config: TestConfig,
  testCallback: (context: TestContext) => Promise<void> | void,
) => {
  return test(name, config, testCallback, { only: true })
}

async function getPortFree(): Promise<number> {
  return new Promise((res) => {
    let srv = net.createServer()
    srv.listen(0, () => {
      let adress = srv.address()
      let port = adress === null || typeof adress === 'string' ? 5173 : adress.port
      srv.close((err) => res(port))
    })
  })
}

async function fetchCSS(port: number) {
  const start = Date.now()
  let error
  while (Date.now() - start < 5000) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    try {
      // We need to fetch the main index.html file to populate the list of
      // candidates.
      let body = await fetch(`http://localhost:${port}`)
      // Make sure the main request is garbage collected.
      body.blob()

      let response = await fetch(`http://localhost:${port}/src/index.css`, {
        headers: {
          Accept: 'text/css',
        },
      })
      if (response.status === 200) {
        return response.text()
      }
      console.log(response.status)
    } catch (e) {
      error = e
    }
  }
  throw error
}

function pkgToFilename(name: string) {
  return `${name.replace('@', '').replace('/', '-')}.tgz`
}

test(
  'builds with Vite',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^5.3.5"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'index.html': html`
        <head>
          <link rel="stylesheet" href="./src/index.css">
        </head>
        <body>
          <div class="underline m-2">Hello, world!</div>
        </body>
      `,
      'src/index.css': css`
        @import 'tailwindcss/theme' reference;
        @import 'tailwindcss/utilities';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm vite build')

    expect.assertions(2)
    for (let [path, content] of await fs.glob('dist/**/*.css')) {
      expect(path).toMatch(/\.css$/)
      expect(stripTailwindComment(content)).toMatchInlineSnapshot(
        `
        ".m-2 {
          margin: var(--spacing-2, .5rem);
        }

        .underline {
          text-decoration-line: underline;
        }"
      `,
      )
    }
  },
)

test(
  'works with Vite in dev mode',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^5.3.5"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'index.html': html`
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="underline m-2">Hello, world!</div>
        </body>
      `,
      'src/index.css': css`
        @import 'tailwindcss/theme' reference;
        @import 'tailwindcss/utilities';
      `,
    },
  },
  async ({ spawn }) => {
    let port = await getPortFree()
    spawn(`pnpm vite dev --port ${port}`)

    const css = await fetchCSS(port)

    expect(stripTailwindComment(css)).toMatchInlineSnapshot(
      `
      ".m-2 {
        margin: var(--spacing-2, 0.5rem);
      }
      .underline {
        text-decoration-line: underline;
      }"
    `,
    )
  },
)
