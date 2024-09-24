import { expect, test } from 'vitest'
import { compile } from '.'

const css = String.raw

test('Utilities can be wrapped in a selector', async () => {
  // This is the v4 equivalent of `important: "#app"` from v3
  let input = css`
    @import 'tailwindcss/utilities' selector(#app);
  `

  let compiler = await compile(input, {
    loadStylesheet: async (id: string, base: string) => ({
      base,
      content: '@tailwind utilities;',
    }),
  })

  expect(compiler.build(['underline', 'hover:line-through'])).toMatchInlineSnapshot(`
    ".underline {
      #app & {
        text-decoration-line: underline;
      }
    }
    .hover\\:line-through {
      #app & {
        &:hover {
          @media (hover: hover) {
            text-decoration-line: line-through;
          }
        }
      }
    }
    "
  `)
})

test('Utilities can be marked with important', async () => {
  // This is the v4 equivalent of `important: true` from v3
  let input = css`
    @import 'tailwindcss/utilities' important;
  `

  let compiler = await compile(input, {
    loadStylesheet: async (id: string, base: string) => ({
      base,
      content: '@tailwind utilities;',
    }),
  })

  expect(compiler.build(['underline', 'hover:line-through'])).toMatchInlineSnapshot(`
    ".underline {
      text-decoration-line: underline!important;
    }
    .hover\\:line-through {
      &:hover {
        @media (hover: hover) {
          text-decoration-line: line-through!important;
        }
      }
    }
    "
  `)
})
