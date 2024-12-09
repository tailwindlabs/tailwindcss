import dedent from 'dedent'
import path from 'node:path'
import { describe } from 'vitest'
import {
  candidate,
  css,
  fetchStyles,
  html,
  js,
  json,
  retryAssertion,
  test,
  ts,
  txt,
  yaml,
} from '../utils'

describe('PostCSS / Next.js', () => {
  describe.each(['turbo', 'webpack'])('%s', (bundler) => {
    test.sequential(
      'dev mode',
      {
        fs: {
          'package.json': json`
            {
              "dependencies": {
                "react": "^18",
                "react-dom": "^18",
                "next": "^14"
              },
              "devDependencies": {
                "@tailwindcss/postcss": "workspace:^",
                "tailwindcss": "workspace:^"
              }
            }
          `,
          'postcss.config.mjs': js`
            /** @type {import('postcss-load-config').Config} */
            const config = {
              plugins: {
                '@tailwindcss/postcss': {},
              },
            }

            export default config
          `,
          'next.config.mjs': js`
            /** @type {import('next').NextConfig} */
            const nextConfig = {}

            export default nextConfig
          `,
          'app/layout.js': js`
            import './globals.css'

            export default function RootLayout({ children }) {
              return (
                <html>
                  <body>{children}</body>
                </html>
              )
            }
          `,
          'app/page.js': js`
            export default function Page() {
              return <h1 className="underline">Hello, Next.js!</h1>
            }
          `,
          'app/globals.css': css`
            @import 'tailwindcss/theme' theme(reference);
            @import 'tailwindcss/utilities';
          `,
        },
      },
      async ({ fs, spawn, expect }) => {
        let process = await spawn(`pnpm next dev ${bundler === 'turbo' ? '--turbo' : ''}`)

        let url = ''
        await process.onStdout((m) => {
          let match = /Local:\s*(http.*)/.exec(m)
          if (match) url = match[1]
          return Boolean(url)
        })

        await process.onStdout((m) => m.includes('Ready in'))

        await retryAssertion(async () => {
          let css = await fetchStyles(url)
          expect(css).toContain(candidate`underline`)
        })

        await fs.write(
          'app/page.js',
          js`
            export default function Page() {
              return <h1 className="underline text-red-500">Hello, Next.js!</h1>
            }
          `,
        )
        await process.onStdout((m) => m.includes('Compiled in'))

        await retryAssertion(async () => {
          let css = await fetchStyles(url)
          expect(css).toContain(candidate`underline`)
          expect(css).toContain(candidate`text-red-500`)
        })
      },
    )
  })
})

describe('Vite / astro', () => {
  test.sequential(
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
            vite: {
              plugins: [tailwindcss()],
            },
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
})

describe('Vite', () => {
  test.sequential(
    'Config files (CJS, dev mode)',
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
            <div class="text-primary"></div>
          </body>
        `,
        'tailwind.config.cjs': js`
          const myColor = require('./my-color.cjs')
          module.exports = {
            theme: {
              extend: {
                colors: {
                  primary: myColor,
                },
              },
            },
          }
        `,
        'my-color.cjs': js`module.exports = 'blue'`,
        'src/index.css': css`
          @import 'tailwindcss';
          @config '../tailwind.config.cjs';
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
        let css = await fetchStyles(url, '/index.html')
        expect(css).toContain(candidate`text-primary`)
        expect(css).toContain('color: blue')
      })

      await retryAssertion(async () => {
        await fs.write('my-color.cjs', js`module.exports = 'red'`)

        let css = await fetchStyles(url, '/index.html')
        expect(css).toContain(candidate`text-primary`)
        expect(css).toContain('color: red')
      })
    },
  )

  test.sequential(
    'Config files (ESM, dev mode)',
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
            <div class="text-primary"></div>
          </body>
        `,
        'tailwind.config.mjs': js`
          import myColor from './my-color.mjs'
          export default {
            theme: {
              extend: {
                colors: {
                  primary: myColor,
                },
              },
            },
          }
        `,
        'my-color.mjs': js`export default 'blue'`,
        'src/index.css': css`
          @import 'tailwindcss';
          @config '../tailwind.config.mjs';
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
        let css = await fetchStyles(url, '/index.html')
        expect(css).toContain(candidate`text-primary`)
        expect(css).toContain('color: blue')
      })

      await retryAssertion(async () => {
        await fs.write('my-color.mjs', js`export default 'red'`)

        let css = await fetchStyles(url, '/index.html')
        expect(css).toContain(candidate`text-primary`)
        expect(css).toContain('color: red')
      })
    },
  )
})

describe('Vite', () => {
  describe.each(['postcss', 'lightningcss'])('%s', (transformer) => {
    test.sequential(
      'dev mode',
      {
        fs: {
          'package.json': json`{}`,
          'pnpm-workspace.yaml': yaml`
            #
            packages:
              - project-a
          `,
          'project-a/package.json': txt`
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
          'project-a/vite.config.ts': ts`
            import tailwindcss from '@tailwindcss/vite'
            import { defineConfig } from 'vite'

            export default defineConfig({
              css: ${transformer === 'postcss' ? '{}' : "{ transformer: 'lightningcss' }"},
              build: { cssMinify: false },
              plugins: [tailwindcss()],
            })
          `,
          'project-a/index.html': html`
            <head>
              <link rel="stylesheet" href="./src/index.css" />
            </head>
            <body>
              <div class="underline">Hello, world!</div>
            </body>
          `,
          'project-a/about.html': html`
            <head>
              <link rel="stylesheet" href="./src/index.css" />
            </head>
            <body>
              <div class="font-bold">Tailwind Labs</div>
            </body>
          `,
          'project-a/tailwind.config.js': js`
            export default {
              content: ['../project-b/src/**/*.js'],
            }
          `,
          'project-a/src/index.css': css`
            @import 'tailwindcss/theme' theme(reference);
            @import 'tailwindcss/utilities';
            @config '../tailwind.config.js';
            @source '../../project-b/src/**/*.html';
          `,
          'project-b/src/index.html': html`
            <div class="flex" />
          `,
          'project-b/src/index.js': js`
            const className = "content-['project-b/src/index.js']"
            module.exports = { className }
          `,
        },
      },
      async ({ root, spawn, fs, expect }) => {
        let process = await spawn('pnpm vite dev', {
          cwd: path.join(root, 'project-a'),
        })
        await process.onStdout((m) => m.includes('ready in'))

        let url = ''
        await process.onStdout((m) => {
          let match = /Local:\s*(http.*)\//.exec(m)
          if (match) url = match[1]
          return Boolean(url)
        })

        // Candidates are resolved lazily, so the first visit of index.html
        // will only have candidates from this file.
        await retryAssertion(async () => {
          let styles = await fetchStyles(url, '/index.html')
          expect(styles).toContain(candidate`underline`)
          expect(styles).toContain(candidate`flex`)
          expect(styles).not.toContain(candidate`font-bold`)
        })

        // Going to about.html will extend the candidate list to include
        // candidates from about.html.
        await retryAssertion(async () => {
          let styles = await fetchStyles(url, '/about.html')
          expect(styles).toContain(candidate`underline`)
          expect(styles).toContain(candidate`flex`)
          expect(styles).toContain(candidate`font-bold`)
        })

        await retryAssertion(async () => {
          // Updates are additive and cause new candidates to be added.
          await fs.write(
            'project-a/index.html',
            html`
              <head>
                <link rel="stylesheet" href="./src/index.css" />
              </head>
              <body>
                <div class="underline m-2">Hello, world!</div>
              </body>
            `,
          )

          let styles = await fetchStyles(url)
          expect(styles).toContain(candidate`underline`)
          expect(styles).toContain(candidate`flex`)
          expect(styles).toContain(candidate`font-bold`)
          expect(styles).toContain(candidate`m-2`)
        })

        await retryAssertion(async () => {
          // Manually added `@source`s are watched and trigger a rebuild
          await fs.write(
            'project-b/src/index.js',
            js`
              const className = "[.changed_&]:content-['project-b/src/index.js']"
              module.exports = { className }
            `,
          )

          let styles = await fetchStyles(url)
          expect(styles).toContain(candidate`underline`)
          expect(styles).toContain(candidate`flex`)
          expect(styles).toContain(candidate`font-bold`)
          expect(styles).toContain(candidate`m-2`)
          expect(styles).toContain(candidate`[.changed_&]:content-['project-b/src/index.js']`)
        })

        await retryAssertion(async () => {
          // After updates to the CSS file, all previous candidates should still be in
          // the generated CSS
          await fs.write(
            'project-a/src/index.css',
            css`
              ${await fs.read('project-a/src/index.css')}

              .red {
                color: red;
              }
            `,
          )

          let styles = await fetchStyles(url)
          expect(styles).toContain(candidate`red`)
          expect(styles).toContain(candidate`flex`)
          expect(styles).toContain(candidate`m-2`)
          expect(styles).toContain(candidate`underline`)
          expect(styles).toContain(candidate`[.changed_&]:content-['project-b/src/index.js']`)
          expect(styles).toContain(candidate`font-bold`)
        })
      },
    )
  })
})

describe('Vite', () => {
  test.sequential(
    `demote Tailwind roots to regular CSS files and back to Tailwind roots while restoring all candidates`,
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
            <div class="underline">Hello, world!</div>
          </body>
        `,
        'about.html': html`
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body>
            <div class="font-bold">Tailwind Labs</div>
          </body>
        `,
        'src/index.css': css`@import 'tailwindcss';`,
      },
    },
    async ({ spawn, fs, expect }) => {
      let process = await spawn('pnpm vite dev')
      await process.onStdout((m) => m.includes('ready in'))

      let url = ''
      await process.onStdout((m) => {
        let match = /Local:\s*(http.*)\//.exec(m)
        if (match) url = match[1]
        return Boolean(url)
      })

      // Candidates are resolved lazily, so the first visit of index.html
      // will only have candidates from this file.
      await retryAssertion(async () => {
        let styles = await fetchStyles(url, '/index.html')
        expect(styles).toContain(candidate`underline`)
        expect(styles).not.toContain(candidate`font-bold`)
      })

      // Going to about.html will extend the candidate list to include
      // candidates from about.html.
      await retryAssertion(async () => {
        let styles = await fetchStyles(url, '/about.html')
        expect(styles).toContain(candidate`underline`)
        expect(styles).toContain(candidate`font-bold`)
      })

      await retryAssertion(async () => {
        // We change the CSS file so it is no longer a valid Tailwind root.
        await fs.write('src/index.css', css`@import 'tailwindcss';`)

        let styles = await fetchStyles(url)
        expect(styles).toContain(candidate`underline`)
        expect(styles).toContain(candidate`font-bold`)
      })
    },
  )

  test.sequential(
    `does not interfere with ?raw and ?url static asset handling`,
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
          import { defineConfig } from 'vite'

          export default defineConfig({
            build: { cssMinify: false },
            plugins: [tailwindcss()],
          })
        `,
        'index.html': html`
          <head>
            <script type="module" src="./src/index.js"></script>
          </head>
        `,
        'src/index.js': js`
          import url from './index.css?url'
          import raw from './index.css?raw'
        `,
        'src/index.css': css`@import 'tailwindcss';`,
      },
    },
    async ({ spawn, expect }) => {
      let process = await spawn('pnpm vite dev')
      await process.onStdout((m) => m.includes('ready in'))

      let baseUrl = ''
      await process.onStdout((m) => {
        let match = /Local:\s*(http.*)\//.exec(m)
        if (match) baseUrl = match[1]
        return Boolean(baseUrl)
      })

      await retryAssertion(async () => {
        // We have to load the .js file first so that the static assets are
        // resolved
        await fetch(`${baseUrl}/src/index.js`).then((r) => r.text())

        let [raw, url] = await Promise.all([
          fetch(`${baseUrl}/src/index.css?raw`).then((r) => r.text()),
          fetch(`${baseUrl}/src/index.css?url`).then((r) => r.text()),
        ])

        expect(firstLine(raw)).toBe(`export default "@import 'tailwindcss';"`)
        expect(firstLine(url)).toBe(`export default "/src/index.css"`)
      })
    },
  )

  test.sequential(
    'dev mode',
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
            build: { cssMinify: false },
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
    async ({ spawn, expect }) => {
      let process = await spawn('pnpm vite dev')
      await process.onStdout((m) => m.includes('ready in'))

      let url = ''
      await process.onStdout((m) => {
        let match = /Local:\s*(http.*)\//.exec(m)
        if (match) url = match[1]
        return Boolean(url)
      })

      // Candidates are resolved lazily, so the first visit of index.html
      // will only have candidates from this file.
      await retryAssertion(async () => {
        let styles = await fetchStyles(url, '/root1.html')
        expect(styles).toContain(candidate`one:underline`)
        expect(styles).not.toContain(candidate`two:underline`)
      })

      // Going to about.html will extend the candidate list to include
      // candidates from about.html.
      await retryAssertion(async () => {
        let styles = await fetchStyles(url, '/root2.html')
        expect(styles).not.toContain(candidate`one:underline`)
        expect(styles).toContain(candidate`two:underline`)
      })
    },
  )
})

describe('Vite / Nuxt', () => {
  const SETUP = {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "nuxt": "^3.13.1",
            "tailwindcss": "workspace:^",
            "vue": "latest"
          }
        }
      `,
      'nuxt.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'

        // https://nuxt.com/docs/api/configuration/nuxt-config
        export default defineNuxtConfig({
          vite: {
            plugins: [tailwindcss()],
          },

          css: ['~/assets/css/main.css'],
          devtools: { enabled: true },
          compatibilityDate: '2024-08-30',
        })
      `,
      'app.vue': html`
        <template>
          <div class="underline">Hello world!</div>
        </template>
      `,
      'assets/css/main.css': css`@import 'tailwindcss';`,
    },
  }

  test.sequential('dev mode', SETUP, async ({ fs, spawn, expect }) => {
    let process = await spawn('pnpm nuxt dev', {
      env: {
        TEST: 'false', // VERY IMPORTANT OTHERWISE YOU WON'T GET OUTPUT
        NODE_ENV: 'development',
      },
    })

    let url = ''
    await process.onStdout((m) => {
      let match = /Local:\s*(http.*)\//.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    await process.onStdout((m) => m.includes('server warmed up in'))

    await retryAssertion(async () => {
      let css = await fetchStyles(url)
      expect(css).toContain(candidate`underline`)
    })

    await retryAssertion(async () => {
      await fs.write(
        'app.vue',
        html`
          <template>
            <div class="underline font-bold">Hello world!</div>
          </template>
        `,
      )

      let css = await fetchStyles(url)
      expect(css).toContain(candidate`underline`)
      expect(css).toContain(candidate`font-bold`)
    })
  })

  test.sequential('build', SETUP, async ({ spawn, exec, expect }) => {
    await exec(`pnpm nuxt build`)
    let process = await spawn('pnpm nuxt preview', {
      env: {
        TEST: 'false',
        NODE_ENV: 'development',
      },
    })

    let url = ''
    await process.onStdout((m) => {
      let match = /Listening on\s*(http.*)\//.exec(m)
      if (match) url = match[1].replace('http://[::]', 'http://127.0.0.1')
      return m.includes('Listening on')
    })

    await retryAssertion(async () => {
      let css = await fetchStyles(url)
      expect(css).toContain(candidate`underline`)
    })
  })
})

describe('Vite', () => {
  function createSetup(transformer: 'postcss' | 'lightningcss') {
    return {
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
            plugins: [
              tailwindcss(),
              {
                name: 'recolor',
                transform(code, id) {
                  if (id.includes('.css')) {
                    return code.replace(/red;/g, 'blue;')
                  }
                },
              },
            ],
          })
        `,
        'index.html': html`
        <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body>
            <div class="foo [background-color:red]">Hello, world!</div>
          </body>
      `,
        'src/index.css': css`
          @import 'tailwindcss/theme' theme(reference);
          @import 'tailwindcss/utilities';

          .foo {
            color: red;
          }
        `,
      },
    }
  }

  describe.each(['postcss', 'lightningcss'] as const)('%s', (transformer) => {
    test.sequential('dev mode', createSetup(transformer), async ({ spawn, fs, expect }) => {
      let process = await spawn('pnpm vite dev')
      await process.onStdout((m) => m.includes('ready in'))

      let url = ''
      await process.onStdout((m) => {
        let match = /Local:\s*(http.*)\//.exec(m)
        if (match) url = match[1]
        return Boolean(url)
      })

      await retryAssertion(async () => {
        let styles = await fetchStyles(url, '/index.html')
        expect(styles).toContain(css`
          .foo {
            color: blue;
          }
        `)
        // Running the transforms on utilities generated by Tailwind might change in the future
        expect(styles).toContain(dedent`
          .\[background-color\:red\] {
            background-color: blue;
          }
        `)
      })

      await retryAssertion(async () => {
        await fs.write(
          'src/index.css',
          css`
            @import 'tailwindcss/theme' theme(reference);
            @import 'tailwindcss/utilities';

            .foo {
              background-color: red;
            }
          `,
        )

        let styles = await fetchStyles(url)
        expect(styles).toContain(css`
          .foo {
            background-color: blue;
          }
        `)
      })
    })
  })

  describe.each(['postcss', 'lightningcss'])('%s', (transformer) => {
    test.sequential(
      'resolves aliases in dev mode',
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
                "vite": "^5.3.5"
              }
            }
          `,
          'vite.config.ts': ts`
            import tailwindcss from '@tailwindcss/vite'
            import { defineConfig } from 'vite'
            import { fileURLToPath } from 'node:url'

            export default defineConfig({
              css: ${transformer === 'postcss' ? '{}' : "{ transformer: 'lightningcss' }"},
              build: { cssMinify: false },
              plugins: [tailwindcss()],
              resolve: {
                alias: {
                  '#css-alias': fileURLToPath(new URL('./src/alias.css', import.meta.url)),
                  '#js-alias': fileURLToPath(new URL('./src/plugin.js', import.meta.url)),
                },
              },
            })
          `,
          'index.html': html`
            <head>
              <link rel="stylesheet" href="./src/index.css" />
            </head>
            <body>
              <div class="underline custom-underline">Hello, world!</div>
            </body>
          `,
          'src/index.css': css`
            @import '#css-alias';
            @plugin '#js-alias';
          `,
          'src/alias.css': css`
            @import 'tailwindcss/theme' theme(reference);
            @import 'tailwindcss/utilities';
          `,
          'src/plugin.js': js`
            export default function ({ addUtilities }) {
              addUtilities({ '.custom-underline': { 'border-bottom': '1px solid green' } })
            }
          `,
        },
      },
      async ({ spawn, expect }) => {
        let process = await spawn('pnpm vite dev')
        await process.onStdout((m) => m.includes('ready in'))

        let url = ''
        await process.onStdout((m) => {
          let match = /Local:\s*(http.*)\//.exec(m)
          if (match) url = match[1]
          return Boolean(url)
        })

        await retryAssertion(async () => {
          let styles = await fetchStyles(url, '/index.html')
          expect(styles).toContain(candidate`underline`)
          expect(styles).toContain(candidate`custom-underline`)
        })
      },
    )
  })
})

function firstLine(str: string) {
  return str.split('\n')[0]
}
