import { expect, test } from 'vitest'
import { compile } from '.'
import plugin from './plugin'
import { compileCss, run } from './test-utils/run'

const css = String.raw

test('utilities must be prefixed', async () => {
  let input = css`
    @theme reference prefix(tw);
    @tailwind utilities;

    @utility custom {
      color: red;
    }
  `

  // Prefixed utilities are generated
  expect(
    await run(
      [
        'tw:underline',
        'tw:hover:line-through',
        'tw:custom',
        'tw:group-hover:flex',
        'tw:peer-hover:flex',
      ],
      input,
    ),
  ).toMatchInlineSnapshot(`
    "
    .tw\\:custom {
      color: red;
    }

    .tw\\:underline {
      text-decoration-line: underline;
    }

    @media (hover: hover) {
      .tw\\:group-hover\\:flex:is(:where(.tw\\:group):hover *), .tw\\:peer-hover\\:flex:is(:where(.tw\\:peer):hover ~ *) {
        display: flex;
      }

      .tw\\:hover\\:line-through:hover {
        text-decoration-line: line-through;
      }
    }
    "
  `)

  // Non-prefixed utilities are ignored
  expect(await run(['underline', 'hover:line-through', 'custom'], input)).toEqual('')
})

test('utilities used in @apply must be prefixed', async () => {
  // Prefixed utilities are generated
  expect(
    await compileCss(css`
      @theme reference prefix(tw);

      .my-underline {
        @apply tw:underline;
      }
    `),
  ).toMatchInlineSnapshot(`
    "
    .my-underline {
      text-decoration-line: underline;
    }
    "
  `)

  // Non-prefixed utilities cause an error
  await expect(
    compile(css`
      @theme reference prefix(tw);

      .my-underline {
        @apply underline;
      }
    `),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: Cannot apply unprefixed utility class \`underline\`. Did you mean \`tw:underline\`?]`,
  )
})

test('CSS variables output by the theme are prefixed', async () => {
  // Prefixed utilities are generated
  expect(
    await run(
      ['tw:text-red'],
      css`
        @theme prefix(tw) {
          --color-red: #f00;
          --color-green: #0f0;
          --breakpoint-sm: 640px;
        }

        @tailwind utilities;
      `,
    ),
  ).toMatchInlineSnapshot(`
    "
    :root, :host {
      --tw-color-red: red;
    }

    .tw\\:text-red {
      color: var(--tw-color-red);
    }
    "
  `)
})

test('CSS theme functions do not use the prefix', async () => {
  expect(
    await run(
      ['tw:[color:theme(--color-red)]', 'tw:text-[theme(--color-red)]'],
      css`
        @theme prefix(tw) {
          --color-red: #f00;
          --color-green: #0f0;
          --breakpoint-sm: 640px;
        }

        @tailwind utilities;
      `,
    ),
  ).toMatchInlineSnapshot(`
    "
    .tw\\:\\[color\\:theme\\(--color-red\\)\\], .tw\\:text-\\[theme\\(--color-red\\)\\] {
      color: red;
    }
    "
  `)

  expect(
    await run(
      ['tw:[color:theme(--tw-color-red)]', 'tw:text-[theme(--tw-color-red)]'],
      css`
        @theme reference prefix(tw) {
          --color-red: #f00;
          --color-green: #0f0;
          --breakpoint-sm: 640px;
        }

        @tailwind utilities;
      `,
    ),
  ).toEqual('')
})

test('JS theme functions do not use the prefix', async () => {
  expect(
    await run(
      ['tw:my-custom'],
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
        async loadModule(_id, base) {
          return {
            path: '',
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
    ),
  ).toMatchInlineSnapshot(`
    "
    .tw\\:my-custom {
      color: red;
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

  let options: Partial<Parameters<typeof compile>[1]> = {
    async loadStylesheet(_id, base) {
      return {
        path: '',
        base,
        content: css`
          @theme {
            --color-potato: #7a4724;
          }
        `,
      }
    },
  }

  // Prefixed utilities are generated
  expect(
    await run(
      ['tw:underline', 'tw:bg-potato', 'tw:hover:line-through', 'tw:custom', 'flex', 'text-potato'],
      input,
      options,
    ),
  ).toMatchInlineSnapshot(`
    "
    .tw\\:bg-potato {
      background-color: var(--tw-color-potato, #7a4724);
    }

    .tw\\:custom {
      color: red;
    }

    .tw\\:underline {
      text-decoration-line: underline;
    }

    @media (hover: hover) {
      .tw\\:hover\\:line-through:hover {
        text-decoration-line: line-through;
      }
    }
    "
  `)

  // Non-prefixed utilities are ignored
  expect(await run(['underline', 'hover:line-through', 'custom'], input, options)).toEqual('')
})

test('a prefix can be configured via @import prefix(…)', async () => {
  let input = css`
    @import 'tailwindcss' prefix(tw);

    @utility custom {
      color: red;
    }
  `

  let options: Partial<Parameters<typeof compile>[1]> = {
    async loadStylesheet(_id, base) {
      return {
        path: '',
        base,
        content: css`
          @theme {
            --color-potato: #7a4724;
          }
          @tailwind utilities;
        `,
      }
    },
  }

  expect(
    await run(
      ['tw:underline', 'tw:bg-potato', 'tw:hover:line-through', 'tw:custom'],
      input,
      options,
    ),
  ).toMatchInlineSnapshot(`
    "
    :root, :host {
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

    @media (hover: hover) {
      .tw\\:hover\\:line-through:hover {
        text-decoration-line: line-through;
      }
    }
    "
  `)

  // Non-prefixed utilities are ignored
  expect(await run(['underline', 'hover:line-through', 'custom'], input, options)).toEqual('')
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
  expect(
    await run(
      ['tomato', 'tomato:flex'],
      css`
        @theme reference prefix(tomato);
        @tailwind utilities;
      `,
    ),
  ).toMatchInlineSnapshot(`
    "
    .tomato\\:flex {
      display: flex;
    }
    "
  `)
})
