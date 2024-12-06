import { describe } from 'vitest'
import { css, html, test, ts, txt } from '../utils'

describe.each(['postcss', 'lightningcss'])('%s', (transformer) => {
  test(
    `dev mode`,
    {
      fs: {
        'package.json': txt`
          {
            "type": "module",
            "dependencies": {
              "@tailwindcss/vite": "workspace:^",
              "tailwindcss": "workspace:^"
            },
            "devDependencies": {
              ${transformer === 'lightningcss' ? `"lightningcss": "^1.26.0",` : ''}
              "vite": "^6"
            }
          }
        `,
        'vite.config.ts': ts`
          import tailwindcss from '@tailwindcss/vite'
          import { defineConfig } from 'vite'

          export default defineConfig({
            css: ${transformer === 'postcss' ? '{}' : "{ transformer: 'lightningcss' }"},
            build: { cssMinify: false },
            plugins: [tailwindcss()],
          })
        `,
        'index.html': html`
          <head>
            <script type="module" src="/src/component.ts"></script>
          </head>
          <body>
            <div id="root" />
          </body>
        `,
        'src/component.ts': ts`
          import { foo } from './component.module.css'
          let root = document.getElementById('root')
          root.className = foo
          root.innerText = 'Hello, world!'
        `,
        'src/component.module.css': css`
          @import 'tailwindcss/utilities';

          .foo {
            @apply underline;
          }
        `,
      },
    },
    async ({ exec, fs, expect }) => {
      await exec(`pnpm vite build`)

      let files = await fs.glob('dist/**/*.css')
      expect(files).toHaveLength(1)
      let [filename] = files[0]

      await fs.expectFileToContain(filename, [/text-decoration-line: underline;/gi])
    },
  )
})
