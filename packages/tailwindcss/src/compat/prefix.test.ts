import { expect, test } from 'vitest'
import { compile } from '..'

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
    compiler.build(['tw:underline', 'tw:hover:line-through', 'tw:custom']),
  ).toMatchInlineSnapshot(`
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
