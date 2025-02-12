import { candidate, css, html, js, json, test, ts } from '../utils'

test(
  'Config files (CJS)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <div class="text-primary"></div>
      `,
      'tailwind.config.js': js`
        module.exports = {
          theme: {
            extend: {
              colors: {
                primary: 'blue',
              },
            },
          },
        }
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @config '../tailwind.config.js';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
    ])
  },
)

test(
  'Config files (ESM)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <div class="text-primary"></div>
      `,
      'tailwind.config.mjs': js`
        export default {
          theme: {
            extend: {
              colors: {
                primary: 'blue',
              },
            },
          },
        }
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @config '../tailwind.config.mjs';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
    ])
  },
)

test(
  'Config files (TS)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <div class="text-primary"></div>
      `,
      'tailwind.config.ts': ts`
        export default {
          theme: {
            extend: {
              colors: {
                primary: 'blue',
              },
            },
          },
        } satisfies { theme: { extend: { colors: { primary: string } } } }
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @config '../tailwind.config.ts';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
    ])
  },
)

test(
  'Config files (CJS, watch mode)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <div class="text-primary"></div>
      `,
      'tailwind.config.js': js`
        const myColor = require('./my-color')
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
      'my-color.js': js`module.exports = 'blue'`,
      'src/index.css': css`
        @import 'tailwindcss';
        @config '../tailwind.config.js';
      `,
    },
  },
  async ({ fs, spawn }) => {
    let process = await spawn(
      'pnpm tailwindcss --input src/index.css --output dist/out.css --watch',
    )
    await process.onStderr((m) => m.includes('Done in'))

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
      'color: blue',
    ])

    await fs.write('my-color.js', js`module.exports = 'red'`)

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
      'color: red',
    ])
  },
)

test(
  'Config files (ESM, watch mode)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <div class="text-primary"></div>
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
  async ({ fs, spawn }) => {
    let process = await spawn(
      'pnpm tailwindcss --input src/index.css --output dist/out.css --watch',
    )
    await process.onStderr((m) => m.includes('Done in'))

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
      'color: blue',
    ])

    await fs.write('my-color.mjs', js`export default 'red'`)

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
      'color: red',
    ])
  },
)

test(
  'Config files (TS, watch mode)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <div class="text-primary"></div>
      `,
      'tailwind.config.ts': js`
        import myColor from './my-color.ts'
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
      'my-color.ts': js`export default 'blue'`,
      'src/index.css': css`
        @import 'tailwindcss';
        @config '../tailwind.config.ts';
      `,
    },
  },
  async ({ fs, spawn }) => {
    let process = await spawn(
      'pnpm tailwindcss --input src/index.css --output dist/out.css --watch',
    )
    await process.onStderr((m) => m.includes('Done in'))

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
      'color: blue',
    ])

    await fs.write('my-color.ts', js`export default 'red'`)

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
      'color: red',
    ])
  },
)
