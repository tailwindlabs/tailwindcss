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
          '.my-fn': (value, { modifier }) => ({
            color: modifier ? `${value ?? ''} / ${modifier ?? ''}` : `${value ?? ''}`,
          }),
        })
      },
    ],
  }

  expect(run(['my-red', 'my-fn-[--value]', 'my-fn-[--value]/25'], config)).toMatchInlineSnapshot(`
    ".my-fn-\\[--value\\] {
      color: var(--value);
    }

    .my-fn-\\[--value\\]\\/25 {
      color: var(--value) / 25;
    }

    .my-red {
      color: red;
    }"
  `)
  expect(run(['-my-red', 'my-red-[--value]'], config)).toEqual('')
})
