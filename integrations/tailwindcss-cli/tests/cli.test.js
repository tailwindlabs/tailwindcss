let path = require('path')
let $ = require('../../execute')
let { css, html, javascript } = require('../../syntax')
let resolveToolRoot = require('../../resolve-tool-root')

let version = require('../../../package.json').version

let {
  cleanupFile,
  fileExists,
  readOutputFile,
  removeFile,
  waitForOutputFileCreation,
  writeInputFile,
} = require('../../io')({
  output: 'dist',
  input: 'src',
})

let EXECUTABLE = 'node ../../lib/cli.js'

function dedent(input) {
  let lines = input.split('\n')

  let minIndent = lines.reduce(
    (min, line) => Math.min(min, line.trim() === '' ? Infinity : line.match(/^\s*/)[0].length),
    Infinity
  )

  return lines
    .map((line) => line.slice(minIndent))
    .join('\n')
    .trim()
}

describe('Build command', () => {
  test('--output', async () => {
    await writeInputFile('index.html', html`<div class="font-bold shadow"></div>`)

    await $(`${EXECUTABLE} --output ./dist/main.css`)

    let contents = await readOutputFile('main.css')

    // `-i` is omitted, therefore the default `@tailwind base; @tailwind
    // components; @tailwind utilities` is used. However `preflight` is
    // disabled. I still want to verify that the `base` got included.
    expect(contents).toContain('--tw-ring-offset-shadow: 0 0 #0000')
    expect(contents).toContain('--tw-ring-shadow: 0 0 #0000')
    expect(contents).toContain('--tw-shadow: 0 0 #0000')

    // Verify `utilities` output is correct
    expect(contents).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )
  })

  test('--input, --output', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    await $(`${EXECUTABLE} --input ./src/index.css --output ./dist/main.css`)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )
  })

  test('--minify', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    await $(`${EXECUTABLE} --output ./dist/main.css --minify`)
    let withMinify = await readOutputFile('main.css')

    // Verify that we got the expected output. Note: `.toIncludeCss` formats
    // `actual` & `expected`
    expect(withMinify).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    await $(`${EXECUTABLE} --output ./dist/main.css`)
    let withoutMinify = await readOutputFile('main.css')

    // Let's verify that the actual minified output is smaller than the not
    // minified version.
    expect(withoutMinify.length).toBeGreaterThan(withMinify.length)
  })

  test('--minify does not break nested CSS', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)
    await writeInputFile(
      'input.css',
      css`
        .parent {
          & .child {
            color: red;
          }
          & .child {
            &:not([href]) {
              color: green;
            }
          }
        }
      `
    )

    await $(`${EXECUTABLE} --input ./src/input.css --output ./dist/main.css --minify`)
    let withMinify = await readOutputFile('main.css')

    // Verify that we got the expected output. Note: `.toIncludeCss` formats
    // `actual` & `expected`
    expect(withMinify).toIncludeCss(
      css`
        .parent {
          & .child {
            color: red;
          }
          & .child {
            &:not([href]) {
              color: green;
            }
          }
        }
      `
    )
  })

  test('--no-autoprefixer', async () => {
    await writeInputFile('index.html', html`<div class="select-none"></div>`)

    await $(`${EXECUTABLE} --output ./dist/main.css`)
    let withAutoprefixer = await readOutputFile('main.css')

    expect(withAutoprefixer).toIncludeCss(css`
      .select-none {
        -webkit-user-select: none;
        user-select: none;
      }
    `)

    await $(`${EXECUTABLE} --output ./dist/main.css --no-autoprefixer`)
    let withoutAutoprefixer = await readOutputFile('main.css')

    expect(withoutAutoprefixer).toIncludeCss(css`
      .select-none {
        user-select: none;
      }
    `)
  })

  test('--config (non-existing config file)', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    let { stderr } = await $(
      `${EXECUTABLE} --output ./dist/main.css --config ./non-existing.config.js`
    ).catch((err) => err)

    let toolRoot = resolveToolRoot()
    expect(stderr).toEqual(
      `Specified config file ${path.resolve(toolRoot, 'non-existing.config.js')} does not exist.\n`
    )
  })

  test('--config (existing config file)', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    let customConfig = `module.exports = ${JSON.stringify(
      {
        content: ['./src/index.html'],
        theme: {
          extend: {
            fontWeight: {
              bold: 'BOLD',
            },
          },
        },
        corePlugins: {
          preflight: false,
        },
        plugins: [],
      },

      null,
      2
    )}`

    await writeInputFile('../custom.config.js', customConfig)

    await $(`${EXECUTABLE} --output ./dist/main.css --config ./custom.config.js`)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: BOLD;
        }
      `
    )
  })

  test('--content', async () => {
    await writeInputFile('other.html', html`<div class="font-bold"></div>`)

    await $(`${EXECUTABLE} --content ./src/other.html --output ./dist/main.css`)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )
  })

  test('--postcss (postcss.config.js)', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    let customConfig = javascript`
      let path = require('path')
      let postcss = require('postcss')

      module.exports = {
        plugins: [
          function before(root, result) {
            // Inject a custom component with @apply rules to prove that we run
            // this _before_ the actual tailwind plugin.
            let btn = postcss.parse('.btn { @apply bg-red-500 px-2 py-1 }')
            root.append(btn.nodes)
          },
          function tailwindcss() {
            return require(path.resolve('..', '..'))
          },
          function after(root, result) {
            // Add '-after' to all the selectors
            root.walkRules(rule => {
              if (!rule.selector.startsWith('.')) return
              rule.selector = rule.selector + '-after'
            })
          },
        ],
      }
    `

    await writeInputFile('../postcss.config.js', customConfig)

    await $(`${EXECUTABLE} --output ./dist/main.css --postcss`)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold-after {
          font-weight: 700;
        }

        .btn-after {
          --tw-bg-opacity: 1;
          background-color: rgb(239 68 68 / var(--tw-bg-opacity));
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
      `
    )
  })

  test('--postcss (custom.postcss.config.js)', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    let customConfig = javascript`
      let path = require('path')
      let postcss = require('postcss')

      module.exports = {
        plugins: [
          function before(root, result) {
            // Inject a custom component with @apply rules to prove that we run
            // this _before_ the actual tailwind plugin.
            let btn = postcss.parse('.btn { @apply bg-red-500 px-2 py-1 }')
            root.append(btn.nodes)
          },
          function tailwindcss() {
            return require(path.resolve('..', '..'))
          },
          function after(root, result) {
            // Add '-after' to all the selectors
            root.walkRules(rule => {
              if (!rule.selector.startsWith('.')) return
              rule.selector = rule.selector + '-after'
            })
          },
        ],
      }
    `

    await writeInputFile('../custom.postcss.config.js', customConfig)

    await $(`${EXECUTABLE} --output ./dist/main.css --postcss ./custom.postcss.config.js`)

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        .font-bold-after {
          font-weight: 700;
        }

        .btn-after {
          --tw-bg-opacity: 1;
          background-color: rgb(239 68 68 / var(--tw-bg-opacity));
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
      `
    )
  })

  test('--postcss supports process options', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    let customConfig = javascript`
      let path = require('path')
      let postcss = require('postcss')

      module.exports = {
        map: { inline: true },
        plugins: [
          function tailwindcss() {
            return require(path.resolve('..', '..'))
          },
        ],
      }
    `

    await writeInputFile('../postcss.config.js', customConfig)

    await $(`${EXECUTABLE} --output ./dist/main.css --postcss`)

    let contents = await readOutputFile('main.css')

    expect(contents).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    expect(contents).toContain(`/*# sourceMappingURL`)
  })

  test('--postcss supports process options with custom config', async () => {
    await writeInputFile('index.html', html`<div class="font-bold"></div>`)

    let customConfig = javascript`
      let path = require('path')
      let postcss = require('postcss')

      module.exports = {
        map: { inline: true },
        plugins: [
          function tailwindcss() {
            return require(path.resolve('..', '..'))
          },
        ],
      }
    `

    await writeInputFile('../custom.postcss.config.js', customConfig)

    await $(`${EXECUTABLE} --output ./dist/main.css --postcss ./custom.postcss.config.js`)

    let contents = await readOutputFile('main.css')

    expect(contents).toIncludeCss(
      css`
        .font-bold {
          font-weight: 700;
        }
      `
    )

    expect(contents).toContain(`/*# sourceMappingURL`)
  })

  test('postcss-import is supported by default', async () => {
    cleanupFile('src/test.css')

    await writeInputFile('index.html', html`<div class="md:something-cool"></div>`)
    await writeInputFile(
      'test.css',
      css`
        @import 'tailwindcss/base';
        @import 'tailwindcss/components';
        @import 'tailwindcss/utilities';
        @import './imported.css';
      `
    )

    await $(
      `${EXECUTABLE} --input ./src/test.css --content ./src/index.html --output ./dist/main.css`
    )

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        @media (min-width: 768px) {
          .md\:something-cool {
            color: red;
          }
        }
      `
    )
  })

  test('postcss-import is supported by default in watch mode', async () => {
    cleanupFile('src/test.css')

    await writeInputFile('index.html', html`<div class="md:something-cool"></div>`)
    await writeInputFile(
      'test.css',
      css`
        @import 'tailwindcss/base';
        @import 'tailwindcss/components';
        @import 'tailwindcss/utilities';
        @import './imported.css';
      `
    )

    let runningProcess = $(
      `${EXECUTABLE} --watch --input ./src/test.css --content ./src/index.html --output ./dist/main.css`
    )

    await waitForOutputFileCreation('main.css')

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        @media (min-width: 768px) {
          .md\:something-cool {
            color: red;
          }
        }
      `
    )

    await writeInputFile(
      'imported.css',
      css`
        @layer utilities {
          .something-cool {
            color: blue;
          }
        }
      `
    )

    await runningProcess.onStderr(function ready(message) {
      return message.includes('Done in')
    })

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        @media (min-width: 768px) {
          .md\:something-cool {
            color: blue;
          }
        }
      `
    )

    return runningProcess.stop()
  })

  test('postcss-import is included when using a custom postcss configuration', async () => {
    cleanupFile('src/test.css')

    await writeInputFile('index.html', html`<div class="md:something-cool"></div>`)
    await writeInputFile(
      'test.css',
      css`
        @import 'tailwindcss/base';
        @import 'tailwindcss/components';
        @import 'tailwindcss/utilities';
        @import './imported.css';
      `
    )

    await $(
      `${EXECUTABLE} --input ./src/test.css --content ./src/index.html --output ./dist/main.css --postcss`
    )

    expect(await readOutputFile('main.css')).toIncludeCss(
      css`
        @import './imported.css';
      `
    )
  })

  test('--help', async () => {
    let { combined } = await $(`${EXECUTABLE} --help`)

    expect(dedent(combined)).toEqual(
      dedent(`
          tailwindcss v${version}

          Usage:
             tailwindcss build [options]

          Options:
             -i, --input              Input file
             -o, --output             Output file
             -w, --watch              Watch for changes and rebuild as needed
             -p, --poll               Use polling instead of filesystem events when watching
                 --content            Content paths to use for removing unused classes
                 --postcss            Load custom PostCSS configuration
             -m, --minify             Minify the output
             -c, --config             Path to a custom config file
                 --no-autoprefixer    Disable autoprefixer
             -h, --help               Display usage information
        `)
    )
  })
})

describe('Init command', () => {
  it.each([
    { flags: [], name: 'tailwind.config.js' },
    { flags: ['--ts'], name: 'tailwind.config.ts' },
    { flags: ['--esm'], name: 'tailwind.config.js' },
    { flags: ['--full'], name: 'tailwind.config.js' },
    { flags: ['--ts', '--full'], name: 'tailwind.config.ts' },
    { flags: ['--esm', '--full'], name: 'tailwind.config.js' },
  ])('works with all these flags: %j', async ({ flags, name }) => {
    cleanupFile(name)
    await removeFile(name)

    let { combined } = await $(`${EXECUTABLE} init ${flags.join(' ')}`)

    expect(combined).toMatchInlineSnapshot(`
      "
      Created Tailwind CSS config file: ${name}
      "
    `)

    expect(await fileExists(name)).toBe(true)

    let content = await readOutputFile(`../${name}`)

    if (flags.includes('--ts') || flags.includes('--esm')) {
      expect(content).toContain('export default')
      expect(content).not.toContain('module.exports =')
    } else {
      expect(content).toContain('module.exports =')
      expect(content).not.toContain('export default')
    }

    if (flags.includes('--ts')) {
      expect(content).toContain('satisfies Config')
    }

    if (flags.includes('--full')) {
      expect(content.split('\n').length).toBeGreaterThan(50)
    }
  })

  test('--full', async () => {
    cleanupFile('full.config.js')

    let { combined } = await $(`${EXECUTABLE} init full.config.js --full`)

    expect(combined).toMatchInlineSnapshot(`
      "
      Created Tailwind CSS config file: full.config.js
      "
    `)

    // Not a clean way to test this. We could require the file and verify that
    // multiple keys in `theme` exists. However it loads `tailwindcss/colors`
    // which doesn't exists in this context.
    expect((await readOutputFile('../full.config.js')).split('\n').length).toBeGreaterThan(50)
  })

  test('--postcss', async () => {
    expect(await fileExists('postcss.config.js')).toBe(true)
    await removeFile('postcss.config.js')
    expect(await fileExists('postcss.config.js')).toBe(false)

    let { combined } = await $(`${EXECUTABLE} init --postcss`)

    expect(await fileExists('postcss.config.js')).toBe(true)

    expect(combined).toMatchInlineSnapshot(`
      "
      tailwind.config.js already exists.
      Created PostCSS config file: postcss.config.js
      "
    `)
  })

  test('--help', async () => {
    let { combined } = await $(`${EXECUTABLE} init --help`)

    expect(dedent(combined)).toEqual(
      dedent(`
        tailwindcss v${version}

        Usage:
           tailwindcss init [options]

        Options:
               --esm                Initialize configuration file as ESM
               --ts                 Initialize configuration file as TypeScript
           -p, --postcss            Initialize a \`postcss.config.js\` file
           -f, --full               Include the default values for all options in the generated configuration file
           -h, --help               Display usage information
      `)
    )
  })

  test('ESM config is created by default in an ESM project', async () => {
    cleanupFile('tailwind.config.js')
    await removeFile('tailwind.config.js')

    let pkg = await readOutputFile('../package.json')

    await writeInputFile(
      '../package.json',
      JSON.stringify({
        ...JSON.parse(pkg),
        type: 'module',
      })
    )

    let { combined } = await $(`${EXECUTABLE} init`)

    expect(combined).toMatchInlineSnapshot(`
      "
      Created Tailwind CSS config file: tailwind.config.js
      "
    `)

    expect(await fileExists('./tailwind.config.js')).toBe(true)

    // Not a clean way to test this.
    expect(await readOutputFile('../tailwind.config.js')).toContain('export default')

    await writeInputFile('../package.json', pkg)
  })

  test('CJS config is created by default in a non-ESM project', async () => {
    cleanupFile('tailwind.config.js')
    await removeFile('tailwind.config.js')

    let pkg = await readOutputFile('../package.json')

    await writeInputFile(
      '../package.json',
      JSON.stringify({
        ...JSON.parse(pkg),
      })
    )

    let { combined } = await $(`${EXECUTABLE} init`)

    expect(combined).toMatchInlineSnapshot(`
      "
      Created Tailwind CSS config file: tailwind.config.js
      "
    `)

    expect(await fileExists('./tailwind.config.js')).toBe(true)

    // Not a clean way to test this.
    expect(await readOutputFile('../tailwind.config.js')).toContain('module.exports')

    await writeInputFile('../package.json', pkg)
  })
})
