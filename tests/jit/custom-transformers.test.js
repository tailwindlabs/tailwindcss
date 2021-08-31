import postcss from 'postcss'
import path from 'path'

function run(input, config = {}) {
  jest.resetModules()
  const tailwind = require('../../src/jit/index.js').default
  return postcss(tailwind(config)).process(input, {
    from: path.resolve(__filename),
  })
}

function customTransformer(content) {
  return content.replace(/uppercase/g, 'lowercase')
}

const css = `
  @tailwind utilities;
`

test('transform function', () => {
  let config = {
    purge: {
      content: [{ raw: '<div class="uppercase"></div>' }],
      transform: customTransformer,
    },
    theme: {},
    plugins: [],
  }

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .lowercase {
        text-transform: lowercase;
      }
    `)
  })
})

test('transform.DEFAULT', () => {
  let config = {
    purge: {
      content: [{ raw: '<div class="uppercase"></div>' }],
      transform: {
        DEFAULT: customTransformer,
      },
    },
    theme: {},
    plugins: [],
  }

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .lowercase {
        text-transform: lowercase;
      }
    `)
  })
})

test('transform.{extension}', () => {
  let config = {
    purge: {
      content: [
        { raw: '<div class="uppercase"></div>', extension: 'html' },
        { raw: '<div class="uppercase"></div>', extension: 'php' },
      ],
      transform: {
        html: customTransformer,
      },
    },
    theme: {},
    plugins: [],
  }

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .uppercase {
        text-transform: uppercase;
      }
      .lowercase {
        text-transform: lowercase;
      }
    `)
  })
})
