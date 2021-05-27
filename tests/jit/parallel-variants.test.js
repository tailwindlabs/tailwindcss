import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'
import { transformAllSelectors, updateAllClasses } from '../../src/util/pluginUtils.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('basic parallel variants', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="font-normal hover:test:font-black test:font-bold test:font-medium"></div>',
      },
    ],
    theme: {},
    plugins: [
      function test({ addVariant, config }) {
        addVariant('test', [
          transformAllSelectors((selector) => {
            let variantSelector = updateAllClasses(selector, (className) => {
              return `test${config('separator')}${className}`
            })

            return `${variantSelector} *::test`
          }),
          transformAllSelectors((selector) => {
            return updateAllClasses(selector, (className, { withPseudo }) => {
              return withPseudo(`test${config('separator')}${className}`, '::test')
            })
          }),
        ])
      },
    ],
  }

  let css = `@tailwind utilities`

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .font-normal {
        font-weight: 400;
      }
      .test\\:font-bold *::test {
        font-weight: 700;
      }
      .test\\:font-medium *::test {
        font-weight: 500;
      }
      .hover\\:test\\:font-black:hover *::test {
        font-weight: 900;
      }
      .test\\:font-bold::test {
        font-weight: 700;
      }
      .test\\:font-medium::test {
        font-weight: 500;
      }
      .hover\\:test\\:font-black:hover::test {
        font-weight: 900;
      }
    `)
  })
})
