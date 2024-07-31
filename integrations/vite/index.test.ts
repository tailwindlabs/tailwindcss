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
  return content.replace(/\/\*! tailwindcss .*? \*\//g, '')
}

const css = dedent
const html = dedent
const ts = dedent
const json = dedent

function test(
  name: string,
  config: TestConfig,
  test: (context: TestContext) => Promise<void> | void,
) {
  return defaultTest(name, { timeout: 30000 }, async (options) => {
    let root = await fs.mkdtemp(path.join(tmpdir(), 'tailwind-integrations'))

    for (let [filename, content] of Object.entries(config.fs)) {
      let full = path.join(root, filename)
      let dir = path.dirname(full)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(full, windowsify(content))
    }

    execSync('pnpm install', { cwd: root })

    function cleanup() {
      fs.rm(root, { recursive: true })
    }
    options.onTestFinished(cleanup)

    const context = {
      root,
      fs: {
        async glob(pattern: string) {
          let files = await fastGlob(pattern, { cwd: root })
          return Promise.all(
            files.map(async (file) => {
              let content = await fs.readFile(path.join(root, file), 'utf8')
              return [file, content.trim()]
            }),
          )
        },
      },
    } satisfies TestContext

    await test(context)
  })
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
            "@tailwindcss/vite": "4.0.0-alpha.18",
            "tailwindcss": "4.0.0-alpha.18"
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
          build: {
            cssMinify: false,
            // Windows Vite builds don't work unless we manually rename the
            // output HTML file.
            rollupOptions: {
              input: { main: 'index.html' },
              output: { assetFileNames: 'assets/[name].[ext]' },
            },
          },
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
  async ({ root, fs }) => {
    execSync('pnpm vite build', { cwd: root })

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
