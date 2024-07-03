let fs = require('fs')
let $ = require('../../execute')
let { css, html, javascript } = require('../../syntax')

let { readOutputFile, appendToInputFile, writeInputFile, removeFile } = require('../../io')({
  output: 'dist',
  input: 'src',
})

function ready(message) {
  return message.includes('Done in')
}

describe('static build', () => {
  it('should be possible to generate tailwind output', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    await $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )
  })

  it('should be possible to pipe in data', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    await $('cat ./src/index.css | node ../../lib/cli.js -i - -o ./dist/main.css', {
      shell: true,
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )
  })

  it('should safelist a list of classes to always include', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)
    await writeInputFile(
      '../tailwind.config.js',
      javascript`
        module.exports = {
          content: {
            files: ['./src/index.html'],
          },
          safelist: ['bg-red-500','bg-red-600'],
          theme: {
            extend: {
            },
          },
          corePlugins: {
            preflight: false,
          },
          plugins: [],
        }
      `
    )

    await $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .bg-red-500 {
          --tw-bg-opacity: 1;
          background-color: rgb(239 68 68 / var(--tw-bg-opacity));
        }

        .bg-red-600 {
          --tw-bg-opacity: 1;
          background-color: rgb(220 38 38 / var(--tw-bg-opacity));
        }

        .font-bold {
          font-weight: 700;
        }
      `
    )
  })

  it('can use a tailwind.config.js configuration file with ESM syntax', async () => {
    await removeFile('tailwind.config.js')
    await writeInputFile('index.html', html`<div class="bg-primary"></div>`)
    await writeInputFile(
      'index.css',
      css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `
    )
    await writeInputFile(
      '../tailwind.config.js',
      javascript`
        export default {
          content: ['./src/index.html'],
          theme: {
            extend: {
              colors: {
                primary: 'black',
              },
            },
          },
          corePlugins: {
            preflight: false,
          },
        }
      `
    )

    await $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .bg-primary {
          --tw-bg-opacity: 1;
          background-color: rgb(0 0 0 / var(--tw-bg-opacity));
        }
      `
    )
  })

  it.each([['../tailwind.config.ts'], ['../tailwind.config.cts'], ['../tailwind.config.mts']])(
    'can use a %s configuration file',
    async (path) => {
      await removeFile('tailwind.config.js')
      await writeInputFile('index.html', html`<div class="bg-primary"></div>`)
      await writeInputFile(
        'index.css',
        css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `
      )
      await writeInputFile(
        path,
        javascript`
          import type { Config } from 'tailwindcss'

          export default {
            content: ['./src/index.html'],
            theme: {
              extend: {
                colors: {
                  primary: 'black',
                },
              },
            },
            corePlugins: {
              preflight: false,
            },
          } satisfies Config
        `
      )

      await $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css', {
        env: { NODE_ENV: 'production' },
      })

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .bg-primary {
            --tw-bg-opacity: 1;
            background-color: rgb(0 0 0 / var(--tw-bg-opacity));
          }
        `
      )
    }
  )

  it('can read from a config file from an @config directive', async () => {
    await writeInputFile('index.html', html`<div class="bg-yellow"></div>`)
    await writeInputFile(
      'index.css',
      css`
        @config "./tailwind.config.js";
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `
    )
    await writeInputFile(
      'tailwind.config.js',
      javascript`
        module.exports = {
          content: {
            relative: true,
            files: ['./index.html'],
          },
          theme: {
            extend: {
              colors: {
                yellow: '#ff0',
              }
            },
          },
          corePlugins: {
            preflight: false,
          },
        }
      `
    )

    await $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .bg-yellow {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 0 / var(--tw-bg-opacity));
        }
      `
    )
  })

  it('can read from a config file from an @config directive inside an @import from postcss-import', async () => {
    await fs.promises.mkdir('./src/config', { recursive: true })

    await writeInputFile('index.html', html`<div class="bg-yellow"></div>`)
    await writeInputFile(
      'config/myconfig.css',
      css`
        @config "../tailwind.config.js";
      `
    )
    await writeInputFile(
      'index.css',
      css`
        @import './config/myconfig';
        @import 'tailwindcss/base';
        @import 'tailwindcss/components';
        @import 'tailwindcss/utilities';
      `
    )
    await writeInputFile(
      'tailwind.config.js',
      javascript`
        module.exports = {
          content: {
            relative: true,
            files: ['./index.html'],
          },
          theme: {
            extend: {
              colors: {
                yellow: '#ff0',
              }
            },
          },
          corePlugins: {
            preflight: false,
          },
        }
      `
    )

    await $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .bg-yellow {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 0 / var(--tw-bg-opacity));
        }
      `
    )
  })

  it('should work with raw content', async () => {
    await writeInputFile(
      '../tailwind.config.js',
      javascript`
        module.exports = {
          content: {
            files: [{ raw: 'bg-red-500'}],
          },
          theme: {
            extend: {
            },
          },
          corePlugins: {
            preflight: false,
          },
          plugins: [],
        }
      `
    )

    await $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .bg-red-500 {
          --tw-bg-opacity: 1;
          background-color: rgb(239 68 68 / var(--tw-bg-opacity));
        }
      `
    )
  })
})

describe('watcher', () => {
  test('classes are generated when the html file changes', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    let runningProcess = $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w')
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await appendToInputFile('index.html', html`<div class="font-normal"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
        .font-normal {
          font-weight: 400;
        }
      `
    )

    await appendToInputFile('index.html', html`<div class="bg-red-500"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .bg-red-500 {
          --tw-bg-opacity: 1;
          background-color: rgb(239 68 68 / var(--tw-bg-opacity));
        }
        .font-bold {
          font-weight: 700;
        }
        .font-normal {
          font-weight: 400;
        }
      `
    )

    return runningProcess.stop()
  })

  test('classes are generated when globbed files change', async () => {
    await writeInputFile('glob/index.html', html`<div class="font-bold"></div>`)

    let runningProcess = $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w')
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await appendToInputFile('glob/index.html', html`<div class="font-normal"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
        .font-normal {
          font-weight: 400;
        }
      `
    )

    await appendToInputFile('glob/index.html', html`<div class="bg-red-500"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .bg-red-500 {
          --tw-bg-opacity: 1;
          background-color: rgb(239 68 68 / var(--tw-bg-opacity));
        }
        .font-bold {
          font-weight: 700;
        }
        .font-normal {
          font-weight: 400;
        }
      `
    )

    return runningProcess.stop()
  })

  test('@layers are replaced and cleaned when the html file changes', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)
    await writeInputFile(
      'index.css',
      css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @layer base {
          html {
            scroll-behavior: smooth;
          }
        }
      `
    )

    let runningProcess = $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w')
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await appendToInputFile('index.html', html`<div class="font-normal"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).not.toIncludeCss(css`
      @layer base {
        html {
          scroll-behavior: smooth;
        }
      }
    `)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
        .font-normal {
          font-weight: 400;
        }
      `
    )

    return runningProcess.stop()
  })

  test('classes are generated when the tailwind.config.js file changes', async () => {
    await writeInputFile('index.html', html`<div class="font-bold md:font-medium"></div>`)

    let runningProcess = $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w')
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
        @media (min-width: 768px) {
          .md\:font-medium {
            font-weight: 500;
          }
        }
      `
    )

    await writeInputFile(
      '../tailwind.config.js',
      javascript`
          module.exports = {
            content: ['./src/index.html'],
            theme: {
              extend: {
                screens: {
                  md: '800px'
                },
                fontWeight: {
                  bold: 'bold'
                }
              },
            },
            corePlugins: {
              preflight: false,
            },
            plugins: [],
          }
      `
    )
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: bold;
        }
        @media (min-width: 800px) {
          .md\:font-medium {
            font-weight: 500;
          }
        }
      `
    )

    return runningProcess.stop()
  })

  test('classes are generated when the index.css file changes', async () => {
    await writeInputFile('index.html', html`<div class="btn font-bold"></div>`)

    let runningProcess = $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w')
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await writeInputFile(
      'index.css',
      css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @layer components {
          .btn {
            @apply rounded px-2 py-1;
          }
        }
      `
    )
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .btn {
          border-radius: 0.25rem;
          padding: 0.25rem 0.5rem;
        }
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await writeInputFile(
      'index.css',
      css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @layer components {
          .btn {
            @apply rounded bg-red-500 px-2 py-1;
          }
        }
      `
    )
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .btn {
          border-radius: 0.25rem;
          --tw-bg-opacity: 1;
          background-color: rgb(239 68 68 / var(--tw-bg-opacity));
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
        .font-bold {
          font-weight: 700;
        }
      `
    )

    return runningProcess.stop()
  })

  test('listens for changes to the @config directive', async () => {
    await writeInputFile('index.html', html`<div class="bg-yellow"></div>`)
    await writeInputFile(
      'index.css',
      css`
        @config "./tailwind.config.js";
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `
    )
    await writeInputFile(
      'tailwind.config.js',
      javascript`
        module.exports = {
          content: {
            relative: true,
            files: ['./index.html'],
          },
          theme: {
            extend: {
              colors: {
                yellow: '#ff0',
              }
            },
          },
          corePlugins: {
            preflight: false,
          },
        }
      `
    )
    await writeInputFile(
      'tailwind.2.config.js',
      javascript`
        module.exports = {
          content: {
            relative: true,
            files: ['./index.html'],
          },
          theme: {
            extend: {
              colors: {
                yellow: '#ff7',
              }
            },
          },
          corePlugins: {
            preflight: false,
          },
        }
      `
    )

    let runningProcess = $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w')
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .bg-yellow {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 0 / var(--tw-bg-opacity));
        }
      `
    )

    await writeInputFile(
      'index.css',
      css`
        @config "./tailwind.2.config.js";
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `
    )
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .bg-yellow {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 119 / var(--tw-bg-opacity));
        }
      `
    )

    await writeInputFile(
      'tailwind.2.config.js',
      javascript`
        module.exports = {
          content: {
            relative: true,
            files: ['./index.html'],
          },
          theme: {
            extend: {
              colors: {
                yellow: '#fff',
              }
            },
          },
          corePlugins: {
            preflight: false,
          },
        }
      `
    )
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .bg-yellow {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 255 / var(--tw-bg-opacity));
        }
      `
    )

    return runningProcess.stop()
  })

  test('classes are generated (and kept) when the index.html file changes (and removed when css/config files are changed)', async () => {
    let runningProcess = $('node ../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w')

    // Start with a simple single class
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)
    await runningProcess.onStderr(ready)
    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    // Add another class
    await writeInputFile('index.html', html`<div class="flex font-bold"></div>`)
    await runningProcess.onStderr(ready)
    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .flex {
          display: flex;
        }

        .font-bold {
          font-weight: 700;
        }
      `
    )

    // Remove a class, because of performance reasons both classes will still be in the css file
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)
    await runningProcess.onStderr(ready)
    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .flex {
          display: flex;
        }

        .font-bold {
          font-weight: 700;
        }
      `
    )

    // Save the index.css file, this should trigger a fresh context
    await writeInputFile(
      'index.css',
      css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `
    )
    await runningProcess.onStderr(ready)

    // Only 1 class should stay, because we started from scratch
    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    // Add another class
    await writeInputFile('index.html', html`<div class="flex font-bold"></div>`)
    await runningProcess.onStderr(ready)
    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .flex {
          display: flex;
        }

        .font-bold {
          font-weight: 700;
        }
      `
    )

    // Remove a class, because of performance reasons both classes will still be in the css file
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)
    await runningProcess.onStderr(ready)

    // If everything goes right, then both classes should still be here (because of the performance
    // improvement). If we didn't solve the bug where from now on every save is a fresh context
    // then this only has 1 class. So let's hope there are 2!
    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .flex {
          display: flex;
        }

        .font-bold {
          font-weight: 700;
        }
      `
    )

    return runningProcess.stop()
  })
})
