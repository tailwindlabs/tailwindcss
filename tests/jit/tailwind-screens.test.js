import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('class variants are inserted at `@tailwind variants`', async () => {
  let config = {
    purge: [
      {
        raw: `font-bold hover:font-bold md:font-bold`,
      },
    ],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind utilities;
    @tailwind variants;
    .foo {
      color: black;
    }
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .font-bold {
        font-weight: 700;
      }
      .hover\\:font-bold:hover {
        font-weight: 700;
      }
      @media (min-width: 768px) {
        .md\\:font-bold {
          font-weight: 700;
        }
      }
      .foo {
        color: black;
      }
    `)
  })
})

test('`@tailwind screens` works as an alias for `@tailwind variants`', async () => {
  let config = {
    purge: [
      {
        raw: `font-bold hover:font-bold md:font-bold`,
      },
    ],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind utilities;
    @tailwind screens;
    .foo {
      color: black;
    }
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .font-bold {
        font-weight: 700;
      }
      .hover\\:font-bold:hover {
        font-weight: 700;
      }
      @media (min-width: 768px) {
        .md\\:font-bold {
          font-weight: 700;
        }
      }
      .foo {
        color: black;
      }
    `)
  })
})
