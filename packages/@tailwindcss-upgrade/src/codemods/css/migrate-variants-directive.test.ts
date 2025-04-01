import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'
import { migrateVariantsDirective } from './migrate-variants-directive'
import { sortBuckets } from './sort-buckets'

const css = dedent

function migrate(input: string) {
  return postcss()
    .use(migrateVariantsDirective())
    .use(sortBuckets())
    .use(formatNodes())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('should replace `@variants` with `@layer utilities`', async () => {
  expect(
    await migrate(css`
      @variants hover, focus {
        .foo {
          color: red;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@layer utilities {
      .foo {
        color: red;
      }
    }"
  `)
})
