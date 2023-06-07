let $ = require('../../execute')
let { css, html, javascript } = require('../../syntax')

let {
  appendToInputFile,
  readOutputFile,
  removeFile,
  waitForOutputFileChange,
  waitForOutputFileCreation,
  writeInputFile,
} = require('../../io')({ output: 'dist', input: 'src' })

describe('static build', () => {
  it('should be possible to generate tailwind output', async () => {
    await writeInputFile(
      'index.html',
      html`
        <link rel="stylesheet" href="./index.css" />
        <div class="font-bold"></div>
      `
    )

    await $('parcel build ./src/index.html --no-cache', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )
  })

  it('can use a tailwind.config.js configuration file with ESM syntax', async () => {
    await removeFile('tailwind.config.js')
    await writeInputFile(
      'index.html',
      html`
        <link rel="stylesheet" href="./index.css" />
        <div class="z-primary"></div>
      `
    )
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

    await $('parcel build ./src/index.html --no-cache', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
      css`
        .z-primary {
          z-index: 0;
        }
      `
    )
  })

  it('can use a tailwind.config.ts configuration file', async () => {
    await removeFile('tailwind.config.js')
    await writeInputFile(
      'index.html',
      html`
        <link rel="stylesheet" href="./index.css" />
        <div class="z-primary"></div>
      `
    )
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

    await $('parcel build ./src/index.html --no-cache', {
      env: { NODE_ENV: 'production' },
    })

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
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

    let runningProcess = $('parcel watch ./src/index.html --no-cache')

    await waitForOutputFileCreation(/index\.\w+\.css$/)

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await waitForOutputFileChange(/index\.\w+\.css$/, async () => {
      await appendToInputFile('index.html', html`<div class="font-normal"></div>`)
    })

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
        .font-normal {
          font-weight: 400;
        }
      `
    )

    await waitForOutputFileChange(/index\.\w+\.css$/, async () => {
      await appendToInputFile('index.html', html`<div class="z-0"></div>`)
    })

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
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

  test.skip('classes are generated when globbed files change', async () => {
    await writeInputFile('index.html', html` <link rel="stylesheet" href="./index.css" /> `)

    await writeInputFile('glob/index.html', html` <div class="font-bold"></div> `)

    let runningProcess = $('parcel watch ./src/index.html --no-cache')

    await waitForOutputFileCreation(/index\.\w+\.css$/)

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await waitForOutputFileChange(/index\.\w+\.css$/, async () => {
      await appendToInputFile('glob/index.html', html`<div class="font-normal"></div>`)
    })

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
        .font-normal {
          font-weight: 400;
        }
      `
    )

    await waitForOutputFileChange(/index\.\w+\.css$/, async () => {
      await appendToInputFile('glob/index.html', html`<div class="z-0"></div>`)
    })

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
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

    let runningProcess = $('parcel watch ./src/index.html --no-cache')

    await waitForOutputFileCreation(/index\.\w+\.css$/)

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
        @media (width >= 768px) {
          .md\:font-medium {
            font-weight: 500;
          }
        }
      `
    )

    await waitForOutputFileChange(/index\.\w+\.css$/, async () => {
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
    })

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
      css`
        .font-bold {
          font-weight: bold;
        }
        @media (width >= 800px) {
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

    let runningProcess = $('parcel watch ./src/index.html --no-cache')

    await waitForOutputFileCreation(/index\.\w+\.css$/)

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await waitForOutputFileChange(/index\.\w+\.css$/, async () => {
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
    })

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
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

    await waitForOutputFileChange(/index\.\w+\.css$/, async () => {
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
    })

    expect(await readOutputFile(/index\.\w+\.css$/)).toIncludeCss(
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
