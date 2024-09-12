import dedent from 'dedent'
import { expect, it } from 'vitest'
import { toCss } from '../../ast'
import * as CSS from '../../css-parser'
import { migrateTailwindDirectives } from './migrate-tailwind-directives'

const css = dedent

function migrate(input: string) {
  let ast = CSS.parse(input)
  migrateTailwindDirectives(ast)
  return toCss(ast).trim()
}

it("should not migrate `@import 'tailwindcss'`", () => {
  expect(
    migrate(css`
      @import 'tailwindcss';
    `),
  ).toEqual(css`
    @import 'tailwindcss';
  `)
})

it('should migrate the default @tailwind directives to a single import', () => {
  expect(
    migrate(css`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `),
  ).toEqual(css`
    @import 'tailwindcss';
  `)
})

it('should migrate the default @tailwind directives as imports to a single import', () => {
  expect(
    migrate(css`
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
    css`
      @tailwind components;
      @tailwind base;
      @tailwind utilities;
    `,
  ],
  [
    css`
      @tailwind components;
      @tailwind utilities;
      @tailwind base;
    `,
  ],
  [
    css`
      @tailwind utilities;
      @tailwind base;
      @tailwind components;
    `,
  ],
  [
    css`
      @tailwind utilities;
      @tailwind components;
      @tailwind base;
    `,
  ],
])(
  'should migrate the default directives (but in different order) to a single import, order %#',
  (input) => {
    expect(migrate(input)).toEqual(css`
      @import 'tailwindcss';
    `)
  },
)

it('should migrate `@tailwind base` to theme and preflight imports', () => {
  expect(
    migrate(css`
      @tailwind base;
    `),
  ).toEqual(css`
    @import 'tailwindcss/theme' layer(theme);
    @import 'tailwindcss/preflight' layer(base);
  `)
})

it('should migrate `@import "tailwindcss/base"` to theme and preflight imports', () => {
  expect(
    migrate(css`
      @import 'tailwindcss/base';
    `),
  ).toEqual(css`
    @import 'tailwindcss/theme' layer(theme);
    @import 'tailwindcss/preflight' layer(base);
  `)
})

it('should migrate `@tailwind utilities` to an import', () => {
  expect(
    migrate(css`
      @tailwind utilities;
    `),
  ).toEqual(css`
    @import 'tailwindcss/utilities' layer(utilities);
  `)
})

it('should migrate `@import "tailwindcss/utilities"` to an import', () => {
  expect(
    migrate(css`
      @import 'tailwindcss/utilities';
    `),
  ).toEqual(css`
    @import 'tailwindcss/utilities' layer(utilities);
  `)
})

it('should not migrate existing imports using a custom layer', () => {
  expect(
    migrate(css`
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
it('should migrate `@tailwind base` and `@tailwind utilities` to a single import', () => {
  expect(
    migrate(css`
      @tailwind base;
      @tailwind utilities;
    `),
  ).toEqual(css`
    @import 'tailwindcss';
  `)
})

it('should drop `@tailwind screens;`', () => {
  expect(
    migrate(css`
      @tailwind screens;
    `),
  ).toEqual('')
})

it('should drop `@tailwind variants;`', () => {
  expect(
    migrate(css`
      @tailwind variants;
    `),
  ).toEqual('')
})
