import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { __unstable__loadDesignSystem } from '.'
import { DefaultMap } from './utils/default-map'

const css = String.raw
const defaultTheme = fs.readFileSync(path.resolve(__dirname, '../theme.css'), 'utf8')

const designSystems = new DefaultMap((base: string) => {
  return new DefaultMap((input: string) => {
    return __unstable__loadDesignSystem(input, {
      base,
      async loadStylesheet() {
        return {
          path: '',
          base: '',
          content: css`
            @tailwind utilities;

            ${defaultTheme}
          `,
        }
      },
    })
  })
})

describe.each([['default'], ['with-variant'], ['important'], ['prefix']])('%s', (strategy) => {
  let testName = '`%s` → `%s` (%#)'
  if (strategy === 'with-variant') {
    testName = testName.replaceAll('%s', 'focus:%s')
  } else if (strategy === 'important') {
    testName = testName.replaceAll('%s', '%s!')
  } else if (strategy === 'prefix') {
    testName = testName.replaceAll('%s', 'tw:%s')
  }

  function prepare(candidate: string) {
    if (strategy === 'with-variant') {
      candidate = `focus:${candidate}`
    } else if (strategy === 'important') {
      candidate = `${candidate}!`
    } else if (strategy === 'prefix') {
      candidate = `tw:${candidate}`

      // Prefix all known CSS variables with `--tw-`, except when used inside of `--theme(…)`.
      if (candidate.includes('--')) {
        candidate = candidate
          .replace(
            // Replace the variable, as long as it is preceded by a `(`, e.g.:
            // `bg-(--foo)` or an `:` in case of `bg-(color:--foo)`.
            //
            // It also has to end in a `,` or `)` to prevent replacing functions
            // that look like variables, e.g.: `--spacing(…)`
            /([(:])--([\w-]+)([,)])/g,
            (_, start, variable, end) => `${start}--tw-${variable}${end}`,
          )
          .replaceAll('--theme(--tw-', '--theme(--')
      }
    }

    return candidate
  }

  async function expectCanonicalization(input: string, candidate: string, expected: string) {
    candidate = prepare(candidate)
    expected = prepare(expected)

    if (strategy === 'prefix') {
      input = input.replace("@import 'tailwindcss';", "@import 'tailwindcss' prefix(tw);")
    }

    let designSystem = await designSystems.get(__dirname).get(input)
    let [actual] = designSystem.canonicalizeCandidates([candidate])

    try {
      expect(actual).toBe(expected)
    } catch (err) {
      if (err instanceof Error) Error.captureStackTrace(err, expectCanonicalization)
      throw err
    }
  }

  /// ----------------------------------

  test.each([
    //
    ['[display:_flex_]', '[display:flex]'],
  ])(testName, async (candidate, expected) => {
    await expectCanonicalization(
      css`
        @import 'tailwindcss';
      `,
      candidate,
      expected,
    )
  })
})
