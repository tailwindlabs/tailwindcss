import postcss, { type Plugin } from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'

function markPretty(): Plugin {
  return {
    postcssPlugin: '@tailwindcss/upgrade/mark-pretty',
    OnceExit(root) {
      root.walkAtRules('utility', (atRule) => {
        atRule.raws.tailwind_pretty = true
      })
    },
  }
}

function migrate(input: string) {
  return postcss()
    .use(markPretty())
    .use(formatNodes())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('should format PostCSS nodes that are marked with tailwind_pretty', async () => {
  expect(
    await migrate(`
      @utility .foo { .foo { color: red; } }`),
  ).toMatchInlineSnapshot(`
    "@utility .foo {
      .foo {
        color: red;
      }
    }"
  `)
})
