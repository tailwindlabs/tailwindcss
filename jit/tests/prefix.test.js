const postcss = require('postcss')
const tailwind = require('../index.js')
const fs = require('fs')
const path = require('path')

function run(input, config = {}) {
  return postcss(tailwind(config)).process(input, { from: path.resolve(__filename) })
}

test('prefix', () => {
  let config = {
    prefix: 'tw-',
    darkMode: 'class',
    purge: [path.resolve(__dirname, './prefix.test.html')],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [
      function ({ addComponents, addUtilities }) {
        addComponents({
          '.btn-prefix': {
            button: 'yes',
          },
        })
        addComponents(
          {
            '.btn-no-prefix': {
              button: 'yes',
            },
          },
          { respectPrefix: false }
        )
        addUtilities({
          '.custom-util-prefix': {
            button: 'no',
          },
        })
        addUtilities(
          {
            '.custom-util-no-prefix': {
              button: 'no',
            },
          },
          { respectPrefix: false }
        )
      },
    ],
  }

  let css = `
    @tailwind base;
    @tailwind components;
    @layer components {
      .custom-component {
        @apply tw-font-bold dark:group-hover:tw-font-normal;
      }
    }
    @tailwind utilities;
    @layer utilites {
      .custom-utility {
        foo: bar;
      }
    }
  `

  return run(css, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './prefix.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
