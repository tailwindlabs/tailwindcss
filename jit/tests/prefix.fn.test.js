const postcss = require('postcss')
const tailwind = require('../index.js')
const fs = require('fs')
const path = require('path')

function run(input, config = {}) {
  return postcss(tailwind(config)).process(input, { from: path.resolve(__filename) })
}

test('prefix fn', () => {
  let config = {
    prefix(selector) {
      if (['.align-bottom', '.ml'].some((prefix) => selector.startsWith(prefix))) {
        return 'tw-'
      }

      return ''
    },
    purge: [path.resolve(__dirname, './prefix.fn.test.html')],
    corePlugins: { preflight: false },
    theme: {},
  }

  let css = `
    @tailwind utilities;
  `

  return run(css, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './prefix.fn.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
