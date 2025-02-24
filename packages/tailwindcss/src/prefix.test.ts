import { expect, test } from 'vitest'
import { compile } from '.'
import plugin from './plugin'

const css = String.raw

test('utilities must be prefixed', async () => {
  let input = css`
    @theme reference prefix(tw);
    @tailwind utilities;

    @utility custom {
      color: red;
    }
  `

  let compiler = await compile(input)

  // Prefixed utilities are generated
  expect(
    compiler.build([
      'tw:underline',
      'tw:hover:line-through',
      'tw:custom',
      'tw:group-hover:flex',
      'tw:peer-hover:flex',
    ]),
  ).toMatchInlineSnapshot(`
    ".tw\\:custom {
      color: red;
    }
    .tw\\:underline {
      text-decoration-line: underline;
    }
    .tw\\:group-hover\\:flex {
      &:is(:where(.tw\\:group):hover *) {
        @media (hover: hover) {
          display: flex;
        }
      }
    }
    .tw\\:peer-hover\\:flex {
      &:is(:where(.tw\\:peer):hover ~ *) {
        @media (hover: hover) {
          display: flex;
        }
      }
    }
    .tw\\:hover\\:line-through {
      &:hover {
        @media (hover: hover) {
          text-decoration-line: line-through;
        }
      }
    }
    "
  `)

  // Non-prefixed utilities are ignored
  compiler = await compile(input)

  expect(compiler.build(['underline', 'hover:line-through', 'custom'])).toEqual('')
})

test('utilities used in @apply must be prefixed', async () => {
  let compiler = await compile(css`
    @theme reference prefix(tw);

    .my-underline {
      @apply tw:underline;
    }
  `)

  // Prefixed utilities are generated
  expect(compiler.build([])).toMatchInlineSnapshot(`
    ".my-underline {
      text-decoration-line: underline;
    }
    "
  `)

  // Non-prefixed utilities cause an error
  expect(() =>
    compile(css`
      @theme reference prefix(tw);

      .my-underline {
        @apply underline;
      }
    `),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: Cannot apply unknown utility class: underline]`,
  )
})

test('CSS variables output by the theme are prefixed', async () => {
  let compiler = await compile(css`
    @theme prefix(tw) {
      --color-red: #f00;
      --color-green: #0f0;
      --breakpoint-sm: 640px;
    }

    @tailwind utilities;
  `)

  // Prefixed utilities are generated
  expect(compiler.build(['tw:text-red'])).toMatchInlineSnapshot(`
    ":root, :host {
      --tw-color-red: #f00;
    }
    .tw\\:text-red {
      color: var(--tw-color-red);
    }
    "
  `)
})

test('CSS theme functions do not use the prefix', async () => {
  let compiler = await compile(css`
    @theme prefix(tw) {
      --color-red: #f00;
      --color-green: #0f0;
      --breakpoint-sm: 640px;
    }

    @tailwind utilities;
  `)

  expect(compiler.build(['tw:[color:theme(--color-red)]', 'tw:text-[theme(--color-red)]']))
    .toMatchInlineSnapshot(`
      ".tw\\:\\[color\\:theme\\(--color-red\\)\\] {
        color: #f00;
      }
      .tw\\:text-\\[theme\\(--color-red\\)\\] {
        color: #f00;
      }
      "
    `)

  compiler = await compile(css`
    @theme reference prefix(tw) {
      --color-red: #f00;
      --color-green: #0f0;
      --breakpoint-sm: 640px;
    }

    @tailwind utilities;
  `)

  expect(
    compiler.build(['tw:[color:theme(--tw-color-red)]', 'tw:text-[theme(--tw-color-red)]']),
  ).toEqual('')
})

test('JS theme functions do not use the prefix', async () => {
  let compiler = await compile(
    css`
      @theme prefix(tw) {
        --color-red: #f00;
        --color-green: #0f0;
        --breakpoint-sm: 640px;
      }

      @plugin "./plugin.js";

      @tailwind utilities;
    `,
    {
      async loadModule(id, base) {
        return {
          base,
          module: plugin(({ addUtilities, theme }) => {
            addUtilities({
              '.my-custom': {
                color: theme('--color-red'),
              },
            })

            // The theme function does not use the prefix
            expect(theme('--tw-color-red')).toEqual(undefined)
          }),
        }
      },
    },
  )

  expect(compiler.build(['tw:my-custom'])).toMatchInlineSnapshot(`
    ".tw\\:my-custom {
      color: #f00;
    }
    "
  `)
})

test('a prefix can be configured via @import theme(…)', async () => {
  let input = css`
    @import 'tailwindcss/theme' theme(reference prefix(tw));
    @tailwind utilities;

    @utility custom {
      color: red;
    }
  `

  let compiler = await compile(input, {
    async loadStylesheet(id, base) {
      return {
        base,
        content: css`
          @theme {
            --color-potato: #7a4724;
          }
        `,
      }
    },
  })

  // Prefixed utilities are generated
  expect(
    compiler.build([
      'tw:underline',
      'tw:bg-potato',
      'tw:hover:line-through',
      'tw:custom',
      'flex',
      'text-potato',
    ]),
  ).toMatchInlineSnapshot(`
    ".tw\\:bg-potato {
      background-color: var(--tw-color-potato, #7a4724);
    }
    .tw\\:custom {
      color: red;
    }
    .tw\\:underline {
      text-decoration-line: underline;
    }
    .tw\\:hover\\:line-through {
      &:hover {
        @media (hover: hover) {
          text-decoration-line: line-through;
        }
      }
    }
    "
  `)

  // Non-prefixed utilities are ignored
  compiler = await compile(input, {
    async loadStylesheet(id, base) {
      return {
        base,
        content: css`
          @theme {
            --color-potato: #7a4724;
          }
        `,
      }
    },
  })

  expect(compiler.build(['underline', 'hover:line-through', 'custom'])).toMatchInlineSnapshot(`""`)
})

test('a prefix can be configured via @import prefix(…)', async () => {
  let input = css`
    @import 'tailwindcss' prefix(tw);

    @utility custom {
      color: red;
    }
  `

  let compiler = await compile(input, {
    async loadStylesheet(id, base) {
      return {
        base,
        content: css`
          @theme {
            --color-potato: #7a4724;
          }
          @tailwind utilities;
        `,
      }
    },
  })

  expect(compiler.build(['tw:underline', 'tw:bg-potato', 'tw:hover:line-through', 'tw:custom']))
    .toMatchInlineSnapshot(`
      ":root, :host {
        --tw-color-potato: #7a4724;
      }
      .tw\\:bg-potato {
        background-color: var(--tw-color-potato);
      }
      .tw\\:custom {
        color: red;
      }
      .tw\\:underline {
        text-decoration-line: underline;
      }
      .tw\\:hover\\:line-through {
        &:hover {
          @media (hover: hover) {
            text-decoration-line: line-through;
          }
        }
      }
      "
    `)

  // Non-prefixed utilities are ignored
  compiler = await compile(input, {
    async loadStylesheet(id, base) {
      return {
        base,
        content: css`
          @theme {
            --color-potato: #7a4724;
          }
          @tailwind utilities;
        `,
      }
    },
  })

  expect(compiler.build(['underline', 'hover:line-through', 'custom'])).toMatchInlineSnapshot(`""`)
})

test('a prefix must be letters only', async () => {
  let input = css`
    @theme reference prefix(__);
  `

  await expect(() => compile(input)).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: The prefix "__" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.]`,
  )
})

test('a candidate matching the prefix does not crash', async () => {
  let input = css`
    @theme reference prefix(tomato);
    @tailwind utilities;
  `

  let compiler = await compile(input)

  expect(compiler.build(['tomato', 'tomato:flex'])).toMatchInlineSnapshot(`
    ".tomato\\:flex {
      display: flex;
    }
    "
  `)
})
