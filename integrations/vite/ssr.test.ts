import { describe } from 'vitest'
import { candidate, css, html, json, test, ts } from '../utils'

describe.each([['^5.3'], ['^6.0'], ['^7'], ['^8']])('Using Vite %s', (version) => {
  test(
    `SSR build`,
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
              "vite": "${version}"
            }
          }
        `,
        'vite.config.ts': ts`
          import tailwindcss from '@tailwindcss/vite'
          import { defineConfig } from 'vite'

          export default defineConfig({
            build: {
              cssMinify: false,
              ssrEmitAssets: true,
            },
            plugins: [tailwindcss()],
          })
        `,
        'index.html': html`
          <body>
            <div id="app"></div>
            <script type="module" src="./src/index.ts"></script>
          </body>
        `,
        'src/index.css': css`@import 'tailwindcss';`,
        'src/index.ts': ts`
          import './index.css'

          document.querySelector('#app').innerHTML = \`
            <div class="underline m-2">Hello, world!</div>
          \`
        `,
        'server.ts': ts`
          import css from './src/index.css?url'

          document.querySelector('#app').innerHTML = \`
            <link rel="stylesheet" href="\${css}">
            <div class="overline m-3">Hello, world!</div>
          \`
        `,
      },
    },
    async ({ fs, exec, expect }) => {
      await exec('pnpm vite build --ssr server.ts')

      let files = await fs.glob('dist/**/*.css')
      expect(files).toHaveLength(1)
      let [filename] = files[0]

      await fs.expectFileToContain(filename, [
        candidate`underline`,
        candidate`m-2`,
        candidate`overline`,
        candidate`m-3`,
      ])
    },
  )
})
