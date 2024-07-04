import { expect, test } from 'vitest'
import type { UserConfig } from './config'
import { run } from './test-utils/run'

test('Custom static utilities', () => {
  let config: UserConfig = {
    plugins: [
      ({ addUtilities }) => {
        addUtilities({
          '.my-red': {
            color: 'red',
          },
          '.my-blue': {
            color: 'red',
          },
        })
      },
    ],
  }

  expect(run(['my-red'], config)).toMatchInlineSnapshot(`
    ".my-red {
      color: red;
    }"
  `)
  expect(run(['-my-red', 'my-red-[--value]'], config)).toEqual('')
})

test('Custom functional utilities', () => {
  let config: UserConfig = {
    plugins: [
      ({ addUtilities }) => {
        addUtilities({
          '.my-fn': (value, { modifier }) => ({
            color: modifier ? `${value ?? ''} / ${modifier ?? ''}` : `${value ?? ''}`,
          }),
        })
      },
    ],
  }

  expect(run(['my-fn', 'my-fn-[--value]', 'my-fn-[--value]/25'], config)).toMatchInlineSnapshot(`
    ".my-fn {
      color: ;
    }

    .my-fn-\\[--value\\] {
      color: var(--value);
    }

    .my-fn-\\[--value\\]\\/25 {
      color: var(--value) / 25;
    }"
  `)
})

test('Custom static variants', () => {
  let config: UserConfig = {
    plugins: [
      ({ addVariant }) => {
        addVariant('hocus', ['&:hover', '&:focus'])
        addVariant('hactive', ['&:hover', '&:active'])
      },
    ],
  }

  expect(run(['hocus:underline'], config)).toMatchInlineSnapshot(`
    ".hocus\\:underline:hover, .hocus\\:underline:focus {
      text-decoration-line: underline;
    }"
  `)
  expect(run(['hover/foo:underline', 'hover-[123]:underline'], config)).toEqual('')
})

test('Custom functional variants', () => {
  let config: UserConfig = {
    plugins: [
      ({ addVariant }) => {
        addVariant('in', ({ value, modifier }) => {
          return modifier ? [] : value ? `&:is(${value} *)` : []
        })
      },
    ],
  }

  expect(run(['in-[:checked]:underline'], config)).toMatchInlineSnapshot(`
    ".in-\\[\\:checked\\]\\:underline:is(:checked *) {
      text-decoration-line: underline;
    }"
  `)
  expect(run(['in-[:checked]/foo:underline'], config)).toEqual('')
})
