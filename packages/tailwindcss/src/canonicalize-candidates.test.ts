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
    /// Legacy bg-gradient-* → bg-linear-*
    ['bg-gradient-to-t', 'bg-linear-to-t'],
    ['bg-gradient-to-tr', 'bg-linear-to-tr'],
    ['bg-gradient-to-r', 'bg-linear-to-r'],
    ['bg-gradient-to-br', 'bg-linear-to-br'],
    ['bg-gradient-to-b', 'bg-linear-to-b'],
    ['bg-gradient-to-bl', 'bg-linear-to-bl'],
    ['bg-gradient-to-l', 'bg-linear-to-l'],
    ['bg-gradient-to-tl', 'bg-linear-to-tl'],

    /// theme(…) to `var(…)`
    // Keep candidates that don't contain `theme(…)` or `theme(…, …)`
    ['[color:red]', '[color:red]'],

    // Handle special cases around `.1` in the `theme(…)`
    ['[--value:theme(spacing.1)]', '[--value:--spacing(1)]'],
    ['[--value:theme(fontSize.xs.1.lineHeight)]', '[--value:var(--text-xs--line-height)]'],
    ['[--value:theme(spacing[1.25])]', '[--value:--spacing(1.25)]'],

    // Should not convert invalid spacing values to calc
    ['[--value:theme(spacing[1.1])]', '[--value:theme(spacing[1.1])]'],

    // Convert to `var(…)` if we can resolve the path
    ['[color:theme(colors.red.500)]', '[color:var(--color-red-500)]'], // Arbitrary property
    ['[color:theme(colors.red.500)]/50', '[color:var(--color-red-500)]/50'], // Arbitrary property + modifier
    ['bg-[theme(colors.red.500)]', 'bg-(--color-red-500)'], // Arbitrary value
    ['bg-[size:theme(spacing.4)]', 'bg-[size:--spacing(4)]'], // Arbitrary value + data type hint

    // Pretty print CSS functions preceded by an operator to prevent consecutive
    // operator characters.
    ['w-[calc(100dvh-theme(spacing.2))]', 'w-[calc(100dvh-(--spacing(2)))]'],
    ['w-[calc(100dvh+theme(spacing.2))]', 'w-[calc(100dvh+(--spacing(2)))]'],
    ['w-[calc(100dvh/theme(spacing.2))]', 'w-[calc(100dvh/(--spacing(2)))]'],
    ['w-[calc(100dvh*theme(spacing.2))]', 'w-[calc(100dvh*(--spacing(2)))]'],

    // Convert to `var(…)` if we can resolve the path, but keep fallback values
    ['bg-[theme(colors.red.500,red)]', 'bg-(--color-red-500,red)'],

    // Keep `theme(…)` if we can't resolve the path
    ['bg-[theme(colors.foo.1000)]', 'bg-[theme(colors.foo.1000)]'],

    // Keep `theme(…)` if we can't resolve the path, but still try to convert the
    // fallback value.
    [
      'bg-[theme(colors.foo.1000,theme(colors.red.500))]',
      'bg-[theme(colors.foo.1000,var(--color-red-500))]',
    ],

    // Use `theme(…)` (deeply nested) inside of a `calc(…)` function
    ['text-[calc(theme(fontSize.xs)*2)]', 'text-[calc(var(--text-xs)*2)]'],

    // Multiple `theme(… / …)` calls should result in modern syntax of `theme(…)`
    // - Can't convert to `var(…)` because that would lose the modifier.
    // - Can't convert to a candidate modifier because there are multiple
    //   `theme(…)` calls.
    //
    //   If we really want to, we can make a fancy migration that tries to move it
    //   to a candidate modifier _if_ all `theme(…)` calls use the same modifier.
    [
      '[color:theme(colors.red.500/50,theme(colors.blue.500/50))]',
      '[color:--theme(--color-red-500/50,--theme(--color-blue-500/50))]',
    ],
    [
      '[color:theme(colors.red.500/50,theme(colors.blue.500/50))]/50',
      '[color:--theme(--color-red-500/50,--theme(--color-blue-500/50))]/50',
    ],

    // Convert the `theme(…)`, but try to move the inline modifier (e.g. `50%`),
    // to a candidate modifier.
    // Arbitrary property, with simple percentage modifier
    ['[color:theme(colors.red.500/75%)]', '[color:var(--color-red-500)]/75'],

    // Arbitrary property, with numbers (0-1) without a unit
    ['[color:theme(colors.red.500/.12)]', '[color:var(--color-red-500)]/12'],
    ['[color:theme(colors.red.500/0.12)]', '[color:var(--color-red-500)]/12'],

    // Arbitrary property, with more complex modifier (we only allow whole numbers
    // as bare modifiers). Convert the complex numbers to arbitrary values instead.
    ['[color:theme(colors.red.500/12.34%)]', '[color:var(--color-red-500)]/[12.34%]'],
    ['[color:theme(colors.red.500/var(--opacity))]', '[color:var(--color-red-500)]/(--opacity)'],
    ['[color:theme(colors.red.500/.12345)]', '[color:var(--color-red-500)]/[12.345]'],
    ['[color:theme(colors.red.500/50.25%)]', '[color:var(--color-red-500)]/[50.25%]'],

    // Arbitrary value
    ['bg-[theme(colors.red.500/75%)]', 'bg-(--color-red-500)/75'],
    ['bg-[theme(colors.red.500/12.34%)]', 'bg-(--color-red-500)/[12.34%]'],

    // Arbitrary property that already contains a modifier
    ['[color:theme(colors.red.500/50%)]/50', '[color:--theme(--color-red-500/50%)]/50'],

    // Values that don't contain only `theme(…)` calls should not be converted to
    // use a modifier since the color is not the whole value.
    [
      'shadow-[shadow:inset_0px_1px_theme(colors.white/15%)]',
      'shadow-[shadow:inset_0px_1px_--theme(--color-white/15%)]',
    ],

    // Arbitrary value, where the candidate already contains a modifier
    // This should still migrate the `theme(…)` syntax to the modern syntax.
    ['bg-[theme(colors.red.500/50%)]/50', 'bg-[--theme(--color-red-500/50%)]/50'],

    // Variants, we can't use `var(…)` especially inside of `@media(…)`. We can
    // still upgrade the `theme(…)` to the modern syntax.
    ['max-[theme(screens.lg)]:flex', 'max-[--theme(--breakpoint-lg)]:flex'],
    // There are no variables for `--spacing` multiples, so we can't convert this
    ['max-[theme(spacing.4)]:flex', 'max-[theme(spacing.4)]:flex'],

    // This test in itself doesn't make much sense. But we need to make sure
    // that this doesn't end up as the modifier in the candidate itself.
    ['max-[theme(spacing.4/50)]:flex', 'max-[theme(spacing.4/50)]:flex'],

    // `theme(…)` calls in another CSS function is replaced correctly.
    // Additionally we remove unnecessary whitespace.
    ['grid-cols-[min(50%_,_theme(spacing.80))_auto]', 'grid-cols-[min(50%,--spacing(80))_auto]'],

    // `theme(…)` calls valid in v3, but not in v4 should still be converted.
    ['[--foo:theme(transitionDuration.500)]', '[--foo:theme(transitionDuration.500)]'],

    // Renamed theme keys
    ['max-w-[theme(screens.md)]', 'max-w-(--breakpoint-md)'],
    ['w-[theme(maxWidth.md)]', 'w-(--container-md)'],

    // Invalid cases
    ['[--foo:theme(colors.red.500/50/50)]', '[--foo:theme(colors.red.500/50/50)]'],
    ['[--foo:theme(colors.red.500/50/50)]/50', '[--foo:theme(colors.red.500/50/50)]/50'],

    // Partially invalid cases
    [
      '[--foo:theme(colors.red.500/50/50)_theme(colors.blue.200)]',
      '[--foo:theme(colors.red.500/50/50)_var(--color-blue-200)]',
    ],
    [
      '[--foo:theme(colors.red.500/50/50)_theme(colors.blue.200)]/50',
      '[--foo:theme(colors.red.500/50/50)_var(--color-blue-200)]/50',
    ],
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

describe('theme to var', () => {
  test('extended space scale converts to var or calc', async () => {
    let designSystem = await __unstable__loadDesignSystem(
      css`
        @tailwind utilities;
        @theme {
          --spacing: 0.25rem;
          --spacing-2: 2px;
          --spacing-miami: 0.875rem;
        }
      `,
      { base: __dirname },
    )
    expect(
      designSystem.canonicalizeCandidates([
        '[--value:theme(spacing.1)]',
        '[--value:theme(spacing.2)]',
        '[--value:theme(spacing.miami)]',
        '[--value:theme(spacing.nyc)]',
      ]),
    ).toEqual([
      '[--value:--spacing(1)]',
      '[--value:var(--spacing-2)]',
      '[--value:var(--spacing-miami)]',
      '[--value:theme(spacing.nyc)]',
    ])
  })

  test('custom space scale converts to var', async () => {
    let designSystem = await __unstable__loadDesignSystem(
      css`
        @tailwind utilities;
        @theme {
          --spacing-*: initial;
          --spacing-1: 0.25rem;
          --spacing-2: 0.5rem;
        }
      `,
      { base: __dirname },
    )
    expect(
      designSystem.canonicalizeCandidates([
        '[--value:theme(spacing.1)]',
        '[--value:theme(spacing.2)]',
        '[--value:theme(spacing.3)]',
      ]),
    ).toEqual([
      '[--value:var(--spacing-1)]',
      '[--value:var(--spacing-2)]',
      '[--value:theme(spacing.3)]',
    ])
  })
})
