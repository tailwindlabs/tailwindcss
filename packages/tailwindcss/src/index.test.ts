import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it, test } from 'vitest'
import { compile } from '.'
import plugin from './plugin'
import type { PluginAPI } from './plugin-api'
import { compileCss, optimizeCss, run } from './test-utils/run'

const css = String.raw

describe('compiling CSS', () => {
  test('`@tailwind utilities` is replaced with the generated utility classes', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --color-black: #000;
            --breakpoint-md: 768px;
          }

          @layer utilities {
            @tailwind utilities;
          }
        `,
        ['flex', 'md:grid', 'hover:underline', 'dark:bg-black'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-black: #000;
        --breakpoint-md: 768px;
      }

      @layer utilities {
        .flex {
          display: flex;
        }

        .hover\\:underline:hover {
          text-decoration-line: underline;
        }

        @media (width >= 768px) {
          .md\\:grid {
            display: grid;
          }
        }

        @media (prefers-color-scheme: dark) {
          .dark\\:bg-black {
            background-color: var(--color-black, #000);
          }
        }
      }"
    `)
  })

  test('that only CSS variables are allowed', () =>
    expect(
      compileCss(
        css`
          @theme {
            --color-primary: red;
            .foo {
              --color-primary: blue;
            }
          }
          @tailwind utilities;
        `,
        ['bg-primary'],
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: \`@theme\` blocks must only contain custom properties or \`@keyframes\`.

        @theme {
      >   .foo {
      >     --color-primary: blue;
      >   }
        }
        ]
    `))

  test('`@tailwind utilities` is only processed once', async () => {
    expect(
      await compileCss(
        css`
          @tailwind utilities;
          @tailwind utilities;
        `,
        ['flex', 'grid'],
      ),
    ).toMatchInlineSnapshot(`
      ".flex {
        display: flex;
      }

      .grid {
        display: grid;
      }"
    `)
  })

  test('`@tailwind utilities` is replaced by utilities using the default theme', async () => {
    let defaultTheme = fs.readFileSync(path.resolve(__dirname, '..', 'theme.css'), 'utf-8')

    expect(
      await compileCss(
        css`
          ${defaultTheme}
          @tailwind utilities;
        `,
        ['bg-red-500', 'w-4', 'sm:flex', 'shadow'],
      ),
    ).toMatchSnapshot()
  })
})

describe('arbitrary properties', () => {
  it('should generate arbitrary properties', async () => {
    expect(await run(['[color:red]'])).toMatchInlineSnapshot(`
      ".\\[color\\:red\\] {
        color: red;
      }"
    `)
  })

  it('should generate arbitrary properties with modifiers', async () => {
    expect(await run(['[color:red]/50'])).toMatchInlineSnapshot(`
      ".\\[color\\:red\\]\\/50 {
        color: #ff000080;
      }"
    `)
  })

  it('should not generate arbitrary properties with invalid modifiers', async () => {
    expect(await run(['[color:red]/not-a-percentage'])).toMatchInlineSnapshot(`""`)
  })

  it('should generate arbitrary properties with variables and with modifiers', async () => {
    expect(await run(['[color:var(--my-color)]/50'])).toMatchInlineSnapshot(`
      ".\\[color\\:var\\(--my-color\\)\\]\\/50 {
        color: color-mix(in srgb, var(--my-color) 50%, transparent);
      }"
    `)
  })
})

describe('@apply', () => {
  it('should replace @apply with the correct result', async () => {
    expect(
      await compileCss(css`
        @theme {
          --color-red-200: #fecaca;
          --color-red-500: #ef4444;
          --color-blue-500: #3b82f6;
          --color-green-200: #bbf7d0;
          --color-green-500: #22c55e;
          --breakpoint-md: 768px;
          --animate-spin: spin 1s linear infinite;

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        }

        @tailwind utilities;

        .foo {
          @apply underline bg-red-500 hover:bg-blue-500 md:bg-green-500 animate-spin translate-x-full;

          &:hover:focus {
            @apply bg-red-200 md:bg-green-200;
          }
        }
      `),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-red-200: #fecaca;
        --color-red-500: #ef4444;
        --color-blue-500: #3b82f6;
        --color-green-200: #bbf7d0;
        --color-green-500: #22c55e;
        --breakpoint-md: 768px;
        --animate-spin: spin 1s linear infinite;
      }

      .foo {
        --tw-translate-x: 100%;
        translate: var(--tw-translate-x) var(--tw-translate-y);
        animation: var(--animate-spin, spin 1s linear infinite);
        background-color: var(--color-red-500, #ef4444);
        text-decoration-line: underline;
      }

      .foo:hover {
        background-color: var(--color-blue-500, #3b82f6);
      }

      @media (width >= 768px) {
        .foo {
          background-color: var(--color-green-500, #22c55e);
        }
      }

      .foo:hover:focus {
        background-color: var(--color-red-200, #fecaca);
      }

      @media (width >= 768px) {
        .foo:hover:focus {
          background-color: var(--color-green-200, #bbf7d0);
        }
      }

      @supports (-moz-orient: inline) {
        @layer base {
          *, :before, :after, ::backdrop {
            --tw-translate-x: 0;
            --tw-translate-y: 0;
            --tw-translate-z: 0;
          }
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @property --tw-translate-x {
        syntax: "<length> | <percentage>";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-translate-y {
        syntax: "<length> | <percentage>";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-translate-z {
        syntax: "<length>";
        inherits: false;
        initial-value: 0;
      }"
    `)
  })

  it('should @apply in order the utilities would be sorted in if they were used in HTML', async () => {
    expect(
      await compileCss(css`
        @tailwind utilities;

        .foo {
          @apply content-["a"] content-["b"];
        }

        .bar {
          @apply content-["b"] content-["a"];
        }
      `),
    ).toMatchInlineSnapshot(`
      ".foo, .bar {
        --tw-content: "b";
        content: var(--tw-content);
        content: var(--tw-content);
      }

      @supports (-moz-orient: inline) {
        @layer base {
          *, :before, :after, ::backdrop {
            --tw-content: "";
          }
        }
      }

      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }"
    `)
  })

  it('should error when using @apply with a utility that does not exist', () => {
    expect(
      compileCss(css`
        @tailwind utilities;

        .foo {
          @apply bg-not-found;
        }
      `),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Cannot apply unknown utility class: bg-not-found]`,
    )
  })

  it('should error when using @apply with a variant that does not exist', () => {
    expect(
      compileCss(css`
        @tailwind utilities;

        .foo {
          @apply hocus:bg-red-500;
        }
      `),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Cannot apply unknown utility class: hocus:bg-red-500]`,
    )
  })

  it('should not error with trailing whitespace', async () => {
    expect(
      await compileCss(`
        @tailwind utilities;

        .foo {
          @apply flex ;
        }
      `),
    ).toMatchInlineSnapshot(`
      ".foo {
        display: flex;
      }"
    `)
  })

  it('should be possible to apply a custom utility', async () => {
    expect(
      await compileCss(css`
        @utility bar {
          &:before {
            content: 'bar';
          }
        }

        .foo {
          /* Baz is defined after this rule, but should work */
          @apply bar baz;
        }

        @utility baz {
          &:after {
            content: 'baz';
          }
        }

        @tailwind utilities;
      `),
    ).toMatchInlineSnapshot(`
      ".foo:before {
        content: "bar";
      }

      .foo:after {
        content: "baz";
      }"
    `)
  })
})

describe('arbitrary variants', () => {
  it('should generate arbitrary variants', async () => {
    expect(await run(['[&_p]:flex'])).toMatchInlineSnapshot(`
      ".\\[\\&_p\\]\\:flex p {
        display: flex;
      }"
    `)
  })

  it('should generate arbitrary at-rule variants', async () => {
    expect(await run(['[@media(width>=123px)]:flex'])).toMatchInlineSnapshot(`
      "@media (width >= 123px) {
        .\\[\\@media\\(width\\>\\=123px\\)\\]\\:flex {
          display: flex;
        }
      }"
    `)
  })

  it('discards arbitrary variants using relative selectors', async () => {
    expect(await run(['[>img]:flex', '[+img]:flex', '[~img]:flex'])).toBe('')
  })
})

describe('variant stacking', () => {
  it('should stack simple variants', async () => {
    expect(await run(['focus:hover:flex'])).toMatchInlineSnapshot(`
      ".focus\\:hover\\:flex:focus:hover {
        display: flex;
      }"
    `)
  })

  it('should stack arbitrary variants and simple variants', async () => {
    expect(await run(['[&_p]:hover:flex'])).toMatchInlineSnapshot(`
      ".\\[\\&_p\\]\\:hover\\:flex p:hover {
        display: flex;
      }"
    `)
  })

  it('should stack multiple arbitrary variants', async () => {
    expect(await run(['[&_p]:[@media(width>=123px)]:flex'])).toMatchInlineSnapshot(`
      "@media (width >= 123px) {
        .\\[\\&_p\\]\\:\\[\\@media\\(width\\>\\=123px\\)\\]\\:flex p {
          display: flex;
        }
      }"
    `)
  })

  it('pseudo element variants are re-ordered', async () => {
    expect(await run(['before:hover:flex', 'hover:before:flex'])).toMatchInlineSnapshot(`
      ".before\\:hover\\:flex:before {
        content: var(--tw-content);
      }

      .before\\:hover\\:flex:before:hover {
        display: flex;
      }

      .hover\\:before\\:flex:hover:before {
        content: var(--tw-content);
        display: flex;
      }

      @supports (-moz-orient: inline) {
        @layer base {
          *, :before, :after, ::backdrop {
            --tw-content: "";
          }
        }
      }

      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }"
    `)
  })
})

describe('important', () => {
  it('should generate an important utility', async () => {
    expect(await run(['underline!'])).toMatchInlineSnapshot(`
      ".underline\\! {
        text-decoration-line: underline !important;
      }"
    `)
  })

  it('should generate an important utility with legacy syntax', async () => {
    expect(await run(['!underline'])).toMatchInlineSnapshot(`
      ".\\!underline {
        text-decoration-line: underline !important;
      }"
    `)
  })

  it('should not mark declarations inside of @keyframes as important', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --animate-spin: spin 1s linear infinite;

            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          }
          @tailwind utilities;
        `,
        ['animate-spin!'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --animate-spin: spin 1s linear infinite;
      }

      .animate-spin\\! {
        animation: var(--animate-spin, spin 1s linear infinite) !important;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }"
    `)
  })

  it('should generate an important arbitrary property utility', async () => {
    expect(await run(['[color:red]!'])).toMatchInlineSnapshot(`
      ".\\[color\\:red\\]\\! {
        color: red !important;
      }"
    `)
  })
})

describe('sorting', () => {
  it('should sort utilities based on their property order', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --spacing-1: 0.25rem;
          }
          @tailwind utilities;
        `,
        ['pointer-events-none', 'flex', 'p-1', 'px-1', 'pl-1'].sort(() => Math.random() - 0.5),
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --spacing-1: .25rem;
      }

      .pointer-events-none {
        pointer-events: none;
      }

      .flex {
        display: flex;
      }

      .p-1 {
        padding: var(--spacing-1, .25rem);
      }

      .px-1 {
        padding-left: var(--spacing-1, .25rem);
        padding-right: var(--spacing-1, .25rem);
      }

      .pl-1 {
        padding-left: var(--spacing-1, .25rem);
      }"
    `)
  })

  it('should sort based on amount of properties', async () => {
    expect(await run(['text-clip', 'truncate', 'overflow-scroll'])).toMatchInlineSnapshot(`
      ".truncate {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .overflow-scroll {
        overflow: scroll;
      }

      .text-clip {
        text-overflow: clip;
      }"
    `)
  })

  /**
   * Space utilities are implemented using margin, but they act more like a
   * polyfill for gap. This means that they should be sorted near gap, not
   * margin.
   */
  it('should sort utilities with a custom internal --tw-sort correctly', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --spacing-0: 0px;
            --spacing-2: 0.5rem;
            --spacing-4: 1rem;
          }
          @tailwind utilities;
        `,
        ['mx-0', 'gap-4', 'space-x-2'].sort(() => Math.random() - 0.5),
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --spacing-0: 0px;
        --spacing-2: .5rem;
        --spacing-4: 1rem;
      }

      .mx-0 {
        margin-left: var(--spacing-0, 0px);
        margin-right: var(--spacing-0, 0px);
      }

      .gap-4 {
        gap: var(--spacing-4, 1rem);
      }

      :where(.space-x-2 > :not(:last-child)) {
        margin-inline-start: calc(var(--spacing-2, .5rem) * var(--tw-space-x-reverse));
        margin-inline-end: calc(var(--spacing-2, .5rem) * calc(1 - var(--tw-space-x-reverse)));
      }

      @supports (-moz-orient: inline) {
        @layer base {
          *, :before, :after, ::backdrop {
            --tw-space-x-reverse: 0;
          }
        }
      }

      @property --tw-space-x-reverse {
        syntax: "<number>";
        inherits: false;
        initial-value: 0;
      }"
    `)
  })

  it('should move variants to the end while sorting', async () => {
    expect(
      await run(
        ['pointer-events-none', 'flex', 'hover:flex', 'focus:pointer-events-none'].sort(
          () => Math.random() - 0.5,
        ),
      ),
    ).toMatchInlineSnapshot(`
        ".pointer-events-none {
          pointer-events: none;
        }

        .flex {
          display: flex;
        }

        .hover\\:flex:hover {
          display: flex;
        }

        .focus\\:pointer-events-none:focus {
          pointer-events: none;
        }"
      `)
  })

  /**
   * Every variant should be sorted by its position in the variant list. Every
   * combination of variants that exist before the current variant should always
   * be sorted before the current variant.
   *
   * Given the following list of variants:
   * 1. `hover`
   * 2. `focus`
   * 3. `disabled`
   *
   * This means that `hover` should be before `focus`, `focus` should be before
   * `disabled`. This also means that the combination of `hover` and `focus`
   * (stacked variants) should be before `disabled` because all used variants
   * are defined before the `disabled` variant.
   */
  it('should sort variants and stacked variants by variant position', async () => {
    expect(
      await run(
        ['flex', 'hover:flex', 'focus:flex', 'disabled:flex', 'hover:focus:flex'].sort(
          () => Math.random() - 0.5,
        ),
      ),
    ).toMatchInlineSnapshot(`
      ".flex {
        display: flex;
      }

      .hover\\:flex:hover {
        display: flex;
      }

      .focus\\:flex:focus {
        display: flex;
      }

      .hover\\:focus\\:flex:hover:focus {
        display: flex;
      }

      .disabled\\:flex:disabled {
        display: flex;
      }"
    `)
  })

  // TODO: Extend this test with user-defined variants to ensure they are sorted
  // correctly.
  it('should order group-* and peer-* variants based on the sort order of the group and peer variant but also based on the variant they are wrapping', async () => {
    expect(
      await run(
        [
          'hover:flex',

          'group-hover:flex',
          'group-focus:flex',

          'peer-hover:flex',
          'peer-focus:flex',

          'group-hover:peer-hover:flex',
          'group-hover:peer-focus:flex',
          'peer-hover:group-hover:flex',
          'peer-hover:group-focus:flex',
          'group-focus:peer-hover:flex',
          'group-focus:peer-focus:flex',
          'peer-focus:group-hover:flex',
          'peer-focus:group-focus:flex',
        ].sort(() => Math.random() - 0.5),
      ),
    ).toMatchInlineSnapshot(`
      ".group-hover\\:flex:is(:where(.group):hover *) {
        display: flex;
      }

      .group-focus\\:flex:is(:where(.group):focus *) {
        display: flex;
      }

      .peer-hover\\:flex:is(:where(.peer):hover ~ *) {
        display: flex;
      }

      .group-hover\\:peer-hover\\:flex:is(:where(.group):hover *):is(:where(.peer):hover ~ *) {
        display: flex;
      }

      .peer-hover\\:group-hover\\:flex:is(:where(.peer):hover ~ *):is(:where(.group):hover *) {
        display: flex;
      }

      .group-focus\\:peer-hover\\:flex:is(:where(.group):focus *):is(:where(.peer):hover ~ *) {
        display: flex;
      }

      .peer-hover\\:group-focus\\:flex:is(:where(.peer):hover ~ *):is(:where(.group):focus *) {
        display: flex;
      }

      .peer-focus\\:flex:is(:where(.peer):focus ~ *) {
        display: flex;
      }

      .group-hover\\:peer-focus\\:flex:is(:where(.group):hover *):is(:where(.peer):focus ~ *) {
        display: flex;
      }

      .peer-focus\\:group-hover\\:flex:is(:where(.peer):focus ~ *):is(:where(.group):hover *) {
        display: flex;
      }

      .group-focus\\:peer-focus\\:flex:is(:where(.group):focus *):is(:where(.peer):focus ~ *) {
        display: flex;
      }

      .peer-focus\\:group-focus\\:flex:is(:where(.peer):focus ~ *):is(:where(.group):focus *) {
        display: flex;
      }

      .hover\\:flex:hover {
        display: flex;
      }"
    `)
  })
})

// Parsing theme values from CSS
describe('Parsing themes values from CSS', () => {
  test('Can read values from `@theme`', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --color-red-500: #f00;
          }
          @tailwind utilities;
        `,
        ['accent-red-500'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-red-500: red;
      }

      .accent-red-500 {
        accent-color: var(--color-red-500, red);
      }"
    `)
  })

  test('Later values from `@theme` override earlier ones', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --color-red-500: #f00;
            --color-red-500: #f10;
          }
          @tailwind utilities;
        `,
        ['accent-red-500'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-red-500: #f10;
      }

      .accent-red-500 {
        accent-color: var(--color-red-500, #f10);
      }"
    `)
  })

  test('Multiple `@theme` blocks are merged', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --color-red-500: #f00;
          }
          @theme {
            --color-blue-500: #00f;
          }
          @tailwind utilities;
        `,
        ['accent-red-500', 'accent-blue-500'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-red-500: red;
        --color-blue-500: #00f;
      }

      .accent-blue-500 {
        accent-color: var(--color-blue-500, #00f);
      }

      .accent-red-500 {
        accent-color: var(--color-red-500, red);
      }"
    `)
  })

  test('`@theme` values with escaped forward slashes map to unescaped slashes in candidate values', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            /* Cursed but we want this to work */
            --width-1\/2: 75%;
            --width-75\%: 50%;
          }
          @tailwind utilities;
        `,
        ['w-1/2', 'w-75%'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --width-1\\/2: 75%;
        --width-75\\%: 50%;
      }

      .w-1\\/2 {
        width: var(--width-1\\/2, 75%);
      }

      .w-75\\% {
        width: var(--width-75\\%, 50%);
      }"
    `)
  })

  test('`@keyframes` in `@theme` are hoisted', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --color-red: red;
            --animate-foo: foo 1s infinite;

            @keyframes foo {
              to {
                opacity: 1;
              }
            }

            --font-size-lg: 20px;
          }
          @tailwind utilities;
        `,
        ['accent-red', 'text-lg'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-red: red;
        --animate-foo: foo 1s infinite;
        --font-size-lg: 20px;
      }

      .text-lg {
        font-size: var(--font-size-lg, 20px);
      }

      .accent-red {
        accent-color: var(--color-red, red);
      }

      @keyframes foo {
        to {
          opacity: 1;
        }
      }"
    `)
  })

  test('`@theme` values can be unset', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --color-red: #f00;
            --color-blue: #00f;
            --font-size-sm: 13px;
            --font-size-md: 16px;
          }
          @theme {
            --color-*: initial;
            --font-size-md: initial;
          }
          @theme {
            --color-green: #0f0;
          }
          @tailwind utilities;
        `,
        ['accent-red', 'accent-blue', 'accent-green', 'text-sm', 'text-md'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --font-size-sm: 13px;
        --color-green: #0f0;
      }

      .text-sm {
        font-size: var(--font-size-sm, 13px);
      }

      .accent-green {
        accent-color: var(--color-green, #0f0);
      }"
    `)
  })

  test('all `@theme` values can be unset at once', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --color-red: #f00;
            --color-blue: #00f;
            --font-size-sm: 13px;
            --font-size-md: 16px;
          }
          @theme {
            --*: initial;
          }
          @theme {
            --color-green: #0f0;
          }
          @tailwind utilities;
        `,
        ['accent-red', 'accent-blue', 'accent-green', 'text-sm', 'text-md'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-green: #0f0;
      }

      .accent-green {
        accent-color: var(--color-green, #0f0);
      }"
    `)
  })

  test('unused keyframes are removed when an animation is unset', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --animate-foo: foo 1s infinite;
            --animate-foobar: foobar 1s infinite;

            @keyframes foo {
              to {
                opacity: 1;
              }
            }

            @keyframes foobar {
              to {
                opacity: 0;
              }
            }
          }
          @theme {
            --animate-foo: initial;
          }
          @tailwind utilities;
        `,
        ['animate-foo', 'animate-foobar'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --animate-foobar: foobar 1s infinite;
      }

      .animate-foobar {
        animation: var(--animate-foobar, foobar 1s infinite);
      }

      @keyframes foobar {
        to {
          opacity: 0;
        }
      }"
    `)
  })

  test('theme values added as reference are not included in the output as variables', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --color-tomato: #e10c04;
          }
          @theme reference {
            --color-potato: #ac855b;
          }
          @tailwind utilities;
        `,
        ['bg-tomato', 'bg-potato'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-tomato: #e10c04;
      }

      .bg-potato {
        background-color: var(--color-potato, #ac855b);
      }

      .bg-tomato {
        background-color: var(--color-tomato, #e10c04);
      }"
    `)
  })

  test('theme values added as reference that override existing theme value suppress the output of the original theme value as a variable', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --color-potato: #ac855b;
          }
          @theme reference {
            --color-potato: #c794aa;
          }
          @tailwind utilities;
        `,
        ['bg-potato'],
      ),
    ).toMatchInlineSnapshot(`
      ".bg-potato {
        background-color: var(--color-potato, #c794aa);
      }"
    `)
  })

  test('overriding a reference theme value with a non-reference theme value includes it in the output as a variable', async () => {
    expect(
      await compileCss(
        css`
          @theme reference {
            --color-potato: #ac855b;
          }
          @theme {
            --color-potato: #c794aa;
          }
          @tailwind utilities;
        `,
        ['bg-potato'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-potato: #c794aa;
      }

      .bg-potato {
        background-color: var(--color-potato, #c794aa);
      }"
    `)
  })

  test('wrapping `@theme` with `@media reference` behaves like `@theme reference` to support `@import` statements', async () => {
    expect(
      await compileCss(
        css`
          @theme {
            --color-tomato: #e10c04;
          }
          @media theme(reference) {
            @theme {
              --color-potato: #ac855b;
            }
            @theme {
              --color-avocado: #c0cc6d;
            }
          }
          @tailwind utilities;
        `,
        ['bg-tomato', 'bg-potato', 'bg-avocado'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-tomato: #e10c04;
      }

      .bg-avocado {
        background-color: var(--color-avocado, #c0cc6d);
      }

      .bg-potato {
        background-color: var(--color-potato, #ac855b);
      }

      .bg-tomato {
        background-color: var(--color-tomato, #e10c04);
      }"
    `)
  })

  test('`@media theme(…)` can only contain `@theme` rules', () =>
    expect(
      compileCss(
        css`
          @media theme(reference) {
            .not-a-theme-rule {
              color: cursed;
            }
          }
          @tailwind utilities;
        `,
        ['bg-tomato', 'bg-potato', 'bg-avocado'],
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Files imported with \`@import "…" theme(…)\` must only contain \`@theme\` blocks.]`,
    ))

  test('theme values added as `inline` are not wrapped in `var(…)` when used as utility values', async () => {
    expect(
      await compileCss(
        css`
          @theme inline {
            --color-tomato: #e10c04;
            --color-potato: #ac855b;
            --color-primary: var(--primary);
          }

          @tailwind utilities;
        `,
        ['bg-tomato', 'bg-potato', 'bg-primary'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-tomato: #e10c04;
        --color-potato: #ac855b;
        --color-primary: var(--primary);
      }

      .bg-potato {
        background-color: #ac855b;
      }

      .bg-primary {
        background-color: var(--primary);
      }

      .bg-tomato {
        background-color: #e10c04;
      }"
    `)
  })

  test('wrapping `@theme` with `@media theme(inline)` behaves like `@theme inline` to support `@import` statements', async () => {
    expect(
      await compileCss(
        css`
          @media theme(inline) {
            @theme {
              --color-tomato: #e10c04;
              --color-potato: #ac855b;
              --color-primary: var(--primary);
            }
          }

          @tailwind utilities;
        `,
        ['bg-tomato', 'bg-potato', 'bg-primary'],
      ),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-tomato: #e10c04;
        --color-potato: #ac855b;
        --color-primary: var(--primary);
      }

      .bg-potato {
        background-color: #ac855b;
      }

      .bg-primary {
        background-color: var(--primary);
      }

      .bg-tomato {
        background-color: #e10c04;
      }"
    `)
  })

  test('`inline` and `reference` can be used together', async () => {
    expect(
      await compileCss(
        css`
          @theme reference inline {
            --color-tomato: #e10c04;
            --color-potato: #ac855b;
            --color-primary: var(--primary);
          }

          @tailwind utilities;
        `,
        ['bg-tomato', 'bg-potato', 'bg-primary'],
      ),
    ).toMatchInlineSnapshot(`
      ".bg-potato {
        background-color: #ac855b;
      }

      .bg-primary {
        background-color: var(--primary);
      }

      .bg-tomato {
        background-color: #e10c04;
      }"
    `)
  })

  test('`inline` and `reference` can be used together in `media(…)`', async () => {
    expect(
      await compileCss(
        css`
          @media theme(reference inline) {
            @theme {
              --color-tomato: #e10c04;
              --color-potato: #ac855b;
              --color-primary: var(--primary);
            }
          }

          @tailwind utilities;
        `,
        ['bg-tomato', 'bg-potato', 'bg-primary'],
      ),
    ).toMatchInlineSnapshot(`
      ".bg-potato {
        background-color: #ac855b;
      }

      .bg-primary {
        background-color: var(--primary);
      }

      .bg-tomato {
        background-color: #e10c04;
      }"
    `)
  })
})

describe('plugins', () => {
  test('@plugin cannot be nested.', () =>
    expect(
      compile(
        css`
          div {
            @plugin "my-plugin";
          }
        `,
        {
          loadPlugin: async () => {
            return ({ addVariant }: PluginAPI) => {
              addVariant('hocus', '&:hover, &:focus')
            }
          },
        },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: \`@plugin\` cannot be nested.]`))

  test('@plugin can provide options', async () => {
    expect.hasAssertions()

    let { build } = await compile(
      css`
        @tailwind utilities;
        @plugin {
          color: red;
        }
      `,
      {
        loadPlugin: async () => {
          return plugin.withOptions((options) => {
            expect(options).toEqual({
              color: 'red',
            })

            return ({ addUtilities }) => {
              addUtilities({
                '.text-primary': {
                  color: options.color,
                },
              })
            }
          })
        },
      },
    )

    let compiled = build(['text-primary'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      ".text-primary {
        color: red;
      }"
    `)
  })

  test('@plugin options can specify null, booleans, or numbers', async () => {
    expect.hasAssertions()

    await compile(
      css`
        @tailwind utilities;
        @plugin {
          is-null: null;
          is-true: true;
          is-false: false;
          is-int: 1234567;
          is-float: 1.35;
          is-sci: 1.35e-5;
        }
      `,
      {
        loadPlugin: async () => {
          return plugin.withOptions((options) => {
            expect(options).toEqual({
              'is-null': null,
              'is-true': true,
              'is-false': false,
              'is-int': 1234567,
              'is-float': 1.35,
              'is-sci': 1.35e-5,
            })

            return () => {}
          })
        },
      },
    )
  })

  test('@plugin options can only be simple key/value pairs', () => {
    expect(
      compile(
        css`
          @plugin {
            color: red;
            sizes {
              sm: 1rem;
              md: 2rem;
            }
          }
        `,
        {
          loadPlugin: async () => {
            return plugin.withOptions((options) => {
              return ({ addUtilities }) => {
                addUtilities({
                  '.text-primary': {
                    color: options.color,
                  },
                })
              }
            })
          },
        },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: \`@plugin\` can only contain declarations.]`,
    )
  })

  test('@plugin options can only be provided to plugins using withOptions', () => {
    expect(
      compile(
        css`
          @plugin "my-plugin" {
            color: red;
          }
        `,
        {
          loadPlugin: async () => {
            return plugin(({ addUtilities }) => {
              addUtilities({
                '.text-primary': {
                  color: 'red',
                },
              })
            })
          },
        },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: The plugin "my-plugin" does not accept options]`,
    )
  })

  test('@plugin errors on array-like syntax', () => {
    expect(
      compile(
        css`
          @plugin "my-plugin" {
            --color: [ 'red', 'green', 'blue'];
          }
        `,
        {
          loadPlugin: async () => plugin(() => {}),
        },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Arrays are not supported in \`@plugin\` options.]`,
    )
  })

  test('@plugin errors on object-like syntax', () => {
    expect(
      compile(
        css`
          @plugin "my-plugin" {
            --color: {
              red: 100;
              green: 200;
              blue: 300;
            };
          }
        `,
        {
          loadPlugin: async () => plugin(() => {}),
        },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: Objects are not supported in \`@plugin\` options.]`)
  })

  test('addVariant with string selector', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadPlugin: async () => {
          return ({ addVariant }: PluginAPI) => {
            addVariant('hocus', '&:hover, &:focus')
          }
        },
      },
    )
    let compiled = build(['hocus:underline', 'group-hocus:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .group-hocus\\:flex:is(:is(:where(.group):hover, :where(.group):focus) *) {
          display: flex;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('addVariant with array of selectors', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadPlugin: async () => {
          return ({ addVariant }: PluginAPI) => {
            addVariant('hocus', ['&:hover', '&:focus'])
          }
        },
      },
    )

    let compiled = build(['hocus:underline', 'group-hocus:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .group-hocus\\:flex:is(:where(.group):hover *), .group-hocus\\:flex:is(:where(.group):focus *) {
          display: flex;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('addVariant with object syntax and @slot', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadPlugin: async () => {
          return ({ addVariant }: PluginAPI) => {
            addVariant('hocus', {
              '&:hover': '@slot',
              '&:focus': '@slot',
            })
          }
        },
      },
    )
    let compiled = build(['hocus:underline', 'group-hocus:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .group-hocus\\:flex:is(:where(.group):hover *), .group-hocus\\:flex:is(:where(.group):focus *) {
          display: flex;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('addVariant with object syntax, media, nesting and multiple @slot', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadPlugin: async () => {
          return ({ addVariant }: PluginAPI) => {
            addVariant('hocus', {
              '@media (hover: hover)': {
                '&:hover': '@slot',
              },
              '&:focus': '@slot',
            })
          }
        },
      },
    )
    let compiled = build(['hocus:underline', 'group-hocus:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (hover: hover) {
          .group-hocus\\:flex:is(:where(.group):hover *) {
            display: flex;
          }
        }

        .group-hocus\\:flex:is(:where(.group):focus *) {
          display: flex;
        }

        @media (hover: hover) {
          .hocus\\:underline:hover {
            text-decoration-line: underline;
          }
        }

        .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('@slot is preserved when used as a custom property value', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadPlugin: async () => {
          return ({ addVariant }: PluginAPI) => {
            addVariant('hocus', {
              '&': {
                '--custom-property': '@slot',
                '&:hover': '@slot',
                '&:focus': '@slot',
              },
            })
          }
        },
      },
    )
    let compiled = build(['hocus:underline'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .hocus\\:underline {
          --custom-property: @slot;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('built-in variants can be overridden while keeping their order', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,

      {
        loadPlugin: async () => {
          return ({ addVariant }: PluginAPI) => {
            addVariant('dark', '&:is([data-theme=dark] *)')
          }
        },
      },
    )
    let compiled = build(
      // Make sure the order does not change by including the variants
      // immediately before and after `dark`
      ['rtl:flex', 'dark:flex', 'starting:flex'],
    )

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .rtl\\:flex:where([dir="rtl"], [dir="rtl"] *) {
          display: flex;
        }

        .dark\\:flex:is([data-theme="dark"] *) {
          display: flex;
        }

        @starting-style {
          .starting\\:flex {
            display: flex;
          }
        }
      }"
    `)
  })
})

describe('@source', () => {
  test('emits @source files', async () => {
    let { globs } = await compile(css`
      @source "./foo/bar/*.ts";
    `)

    expect(globs).toEqual(['./foo/bar/*.ts'])
  })

  test('emits multiple @source files', async () => {
    let { globs } = await compile(css`
      @source "./foo/**/*.ts";
      @source "./php/secr3t/smarty.php";
    `)

    expect(globs).toEqual(['./foo/**/*.ts', './php/secr3t/smarty.php'])
  })
})

describe('@variant', () => {
  test('@variant must be top-level and cannot be nested', () =>
    expect(
      compileCss(css`
        .foo {
          @variant hocus (&:hover, &:focus);
        }
      `),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: \`@variant\` cannot be nested.]`))

  test('@variant with no body must include a selector', () =>
    expect(
      compileCss(css`
        @variant hocus;
      `),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '[Error: `@variant hocus` has no selector or body.]',
    ))

  test('@variant with selector must include a body', () =>
    expect(
      compileCss(css`
        @variant hocus {
        }
      `),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '[Error: `@variant hocus` has no selector or body.]',
    ))

  test('@variant cannot have both a selector and a body', () =>
    expect(
      compileCss(css`
        @variant hocus (&:hover, &:focus) {
          &:is(.potato) {
            @slot;
          }
        }
      `),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: \`@variant hocus\` cannot have both a selector and a body.]`,
    ))

  describe('body-less syntax', () => {
    test('selector variant', async () => {
      let { build } = await compile(css`
        @variant hocus (&:hover, &:focus);

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['hocus:underline', 'group-hocus:flex'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          .group-hocus\\:flex:is(:where(.group):hover *), .group-hocus\\:flex:is(:where(.group):focus *) {
            display: flex;
          }

          .hocus\\:underline:hover, .hocus\\:underline:focus {
            text-decoration-line: underline;
          }
        }"
      `)
    })

    test('at-rule variant', async () => {
      let { build } = await compile(css`
        @variant any-hover (@media (any-hover: hover));

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['any-hover:hover:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          @media (any-hover: hover) {
            .any-hover\\:hover\\:underline:hover {
              text-decoration-line: underline;
            }
          }
        }"
      `)
    })
  })

  describe('body with @slot syntax', () => {
    test('selector with @slot', async () => {
      let { build } = await compile(css`
        @variant selected {
          &[data-selected] {
            @slot;
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['selected:underline', 'group-selected:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          .group-selected\\:underline:is(:where(.group)[data-selected] *) {
            text-decoration-line: underline;
          }

          .selected\\:underline[data-selected] {
            text-decoration-line: underline;
          }
        }"
      `)
    })

    test('grouped selectors with @slot', async () => {
      let { build } = await compile(css`
        @variant hocus {
          &:hover,
          &:focus {
            @slot;
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['hocus:underline', 'group-hocus:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          .group-hocus\\:underline:is(:is(:where(.group):hover, :where(.group):focus) *) {
            text-decoration-line: underline;
          }

          .hocus\\:underline:hover, .hocus\\:underline:focus {
            text-decoration-line: underline;
          }
        }"
      `)
    })

    test('multiple selectors with @slot', async () => {
      let { build } = await compile(css`
        @variant hocus {
          &:hover {
            @slot;
          }

          &:focus {
            @slot;
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['hocus:underline', 'group-hocus:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          .group-hocus\\:underline:is(:where(.group):hover *), .group-hocus\\:underline:is(:where(.group):focus *) {
            text-decoration-line: underline;
          }

          .hocus\\:underline:hover, .hocus\\:underline:focus {
            text-decoration-line: underline;
          }
        }"
      `)
    })

    test('nested selector with @slot', async () => {
      let { build } = await compile(css`
        @variant custom-before {
          & {
            --has-before: 1;
            &::before {
              @slot;
            }
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['custom-before:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          .custom-before\\:underline {
            --has-before: 1;
          }

          .custom-before\\:underline:before {
            text-decoration-line: underline;
          }
        }"
      `)
    })

    test('grouped nested selectors with @slot', async () => {
      let { build } = await compile(css`
        @variant custom-before {
          & {
            --has-before: 1;
            &::before {
              &:hover,
              &:focus {
                @slot;
              }
            }
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['custom-before:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          .custom-before\\:underline {
            --has-before: 1;
          }

          .custom-before\\:underline:before:hover, .custom-before\\:underline:before:focus {
            text-decoration-line: underline;
          }
        }"
      `)
    })

    test('nested multiple selectors with @slot', async () => {
      let { build } = await compile(css`
        @variant hocus {
          &:hover {
            @media (hover: hover) {
              @slot;
            }
          }

          &:focus {
            @slot;
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['hocus:underline', 'group-hocus:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          @media (hover: hover) {
            .group-hocus\\:underline:is(:where(.group):hover *) {
              text-decoration-line: underline;
            }
          }

          .group-hocus\\:underline:is(:where(.group):focus *) {
            text-decoration-line: underline;
          }

          @media (hover: hover) {
            .hocus\\:underline:hover {
              text-decoration-line: underline;
            }
          }

          .hocus\\:underline:focus {
            text-decoration-line: underline;
          }
        }"
      `)
    })

    test('selector nested under at-rule with @slot', async () => {
      let { build } = await compile(css`
        @variant hocus {
          @media (hover: hover) {
            &:hover {
              @slot;
            }
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['hocus:underline', 'group-hocus:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          @media (hover: hover) {
            .group-hocus\\:underline:is(:where(.group):hover *) {
              text-decoration-line: underline;
            }
          }

          @media (hover: hover) {
            .hocus\\:underline:hover {
              text-decoration-line: underline;
            }
          }
        }"
      `)
    })

    test('at-rule with @slot', async () => {
      let { build } = await compile(css`
        @variant any-hover {
          @media (any-hover: hover) {
            @slot;
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['any-hover:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          @media (any-hover: hover) {
            .any-hover\\:underline {
              text-decoration-line: underline;
            }
          }
        }"
      `)
    })

    test('multiple at-rules with @slot', async () => {
      let { build } = await compile(css`
        @variant desktop {
          @media (any-hover: hover) {
            @slot;
          }

          @media (pointer: fine) {
            @slot;
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['desktop:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          @media (any-hover: hover) {
            .desktop\\:underline {
              text-decoration-line: underline;
            }
          }

          @media (pointer: fine) {
            .desktop\\:underline {
              text-decoration-line: underline;
            }
          }
        }"
      `)
    })

    test('nested at-rules with @slot', async () => {
      let { build } = await compile(css`
        @variant custom-variant {
          @media (orientation: landscape) {
            @media screen {
              @slot;
            }

            @media print {
              display: none;
            }
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['custom-variant:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          @media (orientation: landscape) {
            @media screen {
              .custom-variant\\:underline {
                text-decoration-line: underline;
              }
            }

            @media print {
              .custom-variant\\:underline {
                display: none;
              }
            }
          }
        }"
      `)
    })

    test('at-rule and selector with @slot', async () => {
      let { build } = await compile(css`
        @variant custom-dark {
          @media (prefers-color-scheme: dark) {
            @slot;
          }
          &:is(.dark *) {
            @slot;
          }
        }

        @layer utilities {
          @tailwind utilities;
        }
      `)
      let compiled = build(['custom-dark:underline'])

      expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
        "@layer utilities {
          @media (prefers-color-scheme: dark) {
            .custom-dark\\:underline {
              text-decoration-line: underline;
            }
          }

          .custom-dark\\:underline:is(.dark *) {
            text-decoration-line: underline;
          }
        }"
      `)
    })
  })

  test('built-in variants can be overridden while keeping their order', async () => {
    expect(
      await compileCss(
        css`
          @variant dark (&:is([data-theme='dark'] *));
          @layer utilities {
            @tailwind utilities;
          }
        `,

        // Make sure the order does not change by including the variants
        // immediately before and after `dark`
        ['rtl:flex', 'dark:flex', 'starting:flex'],
      ),
    ).toMatchInlineSnapshot(`
      "@layer utilities {
        .rtl\\:flex:where([dir="rtl"], [dir="rtl"] *) {
          display: flex;
        }

        .dark\\:flex:is([data-theme="dark"] *) {
          display: flex;
        }

        @starting-style {
          .starting\\:flex {
            display: flex;
          }
        }
      }"
    `)
  })

  test('at-rule-only variants cannot be used with compound variants', async () => {
    expect(
      await compileCss(
        css`
          @variant foo (@media foo);

          @layer utilities {
            @tailwind utilities;
          }
        `,

        ['foo:flex', 'group-foo:flex', 'peer-foo:flex', 'has-foo:flex', 'not-foo:flex'],
      ),
    ).toMatchInlineSnapshot(`
      "@layer utilities {
        @media foo {
          .foo\\:flex {
            display: flex;
          }
        }
      }"
    `)
  })
})

test('addBase', async () => {
  let { build } = await compile(
    css`
      @plugin "my-plugin";
      @layer base, utilities;
      @layer utilities {
        @tailwind utilities;
      }
    `,

    {
      loadPlugin: async () => {
        return ({ addBase }: PluginAPI) => {
          addBase({
            body: {
              'font-feature-settings': '"tnum"',
            },
          })
        }
      },
    },
  )

  let compiled = build(['underline'])

  expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
    "@layer base {
      body {
        font-feature-settings: "tnum";
      }
    }

    @layer utilities {
      .underline {
        text-decoration-line: underline;
      }
    }"
  `)
})
