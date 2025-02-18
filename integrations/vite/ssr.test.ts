import { candidate, css, html, json, test, ts } from '../utils'

const WORKSPACE = {
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
}

test(
  'Vite 5',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          },
          "_comment": "This test uses Vite 5.3 on purpose. Do not upgrade it to Vite 6.",
          "devDependencies": {
            "vite": "^5.3"
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
      ...WORKSPACE,
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

test(
  `Vite 6`,
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
            "vite": "^6.0"
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
      ...WORKSPACE,
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
