let fs = require('fs')
let path = require('path')
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
          safelist: ['flex','block'],
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
        .block {
          display: block;
        }

        .flex {
          display: flex;
        }

        .font-bold {
          font-weight: 700;
        }
      `
    )
  })

  it('can use a tailwind.config.js configuration file with ESM syntax', async () => {
    await removeFile('tailwind.config.js')
    await writeInputFile('index.html', html`<div class="z-primary"></div>`)
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
                primary: 0
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
        .z-primary {
          z-index: 0;
        }
      `
    )
  })

  it('can use a tailwind.config.ts configuration file', async () => {
    await removeFile('tailwind.config.js')
    await writeInputFile('index.html', html`<div class="z-primary"></div>`)
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
                primary: 0
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
        .z-primary {
          z-index: 0;
        }
      `
    )
  })

  it('can read from a config file from an @config directive', async () => {
    await writeInputFile('index.html', html`<div class="z-primary"></div>`)
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
              zIndex: {
                primary: 0
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
        .z-primary {
          z-index: 0;
        }
      `
    )
  })

  it('can read from a config file from an @config directive inside an @import from postcss-import', async () => {
    await fs.promises.mkdir('./src/config', { recursive: true })

    await writeInputFile('index.html', html`<div class="z-primary"></div>`)
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
              zIndex: {
                primary: 0
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
        .z-primary {
          z-index: 0;
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
            files: [{ raw: 'flex'}],
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
        .flex {
          display: flex;
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

    await appendToInputFile('index.html', html`<div class="flex"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .flex {
          display: flex;
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

    await appendToInputFile('glob/index.html', html`<div class="flex"></div>`)
    await runningProcess.onStderr(ready)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .flex {
          display: flex;
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
            @apply rounded flex px-2 py-1;
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
          display: flex;
        }
        .font-bold {
          font-weight: 700;
        }
      `
    )

    return runningProcess.stop()
  })

  test('listens for changes to the @config directive', async () => {
    await writeInputFile('index.html', html`<div class="z-primary"></div>`)
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
              zIndex: {
                primary: 0
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
              zIndex: {
                primary: 10
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
        .z-primary {
          z-index: 0;
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
        .z-primary {
          z-index: 10;
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
              zIndex: {
                primary: 20
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
        .z-primary {
          z-index: 20;
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

  describe('auto content', () => {
    let { readOutputFile, writeInputFile } = require('../../io')({
      output: 'fixtures/example-app/dist',
      input: 'fixtures/example-app/src',
    })
    let options = {
      cwd: path.resolve(__dirname, '..', 'fixtures', 'example-app'),
    }

    it('should detect classes in existing files', async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            corePlugins: {
              preflight: false,
            },
          }
        `
      )

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )

      await writeInputFile('index.html', html`<div class="font-bold"></div>`)
      await runningProcess.onStderr(ready)

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .font-bold {
            font-weight: 700;
          }
        `
      )

      return runningProcess.stop()
    })

    it('should detect changes in existing files', async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            corePlugins: {
              preflight: false,
            },
          }
        `
      )

      await writeInputFile('index.html', html`<div class="font-bold"></div>`)

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )
      await runningProcess.onStderr(ready)

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .font-bold {
            font-weight: 700;
          }
        `
      )

      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .underline {
            text-decoration-line: underline;
          }
        `
      )

      // Make a change

      await writeInputFile('index.html', html`<div class="underline"></div>`)
      await runningProcess.onStderr(ready)

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .underline {
            text-decoration-line: underline;
          }
        `
      )

      return runningProcess.stop()
    })

    it('should detect changes in new files in existing folders with a known extension', async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            corePlugins: {
              preflight: false,
            },
          }
        `
      )

      await writeInputFile('index.html', html`<div class="font-bold"></div>`)

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )
      await runningProcess.onStderr(ready)

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .font-bold {
            font-weight: 700;
          }
        `
      )

      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .underline {
            text-decoration-line: underline;
          }
        `
      )

      // Make a change to a new file in an existing folder with a known extension.

      await writeInputFile('other.html', html`<div class="underline"></div>`)
      await runningProcess.onStderr(ready)

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .underline {
            text-decoration-line: underline;
          }
        `
      )

      return runningProcess.stop()
    })

    it('should not scan ignored files', async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            corePlugins: {
              preflight: false,
            },
          }
        `
      )
      await writeInputFile('../.gitignore', 'generated-folder/')
      await writeInputFile('../generated-folder/bad.html', html`<div class="italic"></div>`)
      await writeInputFile('index.html', html`<div class="font-bold"></div>`)

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )
      await runningProcess.onStderr(ready)

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .font-bold {
            font-weight: 700;
          }
        `
      )

      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .italic {
            font-style: italic;
          }
        `
      )

      return runningProcess.stop()
    })

    it('should not scan for known binary files', async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            corePlugins: {
              preflight: false,
            },
          }
        `
      )
      await writeInputFile('example-1.png', html`<div class="italic"></div>`)
      await writeInputFile('example-2.mp4', html`<div class="underline"></div>`)
      await writeInputFile('index.html', html`<div class="font-bold"></div>`)

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )
      await runningProcess.onStderr(ready)

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .font-bold {
            font-weight: 700;
          }
        `
      )

      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .italic {
            font-style: italic;
          }

          .underline {
            text-decoration-line: underline;
          }
        `
      )

      return runningProcess.stop()
    })

    it('should not scan for explicitly ignored extensions (such as css/scss/less/...)', async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            corePlugins: {
              preflight: false,
            },
          }
        `
      )
      await writeInputFile('example.css', html`<div class="italic"></div>`)
      await writeInputFile('example.less', html`<div class="underline"></div>`)
      await writeInputFile('index.html', html`<div class="font-bold"></div>`)

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )
      await runningProcess.onStderr(ready)

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .font-bold {
            font-weight: 700;
          }
        `
      )

      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .italic {
            font-style: italic;
          }

          .underline {
            text-decoration-line: underline;
          }
        `
      )

      return runningProcess.stop()
    })

    it('should not scan for explicitly ignored files (such as package-lock.json)', async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            corePlugins: {
              preflight: false,
            },
          }
        `
      )
      await writeInputFile('package-lock.json', html`<div class="italic"></div>`)
      await writeInputFile('yarn.lock', html`<div class="italic"></div>`)
      await writeInputFile('pnpm-lock.yaml', html`<div class="italic"></div>`)
      await writeInputFile('index.html', html`<div class="font-bold"></div>`)

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )
      await runningProcess.onStderr(ready)

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .font-bold {
            font-weight: 700;
          }
        `
      )

      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .italic {
            font-style: italic;
          }
        `
      )

      return runningProcess.stop()
    })

    it('should not include the tailwind.config.js file as a template file', async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          // Example class that should not be included: flex italic
          module.exports = {
            corePlugins: {
              preflight: false,
            },
          }
        `
      )
      await writeInputFile('index.html', html`<div class="font-bold"></div>`)

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )
      await runningProcess.onStderr(ready)

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .font-bold {
            font-weight: 700;
          }
        `
      )

      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .flex {
            display: flex;
          }
        `
      )
      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .italic {
            font-style: italic;
          }
        `
      )

      return runningProcess.stop()
    })

    it('should optimize the globs and ensure that nested ignored folders are not scanned', async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            corePlugins: {
              preflight: false,
            },
          }
        `
      )

      await writeInputFile('../.gitignore', 'node_modules')
      await writeInputFile('../node_modules/a.html', html`<div class="z-10"></div>`)
      await writeInputFile('index.html', html`<div class="z-20"></div>`)
      await writeInputFile('nested/index.html', html`<div class="z-30"></div>`)
      await writeInputFile('nested/node_modules/index.html', html`<div class="z-40"></div>`)

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )
      await runningProcess.onStderr(ready)

      // Root node_modules
      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .z-10 {
            z-index: 10;
          }
        `
      )

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .z-20 {
            z-index: 20;
          }
        `
      )

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .z-30 {
            z-index: 30;
          }
        `
      )

      // Nested node_modules
      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .z-40 {
            z-index: 40;
          }
        `
      )

      return runningProcess.stop()
    })

    it("should use auto content when content is explicitly set to 'auto'", async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            content: 'auto',
            corePlugins: {
              preflight: false,
            },
          }
        `
      )

      await writeInputFile('../.gitignore', 'node_modules')
      await writeInputFile('../node_modules/a.html', html`<div class="z-10"></div>`)
      await writeInputFile('index.html', html`<div class="z-20"></div>`)
      await writeInputFile('nested/index.html', html`<div class="z-30"></div>`)
      await writeInputFile('nested/node_modules/index.html', html`<div class="z-40"></div>`)

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )
      await runningProcess.onStderr(ready)

      // Root node_modules
      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .z-10 {
            z-index: 10;
          }
        `
      )

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .z-20 {
            z-index: 20;
          }
        `
      )

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .z-30 {
            z-index: 30;
          }
        `
      )

      // Nested node_modules
      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .z-40 {
            z-index: 40;
          }
        `
      )

      return runningProcess.stop()
    })

    it('should be possible to merge "auto" and custom defined paths', async () => {
      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            content: ['auto'], // Ignoring the library-example.html file for now
            corePlugins: {
              preflight: false,
            },
          }
        `
      )

      await writeInputFile('../.gitignore', 'node_modules')
      await writeInputFile('../node_modules/library-example.html', html`<div class="z-10"></div>`)
      await writeInputFile('index.html', html`<div class="z-20"></div>`)

      let runningProcess = $(
        'node ../../../../lib/cli.js -i ./src/index.css -o ./dist/main.css -w',
        options
      )
      await runningProcess.onStderr(ready)

      // example.html should be ignored right now
      expect(await readOutputFile('main.css')).not.toIncludeCss(
        css`
          .z-10 {
            z-index: 10;
          }
        `
      )

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .z-20 {
            z-index: 20;
          }
        `
      )

      await writeInputFile(
        '../tailwind.config.js',
        javascript`
          module.exports = {
            content: ['auto', 'node_modules/library-example.html'], // Explicitly adding the library-example.html file
            corePlugins: {
              preflight: false,
            },
          }
        `
      )
      await runningProcess.onStderr(ready)

      // z-10 from `example.html` should be available now
      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .z-10 {
            z-index: 10;
          }
        `
      )

      expect(await readOutputFile('main.css')).toIncludeCss(
        css`
          .z-20 {
            z-index: 20;
          }
        `
      )

      return runningProcess.stop()
    })
  })
})
