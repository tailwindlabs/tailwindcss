let $ = require('../../execute')
let { css, html, javascript } = require('../../syntax')

let { readOutputFile, appendToInputFile, writeInputFile } = require('../../io')({
  output: 'dist',
  input: 'src',
})

function ready(message) {
  return message.includes('Finished')
}

describe('static build', () => {
  it('should be possible to generate tailwind output', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    await $('postcss ./src/index.css -o ./dist/main.css', {
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
})

describe('watcher', () => {
  test('classes are generated when the html file changes', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    let runningProcess = $('postcss ./src/index.css -o ./dist/main.css -w --verbose')
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

    await appendToInputFile('index.html', html`<div class="z-0"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
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
    await writeInputFile('glob/index.html', html`<div class="font-bold"></div>`)

    let runningProcess = $('postcss ./src/index.css -o ./dist/main.css -w --verbose')
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

    await appendToInputFile('glob/index.html', html`<div class="z-0"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
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
    await writeInputFile('index.html', html`<div class="font-bold md:font-medium"></div>`)

    let runningProcess = $('postcss ./src/index.css -o ./dist/main.css -w --verbose')

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

    let runningProcess = $('postcss ./src/index.css -o ./dist/main.css -w --verbose')

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
            @apply rounded z-0 px-2 py-1;
          }
        }
      `
    )
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
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
