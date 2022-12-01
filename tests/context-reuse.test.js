const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const tailwind = require('../src/index.js')
const sharedState = require('../src/lib/sharedState.js')
const configPath = path.resolve(__dirname, './context-reuse.tailwind.config.js')
const { css } = require('./util/run.js')

function run(input, config = {}, from = null) {
  let { currentTestName } = expect.getState()

  from = `${path.resolve(__filename)}?test=${currentTestName}&${from}`

  return postcss(tailwind(config)).process(input, { from })
}

beforeEach(async () => {
  let config = {
    content: [path.resolve(__dirname, './context-reuse.test.html')],
    corePlugins: { preflight: false },
  }

  await fs.promises.writeFile(configPath, `module.exports = ${JSON.stringify(config)};`)
})

afterEach(async () => {
  await fs.promises.unlink(configPath)
})

it('re-uses the context across multiple files with the same config', async () => {
  let results = [
    await run(`@tailwind utilities;`, configPath, `id=1`),

    // Using @apply directives should still re-use the context
    // They depend on the config but do not the other way around
    await run(`body { @apply bg-blue-400; }`, configPath, `id=2`),
    await run(`body { @apply text-red-400; }`, configPath, `id=3`),
    await run(`body { @apply mb-4; }`, configPath, `id=4`),
  ]

  let dependencies = results.map((result) => {
    return result.messages
      .filter((message) => message.type === 'dependency')
      .map((message) => message.file)
  })

  // The content files don't have any utilities in them so this should be empty
  expect(results[0].css).toMatchFormattedCss(css``)

  // However, @apply is being used so we want to verify that they're being inlined into the CSS rules
  expect(results[1].css).toMatchFormattedCss(css`
    body {
      --tw-bg-opacity: 1;
      background-color: rgb(96 165 250 / var(--tw-bg-opacity));
    }
  `)

  expect(results[2].css).toMatchFormattedCss(css`
    body {
      --tw-text-opacity: 1;
      color: rgb(248 113 113 / var(--tw-text-opacity));
    }
  `)

  expect(results[3].css).toMatchFormattedCss(css`
    body {
      margin-bottom: 1rem;
    }
  `)

  // Files with @tailwind directives depends on the PostCSS tree, config, AND any content files
  expect(dependencies[0]).toEqual([
    path.resolve(__dirname, 'context-reuse.test.html'),
    path.resolve(__dirname, 'context-reuse.tailwind.config.js'),
  ])

  // @apply depends only on the containing PostCSS tree *and* the config file but no content files
  // as they cannot affect the outcome of the @apply directives
  expect(dependencies[1]).toEqual([path.resolve(__dirname, 'context-reuse.tailwind.config.js')])

  expect(dependencies[2]).toEqual([path.resolve(__dirname, 'context-reuse.tailwind.config.js')])

  expect(dependencies[3]).toEqual([path.resolve(__dirname, 'context-reuse.tailwind.config.js')])

  // And none of this should have resulted in multiple contexts being created
  expect(sharedState.contextSourcesMap.size).toBe(1)
})

it('updates layers when any CSS containing @tailwind directives changes', async () => {
  let result

  // Compile the initial version once
  let input = css`
    @tailwind utilities;
    @layer utilities {
      .custom-utility {
        color: orange;
      }
    }
  `

  result = await run(input, configPath, `id=1`)

  expect(result.css).toMatchFormattedCss(css`
    .only\:custom-utility:only-child {
      color: orange;
    }
  `)

  // Save the file with a change
  input = css`
    @tailwind utilities;
    @layer utilities {
      .custom-utility {
        color: blue;
      }
    }
  `

  result = await run(input, configPath, `id=1`)

  expect(result.css).toMatchFormattedCss(css`
    .only\:custom-utility:only-child {
      color: blue;
    }
  `)
})
