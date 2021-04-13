// @ts-check

const { set } = require('lodash')
const { test, afterAll } = require('@jest/globals')
const { Tool, cleanupAllTools } = require('./Tool.js')

/**
 *
 * @typedef {object} TestOptions
 * @property {string[]} [failures]
 * @property {import('./ProxyServer.js').ProxyConfigItem[]} [proxy]
 */

/**
 *
 * @param {string} content
 * @returns {string}
 */
function htmlTemplate(content) {
  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>template</title>
    <link href="./index.css" rel="stylesheet">
    <script type="module" src="./index.js"></script>
  </head>
  <body>${content}</body>
</html>
  `
}

/**
 * @param {import('./Tool.js').IntegrationTestedTool} toolName
 * @param {TestOptions} param1
 **/
function buildTest(toolName, { failures = [], proxy = null } = {}) {
  return test(toolName, async () => {
    const tool = new Tool(toolName, {
      failures,
      proxy,

      config: {
        mode: 'jit',
        purge: ['./src/index.html', './extra/file.html'],
        darkMode: false,
        theme: {},
        variants: {},
        plugins: [],
      },

      files: [
        { path: './src/index.html', contents: htmlTemplate(`ml-4`) },
        { path: './src/index.css', contents: `@tailwind utilities;` },
        { path: './src/index.js', contents: `import './index.css'` },
      ],
    })

    await tool.start()

    // 1. -- One-shot build --
    await tool.cleanSlate()
    await tool.build()
    await tool.expectCss('build:one-shot', [
      {
        path: './dist/index.css',
        expected: `
          .ml-4 { margin-left: 1rem; }
        `,
      },
    ])

    // 2. -- Watching --
    // 2.1. Intial Build
    await tool.cleanSlate()
    const { stop } = await tool.watch()

    if (tool.name === 'laravel-mix-v6') {
      await tool.delay(2500)
    }

    await tool.expectCss('watch:initial-build', [
      {
        path: './dist/index.css',
        expected: `
          .ml-4 { margin-left: 1rem; }
        `,
      },
    ])

    // 2.2. Adding utilities to the html file should add to the generated CSS
    await tool.writeFiles([{ path: './src/index.html', contents: htmlTemplate(`ml-2 ml-4`) }])

    await tool.expectCss('watch:add-utilities', [
      {
        path: './dist/index.css',

        // These are out of order because utilities are generated on demand
        expected: `
          .ml-4 { margin-left: 1rem; }
          .ml-2 { margin-left: 0.5rem; }
        `,
      },
    ])

    // 2.3. Adding @apply utils
    await tool.writeFiles([
      { path: './src/index.css', contents: `@tailwind utilities; .foobar { @apply mt-4; }` },
      { path: './src/index.html', contents: htmlTemplate(`ml-2 ml-4 foobar`) },
    ])

    await tool.expectCss('watch:add-at-apply', [
      {
        path: './dist/index.css',
        expected: `
          .ml-2 { margin-left: 0.5rem; }
          .ml-4 { margin-left: 1rem; }
          .foobar { margin-top: 1rem; }
        `,
      },
    ])

    // 2.4. Updating @apply utils
    await tool.writeFiles([
      { path: './src/index.css', contents: `@tailwind utilities; .foobar { @apply ml-4; }` },
    ])

    await tool.expectCss('watch:update-at-apply', [
      {
        path: './dist/index.css',
        expected: `
          .ml-2 { margin-left: 0.5rem; }
          .ml-4 { margin-left: 1rem; }
          .foobar { margin-left: 1rem; }
        `,
      },
    ])

    // 2.5. Updating the config should update the css
    await tool.updateConfig((config) => {
      set(config, 'theme.extend.spacing', { 4: '1.5rem' })
    })

    await tool.expectCss('watch:update-config', [
      {
        path: './dist/index.css',
        expected: `
          .ml-2 { margin-left: 0.5rem; }
          .ml-4 { margin-left: 1.5rem; }
          .foobar { margin-left: 1.5rem; }
        `,
      },
    ])

    // 2.6. Purged files are considered when looking for utilities
    await tool.writeFiles([{ path: './extra/file.html', contents: `mt-4` }])

    // And make sure it updates
    await tool.expectCss('watch:extra-file', [
      {
        path: './dist/index.css',
        expected: `
          .ml-2 { margin-left: 0.5rem; }
          .ml-4 { margin-left: 1.5rem; }
          .mt-4 { margin-top: 1.5rem; }
          .foobar { margin-left: 1.5rem; }
        `,
      },
    ])

    // 2.7. Re-saving files without changes doesn't break things
    await tool.writeFiles([{ path: './extra/file.html', contents: `mt-4` }])
    await tool.writeFiles([{ path: './extra/file.html', contents: `mt-5` }])

    // And make sure it updates
    await tool.expectCss('watch:extra-file-after-no-change', [
      {
        path: './dist/index.css',
        expected: `
          .ml-2 { margin-left: 0.5rem; }
          .ml-4 { margin-left: 1.5rem; }
          .mt-4 { margin-top: 1.5rem; }
          .mt-5 { margin-top: 1.25rem; }
          .foobar { margin-left: 1.5rem; }
        `,
      },
    ])

    await stop()
  })
}

buildTest('laravel-mix-v6')

buildTest('parcel-v2', {
  failures: [
    'watch:add-utilities',
    'watch:extra-file',
    'watch:extra-file-after-no-change'
  ],
})

buildTest('postcss-cli-v8')

buildTest('vite-v2', {
  proxy: [
    { path: '/src', target: `./src` },
    { path: '/dist', target: new URL('http://localhost:1337') },
  ]
})

buildTest('webpack-v5')

afterAll(cleanupAllTools)
