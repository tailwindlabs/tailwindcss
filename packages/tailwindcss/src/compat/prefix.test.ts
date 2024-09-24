import { expect, test } from 'vitest'
import { compile } from '..'
import plugin from '../plugin'

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
  expect(compiler.build(['tw:underline', 'tw:hover:line-through', 'tw:custom']))
    .toMatchInlineSnapshot(`
    ".tw\\:custom {
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
    ":root {
      --tw-color-red: #f00;
      --tw-color-green: #0f0;
      --tw-breakpoint-sm: 640px;
    }
    .tw\\:text-red {
      color: var(--tw-color-red, #f00);
    }
    "
  `)
})

test('CSS theme functions do not need to use the prefix', async () => {
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
    ":root {
      --tw-color-red: #f00;
      --tw-color-green: #0f0;
      --tw-breakpoint-sm: 640px;
    }
    .tw\\:\\[color\\:theme\\(--color-red\\)\\] {
      color: #f00;
    }
    .tw\\:text-\\[theme\\(--color-red\\)\\] {
      color: #f00;
    }
    "
  `)
})

test('JS theme functions do not need to use the prefix', async () => {
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
          }),
        }
      },
    },
  )

  expect(compiler.build(['tw:my-custom'])).toMatchInlineSnapshot(`
    ":root {
      --tw-color-red: #f00;
      --tw-color-green: #0f0;
      --tw-breakpoint-sm: 640px;
    }
    .tw\\:my-custom {
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
        content: '@theme {}',
      }
    },
  })

  // Prefixed utilities are generated
  expect(compiler.build(['tw:underline', 'tw:hover:line-through', 'tw:custom']))
    .toMatchInlineSnapshot(`
    ".tw\\:custom {
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
        content: '@theme {}',
      }
    },
  })

  expect(compiler.build(['underline', 'hover:line-through', 'custom'])).toEqual('')
})

test('a prefix can be configured via @import prefix(…)', async () => {
  let input = css`
    @import 'tailwindcss/theme' prefix(tw);
    @tailwind utilities;

    @utility custom {
      color: red;
    }
  `

  let compiler = await compile(input, {
    async loadStylesheet(id, base) {
      return {
        base,
        content: '@theme reference {}',
      }
    },
  })

  // Prefixed utilities are generated
  expect(compiler.build(['tw:underline', 'tw:hover:line-through', 'tw:custom']))
    .toMatchInlineSnapshot(`
    ".tw\\:custom {
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
        content: '@theme reference {}',
      }
    },
  })

  expect(compiler.build(['underline', 'hover:line-through', 'custom'])).toEqual('')
})

test('a prefix must be letters only', async () => {
  let input = css`
    @theme reference prefix(__);
  `

  await expect(() => compile(input)).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: The prefix "__" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.]`,
  )
})
