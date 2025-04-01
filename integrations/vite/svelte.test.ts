import { candidate, css, html, json, retryAssertion, test, ts } from '../utils'

test(
  'production build',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "svelte": "^5",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "@sveltejs/vite-plugin-svelte": "^5",
            "@tailwindcss/vite": "workspace:^",
            "vite": "^6"
          }
        }
      `,
      'vite.config.ts': ts`
        import { defineConfig } from 'vite'
        import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
          plugins: [
            svelte({
              preprocess: [vitePreprocess()],
            }),
            tailwindcss(),
          ],
        })
      `,
      'index.html': html`
        <!doctype html>
        <html>
          <body>
            <div id="app"></div>
            <script type="module" src="./src/main.ts"></script>
          </body>
        </html>
      `,
      'src/main.ts': ts`
        import App from './App.svelte'
        const app = new App({
          target: document.body,
        })
      `,
      'src/index.css': css`@import 'tailwindcss';`,
      'src/App.svelte': html`
        <script>
          import './index.css'
          let name = 'world'
        </script>

        <h1 class="global local underline">Hello {name}!</h1>

        <style>
          @import './other.css';
          @reference 'tailwindcss';
        </style>
      `,
      'src/other.css': css`
        .local {
          @apply text-red-500;
          animation: 2s ease-in-out infinite localKeyframes;
        }

        :global(.global) {
          @apply text-green-500;
          animation: 2s ease-in-out infinite globalKeyframes;
        }

        @keyframes -global-globalKeyframes {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 100%;
          }
        }

        @keyframes localKeyframes {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 100%;
          }
        }
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    let output = await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)

    await fs.expectFileToContain(files[0][0], [
      candidate`underline`,
      '.global{color:var(--color-green-500,oklch(72.3% .219 149.579));animation:2s ease-in-out infinite globalKeyframes}',
      /\.local.svelte-.*\{color:var\(--color-red-500\,oklch\(63\.7% \.237 25\.331\)\);animation:2s ease-in-out infinite svelte-.*-localKeyframes\}/,
      /@keyframes globalKeyframes\{/,
      /@keyframes svelte-.*-localKeyframes\{/,
    ])

    // Should not print any warnings
    expect(output).not.toContain('vite-plugin-svelte')
  },
)

test(
  'watch mode',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "svelte": "^5",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "@sveltejs/vite-plugin-svelte": "^5",
            "@tailwindcss/vite": "workspace:^",
            "vite": "^6"
          }
        }
      `,
      'vite.config.ts': ts`
        import { defineConfig } from 'vite'
        import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
          plugins: [
            svelte({
              preprocess: [vitePreprocess()],
            }),
            tailwindcss(),
          ],
        })
      `,
      'index.html': html`
        <!doctype html>
        <html>
          <body>
            <div id="app"></div>
            <script type="module" src="./src/main.ts"></script>
          </body>
        </html>
      `,
      'src/main.ts': ts`
        import App from './App.svelte'
        const app = new App({
          target: document.body,
        })
      `,
      'src/App.svelte': html`
        <script>
          import './index.css'
          let name = 'world'
        </script>

        <h1 class="local global underline">Hello {name}!</h1>

        <style>
          @import './other.css';
          @reference 'tailwindcss';
        </style>
      `,
      'src/index.css': css` @import 'tailwindcss'; `,
      'src/other.css': css`
        .local {
          @apply text-red-500;
          animation: 2s ease-in-out infinite localKeyframes;
        }

        :global(.global) {
          @apply text-green-500;
          animation: 2s ease-in-out infinite globalKeyframes;
        }

        @keyframes -global-globalKeyframes {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 100%;
          }
        }

        @keyframes localKeyframes {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 100%;
          }
        }
      `,
    },
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn(`pnpm vite build --watch`)
    await process.onStdout((m) => m.includes('built in'))

    await retryAssertion(async () => {
      let files = await fs.glob('dist/**/*.css')
      expect(files).toHaveLength(1)
      let [, css] = files[0]
      expect(css).toContain(candidate`underline`)
      expect(css).toContain(
        '.global{color:var(--color-green-500,oklch(72.3% .219 149.579));animation:2s ease-in-out infinite globalKeyframes}',
      )
      expect(css).toMatch(
        /\.local.svelte-.*\{color:var\(--color-red-500,oklch\(63\.7% \.237 25\.331\)\);animation:2s ease-in-out infinite svelte-.*-localKeyframes\}/,
      )
      expect(css).toMatch(/@keyframes globalKeyframes\{/)
      expect(css).toMatch(/@keyframes svelte-.*-localKeyframes\{/)
    })

    await fs.write(
      'src/App.svelte',
      (await fs.read('src/App.svelte')).replace('underline', 'font-bold bar'),
    )

    await fs.write(
      'src/other.css',
      `${await fs.read('src/other.css')}\n.bar { @apply text-pink-500; }`,
    )

    await retryAssertion(async () => {
      let files = await fs.glob('dist/**/*.css')
      expect(files).toHaveLength(1)
      let [, css] = files[0]
      expect(css).toContain(candidate`font-bold`)
      expect(css).toContain(
        '.global{color:var(--color-green-500,oklch(72.3% .219 149.579));animation:2s ease-in-out infinite globalKeyframes}',
      )
      expect(css).toMatch(
        /\.local.svelte-.*\{color:var\(--color-red-500,oklch\(63\.7% \.237 25\.331\)\);animation:2s ease-in-out infinite svelte-.*-localKeyframes\}/,
      )
      expect(css).toMatch(/@keyframes globalKeyframes\{/)
      expect(css).toMatch(/@keyframes svelte-.*-localKeyframes\{/)
      expect(css).toMatch(
        /\.bar.svelte-.*\{color:var\(--color-pink-500,oklch\(65\.6% \.241 354\.308\)\)\}/,
      )
    })
  },
)
