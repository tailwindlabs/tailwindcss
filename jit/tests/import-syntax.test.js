const postcss = require('postcss')
const tailwind = require('../index.js')
const fs = require('fs')
const path = require('path')

function run(input, config = {}) {
  return postcss(tailwind(config)).process(input, { from: path.resolve(__filename) })
}

test('using @import instead of @tailwind', () => {
  let config = {
    purge: [path.resolve(__dirname, './import-syntax.test.html')],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [
      function ({ addBase }) {
        addBase({
          h1: {
            fontSize: '32px',
          },
        })
      },
    ],
  }

  let css = `
    @import "tailwindcss/base";
    @import "tailwindcss/components";
    @import "tailwindcss/utilities";
  `

  return run(css, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './import-syntax.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
