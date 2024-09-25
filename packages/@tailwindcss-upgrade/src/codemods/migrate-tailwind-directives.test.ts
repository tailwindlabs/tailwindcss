import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'
import { migrateTailwindDirectives } from './migrate-tailwind-directives'

const css = dedent

function migrate(input: string) {
  return postcss()
    .use(migrateTailwindDirectives())
    .use(formatNodes())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it("should not migrate `@import 'tailwindcss'`", async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss';
    `),
  ).toEqual(css`
    @import 'tailwindcss';
  `)
})

it('should migrate the tailwind.css import', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/tailwind.css';
    `),
  ).toEqual(css`
    @import 'tailwindcss';
  `)
})

it('should migrate the default @tailwind directives to a single import', async () => {
  expect(
    await migrate(css`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `),
  ).toEqual(css`
    @import 'tailwindcss';
  `)
})

it('should migrate the default @tailwind directives as imports to a single import', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/base';
      @import 'tailwindcss/components';
      @import 'tailwindcss/utilities';
    `),
  ).toEqual(css`
    @import 'tailwindcss';
  `)
})

it.each([
  [
    // The default order
    css`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `,
    css`
      @import 'tailwindcss';
    `,
  ],

  // @tailwind components moved, but has no effect in v4. Therefore `base` and
  // `utilities` are still in the correct order.
  [
    css`
      @tailwind base;
      @tailwind utilities;
      @tailwind components;
    `,
    css`
      @import 'tailwindcss';
    `,
  ],

  // Same as previous comment
  [
    css`
      @tailwind components;
      @tailwind base;
      @tailwind utilities;
    `,
    css`
      @import 'tailwindcss';
    `,
  ],

  // `base` and `utilities` swapped order, thus the `@layer` directives are
  // needed. The `components` directive is still ignored.
  [
    css`
      @tailwind components;
      @tailwind utilities;
      @tailwind base;
    `,
    css`
      @layer theme, components, utilities, base;
      @import 'tailwindcss';
    `,
  ],
  [
    css`
      @tailwind utilities;
      @tailwind base;
      @tailwind components;
    `,
    css`
      @layer theme, components, utilities, base;
      @import 'tailwindcss';
    `,
  ],
  [
    css`
      @tailwind utilities;
      @tailwind components;
      @tailwind base;
    `,
    css`
      @layer theme, components, utilities, base;
      @import 'tailwindcss';
    `,
  ],
])(
  'should migrate the default directives (but in different order) to a single import, order %#',
  async (input, expected) => {
    expect(await migrate(input)).toEqual(expected)
  },
)

it('should migrate `@tailwind base` to theme and preflight imports', async () => {
  expect(
    await migrate(css`
      @tailwind base;
    `),
  ).toEqual(css`
    @import 'tailwindcss/theme' layer(theme);
    @import 'tailwindcss/preflight' layer(base);
  `)
})

it('should migrate `@import "tailwindcss/base"` to theme and preflight imports', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/base';
    `),
  ).toEqual(css`
    @import 'tailwindcss/theme' layer(theme);
    @import 'tailwindcss/preflight' layer(base);
  `)
})

it('should migrate `@tailwind utilities` to an import', async () => {
  expect(
    await migrate(css`
      @tailwind utilities;
    `),
  ).toEqual(css`
    @import 'tailwindcss/utilities' layer(utilities);
  `)
})

it('should migrate `@import "tailwindcss/utilities"` to an import', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/utilities';
    `),
  ).toEqual(css`
    @import 'tailwindcss/utilities' layer(utilities);
  `)
})

it('should not migrate existing imports using a custom layer', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/utilities' layer(my-utilities);
    `),
  ).toEqual(css`
    @import 'tailwindcss/utilities' layer(my-utilities);
  `)
})

// We don't have a `@layer components` anymore, so omitting it should result
// in the full import as well. Alternatively, we could expand to:
//
// ```css
// @import 'tailwindcss/theme' layer(theme);
// @import 'tailwindcss/preflight' layer(base);
// @import 'tailwindcss/utilities' layer(utilities);
// ```
it('should migrate `@tailwind base` and `@tailwind utilities` to a single import', async () => {
  expect(
    await migrate(css`
      @tailwind base;
      @tailwind utilities;
    `),
  ).toEqual(css`
    @import 'tailwindcss';
  `)
})

it('should drop `@tailwind screens;`', async () => {
  expect(
    await migrate(css`
      @tailwind screens;
    `),
  ).toEqual('')
})

it('should drop `@tailwind variants;`', async () => {
  expect(
    await migrate(css`
      @tailwind variants;
    `),
  ).toEqual('')
})
