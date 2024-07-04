import { test, vi } from 'vitest'
import type { UserConfig } from './config'
import { run } from './test-utils/run'

test('Plugins are called', ({ expect }) => {
  let fn = vi.fn()
  let handler = vi.fn()
  let config: UserConfig = {
    plugins: [fn, { handler }],
  }

  run([], config)

  expect(fn).toHaveBeenCalledWith(
    expect.objectContaining({
      addUtility: expect.any(Function),
      addUtilities: expect.any(Function),
      addVariant: expect.any(Function),
      addVariants: expect.any(Function),
    }),
  )

  expect(handler).toHaveBeenCalledWith(
    expect.objectContaining({
      addUtility: expect.any(Function),
      addUtilities: expect.any(Function),
      addVariant: expect.any(Function),
      addVariants: expect.any(Function),
    }),
  )
})

test('Asynchronous plugins are waited on', async ({ expect }) => {
  let before = vi.fn()
  let after = vi.fn()
  let config: UserConfig = {
    plugins: [
      async () => {
        before()
        await new Promise((resolve) => setTimeout(resolve))
        after()
      },
    ],
  }

  await run([], config)

  expect(before).toHaveBeenCalled()
  expect(after).toHaveBeenCalled()
})

test('Custom static utilities', ({ expect }) => {
  let config: UserConfig = {
    plugins: [
      ({ addUtilities }) => {
        addUtilities({
          '.my-red': {
            color: 'red',
            '& > *': {
              color: 'lightred',
            },
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

test('Custom functional utilities', ({ expect }) => {
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

test('Custom static variants', ({ expect }) => {
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

test('Custom functional variants', ({ expect }) => {
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
