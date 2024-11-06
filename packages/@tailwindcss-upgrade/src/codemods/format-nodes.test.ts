import postcss, { type Plugin } from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'
import { sortBuckets } from './sort-buckets'

function markPretty(): Plugin {
  return {
    postcssPlugin: '@tailwindcss/upgrade/mark-pretty',
    OnceExit(root) {
      root.walkAtRules('tw-format', (atRule) => {
        atRule.raws.tailwind_pretty = true
      })
    },
  }
}

function migrate(input: string) {
  return postcss()
    .use(markPretty())
    .use(sortBuckets())
    .use(formatNodes())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('should format PostCSS nodes', async () => {
  expect(await migrate(`@utility .foo { .foo { color: red; } }`)).toMatchInlineSnapshot(`
    "@utility .foo {
      .foo {
        color: red;
      }
    }"
  `)
})

it('should format PostCSS nodes in the `user` bucket', async () => {
  expect(await migrate(`@tw-bucket user { @tw-format .bar { .foo { color: red; } } }`))
    .toMatchInlineSnapshot(`
      "@tw-format .bar {
        .foo {
          color: red;
        }
      }"
    `)
})
