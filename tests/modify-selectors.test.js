import fs from 'fs'
import path from 'path'
import selectorParser from 'postcss-selector-parser'

import { run, css } from './util/run'

test('modify selectors', () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './modify-selectors.test.html')],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [
      function ({ addVariant }) {
        addVariant('foo', ({ modifySelectors, separator }) => {
          modifySelectors(({ selector }) => {
            return selectorParser((selectors) => {
              selectors.walkClasses((classNode) => {
                classNode.value = `foo${separator}${classNode.value}`
                classNode.parent.insertBefore(classNode, selectorParser().astSync(`.foo `))
              })
            }).processSync(selector)
          })
        })
      },
    ],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .markdown > p {
        margin-top: 12px;
      }
    }
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './modify-selectors.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
