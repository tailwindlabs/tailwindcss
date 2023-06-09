require('isomorphic-fetch')

let $ = require('../../execute')
let { css, html, javascript } = require('../../syntax')

let { readOutputFile, appendToInputFile, writeInputFile, removeFile } = require('../../io')({
  output: 'dist',
  input: '.',
})

let PORT = 1337

async function fetchCSS() {
  let response = await fetch(`http://localhost:${PORT}/index.css`, {
    headers: {
      Accept: 'text/css',
    },
  })
  return response.text()
}

describe('static build', () => {
  it('should be possible to generate tailwind output', async () => {
    await writeInputFile(
      'index.html',
      html`
        <link rel="stylesheet" href="./index.css" />
        <div class="font-bold"></div>
      `
    )

    await $('vite build', {
      env: { NODE_ENV: 'production', NO_COLOR: '1' },
    })

    expect(await readOutputFile(/index.\w+\.css$/)).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )
  })

  it('can use a tailwind.config.js configuration file with ESM syntax', async () => {
    await writeInputFile(
      'index.html',
      html`
        <link rel="stylesheet" href="./index.css" />
        <div class="z-primary"></div>
      `
    )
    await removeFile('tailwind.config.js')
    await writeInputFile(
      'tailwind.config.js',
      javascript`
        export default {
          content: ['index.html'],
          theme: {
            extend: {
              zIndex: {
                primary: 0,
              },
            },
          },
          corePlugins: {
            preflight: false,
          },
        }
      `
    )

    await $('vite build', {
      env: { NODE_ENV: 'production', NO_COLOR: '1' },
    })

    expect(await readOutputFile(/index.\w+\.css$/)).toIncludeCss(
      css`
        .z-primary {
          z-index: 0;
        }
      `
    )
  })

  it('can use a tailwind.config.ts configuration file', async () => {
    await writeInputFile(
      'index.html',
      html`
        <link rel="stylesheet" href="./index.css" />
        <div class="z-primary"></div>
      `
    )
    await removeFile('tailwind.config.js')
    await writeInputFile(
      'tailwind.config.ts',
      javascript`
        import type { Config } from 'tailwindcss'

        export default {
          content: ['index.html'],
          theme: {
            extend: {
              zIndex: {
                primary: 0,
              },
            },
          },
          corePlugins: {
            preflight: false,
          },
        } satisfies Config
      `
    )

    await $('vite build', {
      env: { NODE_ENV: 'production', NO_COLOR: '1' },
    })

    expect(await readOutputFile(/index.\w+\.css$/)).toIncludeCss(
      css`
        .z-primary {
          z-index: 0;
        }
      `
    )
  })
})

describe('watcher', () => {
  test('classes are generated when the html file changes', async () => {
    await writeInputFile(
      'index.html',
      html`
        <link rel="stylesheet" href="./index.css" />
        <div class="font-bold"></div>
      `
    )

    let runningProcess = $(`vite --port ${PORT}`, {
      env: { NO_COLOR: '1' },
    })
    await runningProcess.onStdout((message) => message.includes('ready in'))

    expect(await fetchCSS()).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await appendToInputFile('index.html', html`<div class="font-normal"></div>`)
    await runningProcess.onStdout((message) => message.includes('page reload'))

    expect(await fetchCSS()).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
        .font-normal {
          font-weight: 400;
        }
      `
    )

    await appendToInputFile('index.html', html`<div class="z-0"></div>`)
    await runningProcess.onStdout((message) => message.includes('page reload'))

    expect(await fetchCSS()).toIncludeCss(
      css`
        .z-0 {
          z-index: 0;
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
    await writeInputFile('index.html', html` <link rel="stylesheet" href="./index.css" /> `)

    await writeInputFile('glob/index.html', html` <div class="font-bold"></div> `)

    let runningProcess = $(`vite --port ${PORT}`, {
      env: { NO_COLOR: '1' },
    })
    await runningProcess.onStdout((message) => message.includes('ready in'))

    expect(await fetchCSS()).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await appendToInputFile('glob/index.html', html`<div class="font-normal"></div>`)
    await runningProcess.onStdout((message) => message.includes('page reload'))

    expect(await fetchCSS()).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
        .font-normal {
          font-weight: 400;
        }
      `
    )

    await appendToInputFile('glob/index.html', html`<div class="z-0"></div>`)
    await runningProcess.onStdout((message) => message.includes('page reload'))

    expect(await fetchCSS()).toIncludeCss(
      css`
        .z-0 {
          z-index: 0;
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

  test('classes are generated when the tailwind.config.js file changes', async () => {
    await writeInputFile(
      'index.html',
      html`
        <link rel="stylesheet" href="./index.css" />
        <div class="font-bold md:font-medium"></div>
      `
    )

    let runningProcess = $(`vite --port ${PORT}`, {
      env: { NO_COLOR: '1' },
    })
    await runningProcess.onStdout((message) => message.includes('ready in'))

    expect(await fetchCSS()).toIncludeCss(
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
      'tailwind.config.js',
      javascript`
        module.exports = {
          content: ['./index.html'],
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
    await runningProcess.onStdout((message) => message.includes('[vite]'))

    expect(await fetchCSS()).toIncludeCss(
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
    await writeInputFile(
      'index.html',
      html`
        <link rel="stylesheet" href="./index.css" />
        <div class="btn font-bold"></div>
      `
    )

    let runningProcess = $(`vite --port ${PORT}`, {
      env: { NO_COLOR: '1' },
    })
    await runningProcess.onStdout((message) => message.includes('ready in'))

    expect(await fetchCSS()).toIncludeCss(
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
    await runningProcess.onStdout((message) => message.includes('hmr update /index.css'))

    expect(await fetchCSS()).toIncludeCss(
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
            @apply rounded z-0 px-2 py-1;
          }
        }
      `
    )
    await runningProcess.onStdout((message) => message.includes('hmr update /index.css'))

    expect(await fetchCSS()).toIncludeCss(
      css`
        .btn {
          z-index: 0;
          border-radius: 0.25rem;
          padding: 0.25rem 0.5rem;
        }
        .font-bold {
          font-weight: 700;
        }
      `
    )

    return runningProcess.stop()
  })
})
