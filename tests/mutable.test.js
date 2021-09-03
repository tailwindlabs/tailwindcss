import postcss from 'postcss'
import fs from 'fs'
import path from 'path'

import { run } from './util/run'

function pluginThatMutatesRules() {
  return (root) => {
    root.walkRules((rule) => {
      rule.nodes
        .filter((node) => node.prop === 'background-image')
        .forEach((node) => {
          node.value = 'url("./bar.png")'
        })

      return rule
    })
  }
}

test.only('plugins mutating rules after tailwind doesnt break it', async () => {
  let config = {
    content: [path.resolve(__dirname, './mutable.test.html')],
    theme: {
      backgroundImage: {
        foo: 'url("./foo.png")',
      },
    },
    plugins: [],
  }

  function checkResult(result) {
    let expectedPath = path.resolve(__dirname, './mutable.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  }

  // Verify the first run produces the expected result
  let firstRun = await run('@tailwind utilities', config)
  checkResult(firstRun)

  // Outside of the context of tailwind jit more postcss plugins may operate on the AST:
  // In this case we have a plugin that mutates rules directly
  await postcss([pluginThatMutatesRules()]).process(firstRun, {
    from: path.resolve(__filename),
  })

  // Verify subsequent runs don't produce mutated rules
  let secondRun = await run('@tailwind utilities', config)
  checkResult(secondRun)
})
