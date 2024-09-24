import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'
import { migrateMissingLayers } from './migrate-missing-layers'

const css = dedent

function migrate(input: string) {
  return postcss()
    .use(migrateMissingLayers())
    .use(formatNodes())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('should migrate rules between tailwind directives', async () => {
  expect(
    await migrate(css`
      @tailwind base;

      .base {
      }

      @tailwind components;

      .component-a {
      }
      .component-b {
      }

      @tailwind utilities;

      .utility-a {
      }
      .utility-b {
      }
    `),
  ).toMatchInlineSnapshot(`
    "@tailwind base;

    @layer base {
      .base {
      }
    }

    @tailwind components;

    @layer components {
      .component-a {
      }
      .component-b {
      }
    }

    @tailwind utilities;

    @layer utilities {
      .utility-a {
      }
      .utility-b {
      }
    }"
  `)
})
