const postcss = require('postcss')
const fs = require('fs')
const path = require('path')

function run(input, config = {}) {
  jest.resetModules()
  const tailwind = require('../index.js')
  return postcss(tailwind(config)).process(input, { from: path.resolve(__filename) })
}

function customExtractor(content) {
  const matches = content.match(/class="([^"]+)"/)
  return matches ? matches[1].split(/\s+/) : []
}

const css = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
`
const expectedPath = path.resolve(__dirname, './custom-extractors.test.css')
const expected = fs.readFileSync(expectedPath, 'utf8')

test('defaultExtractor', () => {
  let config = {
    purge: {
      content: [path.resolve(__dirname, './custom-extractors.test.html')],
      options: {
        defaultExtractor: customExtractor,
      },
    },
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('extractors array', () => {
  let config = {
    purge: {
      content: [path.resolve(__dirname, './custom-extractors.test.html')],
      options: {
        extractors: [
          {
            extractor: customExtractor,
            extensions: ['html'],
          },
        ],
      },
    },
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(expected)
  })
})
