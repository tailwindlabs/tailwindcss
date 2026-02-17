import { candidate, css, fetchStyles, html, js, json, retryAssertion, test, ts } from '../utils'

test(
  'dev mode',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "astro": "^4.15.2",
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          }
        }
      `,
      'astro.config.mjs': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'astro/config'

        // https://astro.build/config
        export default defineConfig({
          vite: { plugins: [tailwindcss()] },
          build: { inlineStylesheets: 'never' },
        })
      `,
      'src/pages/index.astro': html`
       <div class="underline">Hello, world!</div>

        <style is:global>
          @import 'tailwindcss';
        </style>
      `,
    },
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn('pnpm astro dev')
    await process.onStdout((m) => m.includes('ready in'))

    let url = ''
    await process.onStdout((m) => {
      let match = /Local\s*(http.*)\//.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    await process.onStdout((m) => m.includes('watching for file changes'))

    await retryAssertion(async () => {
      let css = await fetchStyles(url)
      expect(css).toContain(candidate`underline`)
    })

    await retryAssertion(async () => {
      await fs.write(
        'src/pages/index.astro',
        html`
          <div class="underline font-bold">Hello, world!</div>

          <style is:global>
            @import 'tailwindcss';
          </style>
      `,
      )

      let css = await fetchStyles(url)
      expect(css).toContain(candidate`underline`)
      expect(css).toContain(candidate`font-bold`)
    })
  },
)

test(
  'build mode',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "astro": "^4.15.2",
            "react": "^19",
            "react-dom": "^19",
            "@astrojs/react": "^4",
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          }
        }
      `,
      'astro.config.mjs': ts`
        import tailwindcss from '@tailwindcss/vite'
        import react from '@astrojs/react'
        import { defineConfig } from 'astro/config'

        // https://astro.build/config
        export default defineConfig({
          vite: { plugins: [tailwindcss()] },
          integrations: [react()],
          build: { inlineStylesheets: 'never' },
        })
      `,
      // prettier-ignore
      'src/pages/index.astro': html`
        ---
        import ClientOnly from './client-only';
        ---

        <div class="underline">Hello, world!</div>

        <ClientOnly client:only="react" />

        <style is:global>
          @import 'tailwindcss';
        </style>
      `,
      'src/pages/client-only.jsx': js`
        export default function ClientOnly() {
          return <div className="overline">Hello, world!</div>
        }
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm astro build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)

    await fs.expectFileToContain(files[0][0], [candidate`underline`, candidate`overline`])
  },
)

// https://github.com/tailwindlabs/tailwindcss/issues/19677
test(
  'import aliases should work in <style> blocks',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "astro": "^5",
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          }
        }
      `,
      'astro.config.mjs': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'astro/config'

        // https://astro.build/config
        export default defineConfig({
          vite: { plugins: [tailwindcss()] },
        })
      `,
      'tsconfig.json': json`
        {
          "extends": "astro/tsconfigs/strict",
          "include": [".astro/types.d.ts", "**/*"],
          "exclude": ["dist"],
          "compilerOptions": {
            "paths": {
              "@styles/*": ["./src/styles/*"]
            }
          }
        }
      `,
      // prettier-ignore
      'src/pages/index.astro': html`
        ---
        import '@styles/global.css'
        ---

        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <meta name="generator" content={Astro.generator} />
            <title>Astro</title>
            <style>
              @reference "@styles/global.css";
            </style>
          </head>
          <body>
            <h1 class="underline">Astro</h1>
          </body>
        </html>
      `,
      'src/styles/global.css': css`@import 'tailwindcss';`,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm astro build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)

    await fs.expectFileToContain(files[0][0], [candidate`underline`])
  },
)
