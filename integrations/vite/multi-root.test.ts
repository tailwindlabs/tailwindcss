import { candidate, css, html, json, test, ts } from '../utils'

test(
  `production build`,
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
            "vite": "^6"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import path from 'node:path'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: {
            cssMinify: false,
            rollupOptions: {
              input: {
                root1: path.resolve(__dirname, 'root1.html'),
                root2: path.resolve(__dirname, 'root2.html'),
              },
            },
          },
          plugins: [tailwindcss()],
        })
      `,
      'root1.html': html`
        <head>
          <link rel="stylesheet" href="./src/root1.css" />
        </head>
        <body>
          <div class="one:underline two:underline">Hello, world!</div>
        </body>
      `,
      'src/shared.css': css`
        @import 'tailwindcss/theme' theme(reference);
        @import 'tailwindcss/utilities';
      `,
      'src/root1.css': css`
        @import './shared.css';
        @variant one (&:is([data-root='1']));
      `,
      'root2.html': html`
        <head>
          <link rel="stylesheet" href="./src/root2.css" />
        </head>
        <body>
          <div class="one:underline two:underline">Hello, world!</div>
        </body>
      `,
      'src/root2.css': css`
        @import './shared.css';
        @variant two (&:is([data-root='2']));
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(2)

    let root1 = files.find(([filename]) => filename.includes('root1'))
    let root2 = files.find(([filename]) => filename.includes('root2'))

    expect(root1).toBeDefined()
    expect(root2).toBeDefined()

    expect(root1![1]).toContain(candidate`one:underline`)
    expect(root1![1]).not.toContain(candidate`two:underline`)

    expect(root2![1]).not.toContain(candidate`one:underline`)
    expect(root2![1]).toContain(candidate`two:underline`)
  },
)
