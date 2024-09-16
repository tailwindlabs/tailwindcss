import dedent from 'dedent'
import { expect, it } from 'vitest'
import { migrateContents } from './migrate'

const css = dedent

it('should print the input as-is', async () => {
  expect(
    await migrateContents(
      css`
        /* above */
        .foo/* after */ {
          /* above */
          color:  /* before */ red /* after */;
          /* below */
        }
      `,
      expect.getState().testPath,
    ),
  ).toMatchInlineSnapshot(`
    "/* above */
    .foo/* after */ {
      /* above */
      color:  /* before */ red /* after */;
      /* below */
    }"
  `)
})
