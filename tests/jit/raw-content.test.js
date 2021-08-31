import postcss from 'postcss'
import fs from 'fs'
import path from 'path'

beforeEach(() => {
  jest.resetModules()
})

function run(tailwind, input, config = {}) {
  return postcss(tailwind(config)).process(input, {
    from: path.resolve(__filename),
  })
}

test('raw content', () => {
  let tailwind = require('../../src/jit/index.js').default

  let config = {
    purge: [{ raw: fs.readFileSync(path.resolve(__dirname, './raw-content.test.html'), 'utf8') }],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind components;
    @tailwind utilities;
  `

  return run(tailwind, css, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './raw-content.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('raw content with extension', () => {
  let tailwind = require('../../src/jit/index.js').default

  let config = {
    purge: {
      content: [
        {
          raw: fs.readFileSync(path.resolve(__dirname, './raw-content.test.html'), 'utf8'),
          extension: 'html',
        },
      ],
      options: {
        extractors: [
          {
            extractor: () => ['invisible'],
            extensions: ['html'],
          },
        ],
      },
    },
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let css = `@tailwind utilities;`

  return run(tailwind, css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .invisible {
        visibility: hidden;
      }
    `)
  })
})
