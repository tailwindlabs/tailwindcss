let $ = require('../../execute')
let { css, html, javascript } = require('../../syntax')

let { readOutputFile, appendToInputFile, writeInputFile, removeFile } = require('../../io')({
  output: 'dist',
  input: 'src',
})

function ready(message) {
  return message.includes('created')
}

describe('static build', () => {
  it('should be possible to generate tailwind output', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    await $('rollup -c', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile('index.css')).toIncludeCss(
      css`
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

    await $('rollup -c', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile('index.css')).toIncludeCss(
      css`
        .bg-primary {
          --tw-bg-opacity: 1;
          background-color: rgb(0 0 0 / var(--tw-bg-opacity));
        }
      `
    )
  })

  it('can use a tailwind.config.ts configuration file', async () => {
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
      '../tailwind.config.ts',
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

    await $('rollup -c', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile('index.css')).toIncludeCss(
      css`
        .bg-primary {
          --tw-bg-opacity: 1;
          background-color: rgb(0 0 0 / var(--tw-bg-opacity));
        }
      `
    )
  })
})

describe('watcher', () => {
  test(`classes are generated when the html file changes`, async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    let runningProcess = $('rollup -c --watch')
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('index.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await appendToInputFile('index.html', html`<div class="font-normal"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('index.css')).toIncludeCss(
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

    expect(await readOutputFile('index.css')).toIncludeCss(
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

  test(`classes are generated when globbed files change`, async () => {
    await writeInputFile('glob/index.html', html`<div class="font-bold"></div>`)

    let runningProcess = $('rollup -c --watch')
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('index.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await appendToInputFile('glob/index.html', html`<div class="font-normal"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('index.css')).toIncludeCss(
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

    expect(await readOutputFile('index.css')).toIncludeCss(
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

  test(`classes are generated when the tailwind.config.js file changes`, async () => {
    await writeInputFile('index.html', html`<div class="font-bold md:font-medium"></div>`)

    let runningProcess = $('rollup -c --watch')
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('index.css')).toIncludeCss(
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

    expect(await readOutputFile('index.css')).toIncludeCss(
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

  test(`classes are generated when the index.css file changes`, async () => {
    await writeInputFile('index.html', html`<div class="btn font-bold"></div>`)

    let runningProcess = $('rollup -c --watch')
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('index.css')).toIncludeCss(
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

    expect(await readOutputFile('index.css')).toIncludeCss(
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

    expect(await readOutputFile('index.css')).toIncludeCss(
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
})
