const postcss = require('postcss')
const tailwind = require('../index.js')
const fs = require('fs')
const path = require('path')

function run(input, config = {}) {
  return postcss(tailwind(config)).process(input, { from: path.resolve(__filename) })
}

test('custom separator', () => {
  let config = {
    darkMode: 'class',
    purge: [path.resolve(__dirname, './custom-separator.test.html')],
    separator: '_',
    corePlugins: {},
    theme: {},
    plugins: [],
  }

  let css = `@tailwind utilities`

  return run(css, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './custom-separator.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
