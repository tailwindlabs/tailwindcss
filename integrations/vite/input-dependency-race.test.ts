import { candidate, css, fetchStyles, html, json, retryAssertion, test, ts } from '../utils'

test(
  'rebuilds when the input stylesheet changes before its dependency stat finishes',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^",
            "vite": "^7"
          }
        }
      `,
      'vite.config.ts': ts`
        import fs from 'node:fs/promises'
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        let stat = fs.stat
        let delayed = false
        fs.stat = async (...args) => {
          if (
            !delayed &&
            String(args[0]).endsWith('index.css') &&
            new Error().stack?.includes('addBuildDependency')
          ) {
            delayed = true
            await fs.writeFile('input-stat-delayed', 'yes')
            await new Promise((resolve) => setTimeout(resolve, 1500))
          }
          return stat(...args)
        }

        export default defineConfig({ plugins: [tailwindcss()] })
      `,
      'index.html': html`
        <link rel="stylesheet" href="./src/index.css" />
        <div class="text-brand"></div>
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @theme {
          --color-brand: red;
        }
      `,
    },
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn('pnpm vite dev')
    await process.onStdout((m) => m.includes('ready in'))

    let url = ''
    await process.onStdout((m) => {
      let match = /Local:\s*(http.*)\//.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    await retryAssertion(async () => {
      expect(await fetchStyles(url)).toContain('--color-brand: red')
    })
    expect(await fs.read('input-stat-delayed')).toBe('yes')

    await fs.write(
      'src/index.css',
      css`
        @import 'tailwindcss';
        @theme {
          --color-brand: blue;
        }
      `,
    )

    await retryAssertion(async () => {
      let styles = await fetchStyles(url)
      expect(styles).toContain(candidate`text-brand`)
      expect(styles).toContain('--color-brand: blue')
    })
  },
)
