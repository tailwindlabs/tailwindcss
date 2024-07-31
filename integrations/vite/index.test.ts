import dedent from 'dedent'
import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import { platform, tmpdir } from 'node:os'
import path from 'node:path'
import { test as defaultTest, expect } from 'vitest'
import fastGlob from 'fast-glob'

interface TestConfig {
  fs: {
    [filePath: string]: string
  }
}
interface TestContext {
  root: string
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
) {
  return defaultTest(name, { timeout: 30000 }, async (options) => {
    let root = await fs.mkdtemp(path.join(tmpdir(), 'tailwind-integrations'))

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
      root,
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

function pkgToFilename(name: string) {
  return `${name.replace('@', '').replace('/', '-')}.tgz`
}

test(
  'builds with Vite',
  {
    fs: {
      'package.json': json`
        {
          "name": "vite-example",
          "private": true,
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
        // import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: {
            // cssMinify: false,
            // // Windows Vite builds don't work unless we manually rename the
            // // output HTML file.
            // rollupOptions: {
            //   input: { main: 'index.html' },
            //   output: { assetFileNames: 'assets/[name].[ext]' },
            // },
          },
          // plugins: [tailwindcss()],
        })
      `,
      'index.html': html`
        <head>
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
  async ({ root, fs }) => {
    execSync('pnpm vite dev', { cwd: root })

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
