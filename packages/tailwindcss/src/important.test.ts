import { expect, test } from 'vitest'
import { run } from './test-utils/run'

const css = String.raw

test('Utilities can be wrapped in a selector', async () => {
  // This is the v4 equivalent of `important: "#app"` from v3
  expect(
    await run(
      ['underline', 'hover:line-through'],
      css`
        #app {
          @tailwind utilities;
        }
      `,
    ),
  ).toMatchInlineSnapshot(`
    "
    #app .underline {
      text-decoration-line: underline;
    }

    @media (hover: hover) {
      #app .hover\\:line-through:hover {
        text-decoration-line: line-through;
      }
    }
    "
  `)
})

test('Utilities can be marked with important', async () => {
  // This is the v4 equivalent of `important: true` from v3
  expect(
    await run(
      ['underline', 'hover:line-through'],
      css`
        @import 'tailwindcss/utilities' important;
      `,
      {
        loadStylesheet: async (_id: string, base: string) => ({
          base,
          content: '@tailwind utilities;',
          path: '',
        }),
      },
    ),
  ).toMatchInlineSnapshot(`
    "
    .underline {
      text-decoration-line: underline !important;
    }

    @media (hover: hover) {
      .hover\\:line-through:hover {
        text-decoration-line: line-through !important;
      }
    }
    "
  `)
})

test('Utilities can be wrapped with a selector and marked as important', async () => {
  // This does not have a direct equivalent in v3 but works as a consequence of
  // the new APIs
  expect(
    await run(
      ['underline', 'hover:line-through'],
      css`
        @media important {
          #app {
            @tailwind utilities;
          }
        }
      `,
    ),
  ).toMatchInlineSnapshot(`
    "
    #app .underline {
      text-decoration-line: underline !important;
    }

    @media (hover: hover) {
      #app .hover\\:line-through:hover {
        text-decoration-line: line-through !important;
      }
    }
    "
  `)
})

test('variables in utilities should not be marked as important', async () => {
  expect(
    await run(
      ['ease-out!', 'z-10!'],
      css`
        @theme {
          --ease-out: cubic-bezier(0, 0, 0.2, 1);
        }
        @tailwind utilities;
      `,
    ),
  ).toMatchInlineSnapshot(`
    "
    @layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-ease: initial;
        }
      }
    }

    :root, :host {
      --ease-out: cubic-bezier(0, 0, .2, 1);
    }

    .z-10\\! {
      z-index: 10 !important;
    }

    .ease-out\\! {
      --tw-ease: var(--ease-out) !important;
      transition-timing-function: var(--ease-out) !important;
    }

    @property --tw-ease {
      syntax: "*";
      inherits: false
    }
    "
  `)
})
