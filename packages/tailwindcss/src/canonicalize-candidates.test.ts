import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { __unstable__loadDesignSystem } from '.'
import type { CanonicalizeOptions } from './intellisense'
import { DefaultMap } from './utils/default-map'

const css = String.raw
const timeout = 25_000
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

            /* TODO(perf): Only here to speed up the tests */
            @theme {
              --*: initial;
              --breakpoint-lg: 64rem;
              --breakpoint-md: 48rem;
              --color-blue-200: oklch(88.2% 0.059 254.128);
              --color-blue-500: oklch(62.3% 0.214 259.815);
              --color-red-500: oklch(63.7% 0.237 25.331);
              --color-white: #fff;
              --container-md: 28rem;
              --font-weight-normal: 400;
              --leading-relaxed: 1.625;
              --spacing: 0.25rem;
              --text-sm--line-height: calc(1.25 / 0.875);
              --text-sm: 0.875rem;
              --text-xs--line-height: calc(1 / 0.75);
              --text-xs: 0.75rem;
            }
          `,
        }
      },
    })
  })
})

const DEFAULT_CANONICALIZATION_OPTIONS: CanonicalizeOptions = {
  rem: 16,
  collapse: true,
  logicalToPhysical: true,
}

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

  async function expectCanonicalization(
    input: string,
    candidate: string,
    expected: string,
    options: CanonicalizeOptions = DEFAULT_CANONICALIZATION_OPTIONS,
  ) {
    candidate = prepare(candidate)
    expected = prepare(expected)

    if (strategy === 'prefix') {
      input = input.replace("@import 'tailwindcss';", "@import 'tailwindcss' prefix(tw);")
    }

    let designSystem = await designSystems.get(__dirname).get(input)
    let [actual] = designSystem.canonicalizeCandidates([candidate], options)

    try {
      expect(actual).toBe(expected)
    } catch (err) {
      if (err instanceof Error) Error.captureStackTrace(err, expectCanonicalization)
      throw err
    }
  }

  async function expectCombinedCanonicalization(
    input: string,
    candidates: string,
    expected: string,
    options: CanonicalizeOptions = DEFAULT_CANONICALIZATION_OPTIONS,
  ) {
    let preparedCandidates = candidates.split(/\s+/g).map(prepare)
    let preparedExpected = expected.split(/\s+/g).map(prepare)

    if (strategy === 'prefix') {
      input = input.replace("@import 'tailwindcss';", "@import 'tailwindcss' prefix(tw);")
    }

    let designSystem = await designSystems.get(__dirname).get(input)
    let actual = designSystem.canonicalizeCandidates(preparedCandidates, options)

    try {
      expect(actual).toEqual(preparedExpected)
    } catch (err) {
      if (err instanceof Error) Error.captureStackTrace(err, expectCombinedCanonicalization)
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
    ['[color:red]', 'text-[red]'],

    // Handle special cases around `.1` in the `theme(…)`
    ['[--value:theme(spacing.1)]', '[--value:--spacing(1)]'],
    ['[--value:theme(fontSize.xs.1.lineHeight)]', '[--value:var(--text-xs--line-height)]'],
    ['[--value:theme(spacing[1.25])]', '[--value:--spacing(1.25)]'],

    // Should not convert invalid spacing values to calc
    ['[--value:theme(spacing[1.1])]', '[--value:theme(spacing[1.1])]'],

    // Convert to `var(…)` if we can resolve the path
    ['[color:theme(colors.red.500)]', 'text-red-500'], // Arbitrary property
    ['[color:theme(colors.red.500)]/50', 'text-red-500/50'], // Arbitrary property + modifier
    ['bg-[theme(colors.red.500)]', 'bg-red-500'], // Arbitrary value
    ['bg-[size:theme(spacing.4)]', 'bg-size-[--spacing(4)]'], // Arbitrary value + data type hint

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
    ['bg-[theme(colors.foo.1000,theme(colors.red.500))]', 'bg-red-500'],

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
      'text-[--theme(--color-red-500/50,--theme(--color-blue-500/50))]',
    ],
    [
      '[color:theme(colors.red.500/50,theme(colors.blue.500/50))]/50',
      'text-[--theme(--color-red-500/50,--theme(--color-blue-500/50))]/50',
    ],

    // Convert the `theme(…)`, but try to move the inline modifier (e.g. `50%`),
    // to a candidate modifier.
    // Arbitrary property, with simple percentage modifier
    ['[color:theme(colors.red.500/75%)]', 'text-red-500/75'],

    // Arbitrary property, with numbers (0-1) without a unit
    ['[color:theme(colors.red.500/.12)]', 'text-red-500/12'],
    ['[color:theme(colors.red.500/0.12)]', 'text-red-500/12'],

    // Arbitrary property, with more complex modifier (we only allow whole numbers
    // as bare modifiers). Convert the complex numbers to arbitrary values instead.
    ['[color:theme(colors.red.500/12.34%)]', 'text-red-500/[12.34%]'],
    ['[color:theme(colors.red.500/var(--opacity))]', 'text-red-500/(--opacity)'],
    ['[color:theme(colors.red.500/.12345)]', 'text-red-500/1234.5'],
    ['[color:theme(colors.red.500/50.25%)]', 'text-red-500/50.25'],

    // Arbitrary value
    ['bg-[theme(colors.red.500/75%)]', 'bg-red-500/75'],
    ['bg-[theme(colors.red.500/12.34%)]', 'bg-red-500/[12.34%]'],

    // Arbitrary property that already contains a modifier
    ['[color:theme(colors.red.500/50%)]/50', 'text-[--theme(--color-red-500/50%)]/50'],

    // Values that don't contain only `theme(…)` calls should not be converted to
    // use a modifier since the color is not the whole value.
    [
      'shadow-[shadow:inset_0px_1px_theme(colors.white/15%)]',
      'shadow-[inset_0px_1px_--theme(--color-white/15%)]',
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
    ['w-[theme(maxWidth.md)]', 'w-md'],

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

    // If a utility sets `property` and `--tw-{property}` with the same value,
    // we can ignore the `--tw-{property}`. This is just here for composition.
    // This means that we should be able to upgrade the one _without_ to the one
    // _with_ the variable
    ['[font-weight:400]', 'font-normal'],
    ['[line-height:0]', 'leading-0'],
    ['[border-style:solid]', 'border-solid'],
  ])(testName, { timeout }, async (candidate, expected) => {
    await expectCanonicalization(
      css`
        @import 'tailwindcss';
      `,
      candidate,
      expected,
    )
  })

  describe('arbitrary utilities', () => {
    test.each([
      // Arbitrary property to static utility
      ['[text-wrap:balance]', 'text-balance'],

      // Arbitrary property to static utility with slight differences in
      // whitespace. This will require some canonicalization.
      ['[display:_flex_]', 'flex'],
      ['[display:_flex]', 'flex'],
      ['[display:flex_]', 'flex'],

      // Arbitrary property to static utility
      // Map number to keyword-like value
      ['leading-[1]', 'leading-none'],

      // Arbitrary property to named functional utility
      ['[color:var(--color-red-500)]', 'text-red-500'],
      ['[background-color:var(--color-red-500)]', 'bg-red-500'],

      // Arbitrary property with modifier to named functional utility with modifier
      ['[color:var(--color-red-500)]/25', 'text-red-500/25'],

      // Arbitrary property with arbitrary modifier to named functional utility with
      // arbitrary modifier
      ['[color:var(--color-red-500)]/[25%]', 'text-red-500/25'],
      ['[color:var(--color-red-500)]/[100%]', 'text-red-500'],
      ['[color:var(--color-red-500)]/100', 'text-red-500'],
      ['[color:var(--color-red-500)]/[10%]', 'text-red-500/10'],
      ['[color:var(--color-red-500)]/[10.0%]', 'text-red-500/10'],
      ['[color:var(--color-red-500)]/[.1]', 'text-red-500/10'],
      ['[color:var(--color-red-500)]/[.10]', 'text-red-500/10'],
      // No need for `/50` because that's already encoded in the `--color-primary`
      // value
      ['[color:oklch(62.3%_0.214_259.815)]/50', 'text-primary'],

      // Arbitrary property to arbitrary value
      ['[max-height:20%]', 'max-h-[20%]'],

      // Arbitrary property to bare value
      ['[grid-column:2]', 'col-2'],
      ['[grid-column:1234]', 'col-1234'],

      // Arbitrary value to bare value
      ['border-[2px]', 'border-2'],
      ['border-[1234px]', 'border-1234'],

      // Arbitrary value with data type, to more specific arbitrary value
      ['bg-[position:123px]', 'bg-position-[123px]'],
      ['bg-[size:123px]', 'bg-size-[123px]'],

      // Arbitrary value with inferred data type, to more specific arbitrary value
      ['bg-[123px]', 'bg-position-[123px]'],

      // Arbitrary value with spacing mul
      ['w-[64rem]', 'w-256'],

      // Complex arbitrary property to arbitrary value
      [
        '[grid-template-columns:repeat(2,minmax(100px,1fr))]',
        'grid-cols-[repeat(2,minmax(100px,1fr))]',
      ],
      // Complex arbitrary property to bare value
      ['[grid-template-columns:repeat(2,minmax(0,1fr))]', 'grid-cols-2'],

      // Arbitrary value to bare value with percentage
      ['from-[25%]', 'from-25%'],

      // Arbitrary percentage value must be a whole number. Should not migrate to
      // a bare value.
      ['from-[2.5%]', 'from-[2.5%]'],
    ])(testName, { timeout }, async (candidate, expected) => {
      let input = css`
        @import 'tailwindcss';

        @theme {
          --*: initial;
          --spacing: 0.25rem;
          --color-red-500: red;

          /* Equivalent of blue-500/50 */
          --color-primary: color-mix(in oklab, oklch(62.3% 0.214 259.815) 50%, transparent);
        }
      `

      await expectCanonicalization(input, candidate, expected)
    })

    test('migrate with custom static utility `@utility custom {…}`', { timeout }, async () => {
      let candidate = '[--key:value]'
      let expected = 'custom'

      let input = css`
        @import 'tailwindcss';
        @theme {
          --*: initial;
        }
        @utility custom {
          --key: value;
        }
      `

      await expectCanonicalization(input, candidate, expected)
    })

    test(
      'migrate with custom functional utility `@utility custom-* {…}`',
      { timeout },
      async () => {
        let candidate = '[--key:value]'
        let expected = 'custom-value'

        let input = css`
          @import 'tailwindcss';
          @theme {
            --*: initial;
          }
          @utility custom-* {
            --key: --value('value');
          }
        `

        await expectCanonicalization(input, candidate, expected)
      },
    )

    test(
      'migrate with custom functional utility `@utility custom-* {…}` that supports bare values',
      { timeout },
      async () => {
        let candidate = '[tab-size:4]'
        let expected = 'tab-4'

        let input = css`
          @import 'tailwindcss';
          @theme {
            --*: initial;
          }
          @utility tab-* {
            tab-size: --value(integer);
          }
        `

        await expectCanonicalization(input, candidate, expected)
      },
    )

    test.each([
      ['[tab-size:0]', 'tab-0'],
      ['[tab-size:4]', 'tab-4'],
      ['[tab-size:8]', 'tab-github'],
      ['tab-[0]', 'tab-0'],
      ['tab-[4]', 'tab-4'],
      ['tab-[8]', 'tab-github'],
    ])(
      'migrate custom @utility from arbitrary values to bare values and named values (based on theme)',
      async (candidate, expected) => {
        let input = css`
          @import 'tailwindcss';
          @theme {
            --*: initial;
            --tab-size-github: 8;
          }

          @utility tab-* {
            tab-size: --value(--tab-size, integer, [integer]);
          }
        `

        await expectCanonicalization(input, candidate, expected)
      },
    )

    describe.each([['@theme'], ['@theme inline']])('%s', (theme) => {
      test.each([
        ['[color:CanvasText]', 'text-canvas'],
        ['text-[CanvasText]', 'text-canvas'],
      ])(`migrate arbitrary value to theme value ${testName}`, async (candidate, expected) => {
        let input = css`
          @import 'tailwindcss';
          ${theme} {
            --*: initial;
            --color-canvas: CanvasText;
          }
        `

        await expectCanonicalization(input, candidate, expected)
      })

      // Some utilities read from specific namespaces, in this case we do not want
      // to migrate to a value in that namespace if we reference a variable that
      // results in the same value, but comes from a different namespace.
      //
      // E.g.: `max-w` reads from: ['--max-width', '--spacing', '--container']
      test.each([
        // `max-w` does not read from `--breakpoint-md`, but `--breakpoint-md`  and
        // `--container-3xl` happen to result in the same value. The difference is
        // the semantics of the value.
        ['max-w-(--breakpoint-md)', 'max-w-(--breakpoint-md)'],
        ['max-w-(--container-3xl)', 'max-w-3xl'],
      ])(
        `migrate arbitrary value to theme value ${testName}`,
        { timeout },
        async (candidate, expected) => {
          let input = css`
            @import 'tailwindcss';
            ${theme} {
              --*: initial;
              --breakpoint-md: 48rem;
              --container-3xl: 48rem;
            }
          `

          await expectCanonicalization(input, candidate, expected)
        },
      )
    })

    test(
      'migrate an arbitrary property without spaces, to a theme value with spaces (canonicalization)',
      { timeout },
      async () => {
        let candidate = 'font-[foo,bar,baz]'
        let expected = 'font-example'
        let input = css`
          @import 'tailwindcss';
          @theme {
            --*: initial;
            --font-example: foo, bar, baz;
          }
        `

        await expectCanonicalization(input, candidate, expected)
      },
    )

    test.each([
      // Default spacing scale
      ['w-[64rem]', 'w-256', '0.25rem'],

      // Non-suggested numbers
      ['gap-[7.25rem]', 'gap-29', '0.25rem'],
      ['gap-[calc(7rem+0.25rem)]', 'gap-29', '0.25rem'],
      ['gap-[116px]', 'gap-29', '0.25rem'],

      // Non-suggested numbers, with the same spacing scale with different
      // units
      ['gap-[7.25rem]', 'gap-29', '4px'],
      ['gap-[calc(7rem+0.25rem)]', 'gap-29', '4px'],
      ['gap-[116px]', 'gap-29', '4px'],

      // Non-suggested numbers, with a different spacing scale
      ['gap-[7.25rem]', 'gap-116', '1px'],
      ['gap-[calc(7rem+0.25rem)]', 'gap-116', '1px'],
      ['gap-[116px]', 'gap-116', '1px'],

      // Keep arbitrary value if units are different
      ['w-[124px]', 'w-31', '0.25rem'],

      // Keep arbitrary value if bare value doesn't fit in steps of .25
      ['w-[0.123rem]', 'w-[0.123rem]', '0.25rem'],

      // Custom pixel based spacing scale
      ['w-[123px]', 'w-123', '1px'],
      ['w-[256px]', 'w-128', '2px'],
    ])(`${testName} (spacing = \`%s\`)`, { timeout }, async (candidate, expected, spacing) => {
      let input = css`
        @import 'tailwindcss';

        @theme {
          --*: initial;
          --spacing: ${spacing};
        }
      `

      await expectCanonicalization(input, candidate, expected)
    })
  })

  describe('bare values', () => {
    let input = css`
      @import 'tailwindcss';
      @theme {
        --*: initial;
        --spacing: 0.25rem;
        --aspect-video: 16 / 9;
        --tab-size-github: 8;
      }

      @utility tab-* {
        tab-size: --value(--tab-size, integer);
      }
    `

    test.each([
      // Built-in utility with bare value fraction
      ['aspect-16/9', 'aspect-video'],

      // Custom utility with bare value integer
      ['tab-8', 'tab-github'],
    ])(testName, { timeout }, async (candidate, expected) => {
      await expectCanonicalization(input, candidate, expected)
    })
  })

  describe('deprecated utilities', () => {
    test('`order-none` → `order-0`', { timeout }, async () => {
      let candidate = 'order-none'
      let expected = 'order-0'

      let input = css`
        @import 'tailwindcss';
      `

      await expectCanonicalization(input, candidate, expected)
    })

    test('`order-none` → `order-none` with custom implementation', { timeout }, async () => {
      let candidate = 'order-none'
      let expected = 'order-none'

      let input = css`
        @import 'tailwindcss';

        @utility order-none {
          order: none; /* imagine this exists */
        }
      `

      await expectCanonicalization(input, candidate, expected)
    })

    test('`break-words` → `wrap-break-word`', { timeout }, async () => {
      let candidate = 'break-words'
      let expected = 'wrap-break-word'

      let input = css`
        @import 'tailwindcss';
      `

      await expectCanonicalization(input, candidate, expected)
    })

    test('`[overflow-wrap:break-word]` → `wrap-break-word`', { timeout }, async () => {
      let candidate = '[overflow-wrap:break-word]'
      let expected = 'wrap-break-word'

      let input = css`
        @import 'tailwindcss';
      `

      await expectCanonicalization(input, candidate, expected)
    })

    test('`break-words` → `break-words` with custom implementation', { timeout }, async () => {
      let candidate = 'break-words'
      let expected = 'break-words'

      let input = css`
        @import 'tailwindcss';

        @utility break-words {
          break: words; /* imagine this exists */
        }
      `

      await expectCanonicalization(input, candidate, expected)
    })
  })

  describe('arbitrary variants', () => {
    let input = css`
      @import 'tailwindcss';
      @theme {
        --*: initial;
      }
    `

    test.each([
      // Arbitrary variant to static variant
      ['[&:focus]:flex', 'focus:flex'],

      // Arbitrary variant to static variant with at-rules
      ['[@media(scripting:_none)]:flex', 'noscript:flex'],

      // Arbitrary variant to static utility at-rules and with slight differences
      // in whitespace. This will require some canonicalization.
      ['[@media(scripting:none)]:flex', 'noscript:flex'],
      ['[@media(scripting:_none)]:flex', 'noscript:flex'],
      ['[@media_(scripting:_none)]:flex', 'noscript:flex'],

      // With compound variants
      ['has-[&:focus]:flex', 'has-focus:flex'],
      ['not-[&:focus]:flex', 'not-focus:flex'],
      ['group-[&:focus]:flex', 'group-focus:flex'],
      ['peer-[&:focus]:flex', 'peer-focus:flex'],
      ['in-[&:focus]:flex', 'in-focus:flex'],
    ])(testName, { timeout }, async (candidate, expected) => {
      await expectCanonicalization(input, candidate, expected)
    })

    test('unsafe migrations keep the candidate as-is', { timeout }, async () => {
      // `hover:` also includes an `@media` query in addition to the `&:hover`
      // state. Migration is not safe because the functionality would be different.
      let candidate = '[&:hover]:flex'
      let expected = '[&:hover]:flex'
      let input = css`
        @import 'tailwindcss';
        @theme {
          --*: initial;
        }
      `

      await expectCanonicalization(input, candidate, expected)
    })

    test('make unsafe migration safe (1)', { timeout }, async () => {
      // Overriding the `hover:` variant to only use a selector will make the
      // migration safe.
      let candidate = '[&:hover]:flex'
      let expected = 'hover:flex'
      let input = css`
        @import 'tailwindcss';
        @theme {
          --*: initial;
        }
        @variant hover (&:hover);
      `

      await expectCanonicalization(input, candidate, expected)
    })

    test('make unsafe migration safe (2)', { timeout }, async () => {
      // Overriding the `hover:` variant to only use a selector will make the
      // migration safe. This time with the long-hand `@variant` syntax.
      let candidate = '[&:hover]:flex'
      let expected = 'hover:flex'
      let input = css`
        @import 'tailwindcss';
        @theme {
          --*: initial;
        }
        @variant hover {
          &:hover {
            @slot;
          }
        }
      `

      await expectCanonicalization(input, candidate, expected)
    })

    test('custom selector-based variants', { timeout }, async () => {
      let candidate = '[&.macos]:flex'
      let expected = 'is-macos:flex'
      let input = css`
        @import 'tailwindcss';
        @theme {
          --*: initial;
        }
        @variant is-macos (&.macos);
      `

      await expectCanonicalization(input, candidate, expected)
    })

    test('custom @media-based variants', { timeout }, async () => {
      let candidate = '[@media(prefers-reduced-transparency:reduce)]:flex'
      let expected = 'transparency-safe:flex'
      let input = css`
        @import 'tailwindcss';
        @theme {
          --*: initial;
        }
        @variant transparency-safe {
          @media (prefers-reduced-transparency: reduce) {
            @slot;
          }
        }
      `

      await expectCanonicalization(input, candidate, expected)
    })
  })

  describe('drop unnecessary data types', () => {
    let input = css`
      @import 'tailwindcss';
      @theme {
        --*: initial;
        --color-red-500: red;
      }
    `

    test.each([
      // A color value can be inferred from the value
      ['bg-[color:#008cc]', 'bg-[#008cc]'],

      // A color is the default for `bg-*`
      ['bg-(color:--my-value)', 'bg-(--my-value)'],

      // A color with a known theme variable migrates to the full utility
      ['bg-(color:--color-red-500)', 'bg-red-500'],
    ])(testName, { timeout }, async (candidate, expected) => {
      await expectCanonicalization(input, candidate, expected)
    })
  })

  describe('arbitrary value to bare value', () => {
    test.each([
      ['aspect-[12/34]', 'aspect-12/34'],
      ['aspect-[1.2/34]', 'aspect-[1.2/34]'],
      ['col-start-[7]', 'col-start-7'],
      ['flex-[2]', 'flex-2'], // `flex` is implemented as static and functional utilities

      ['grid-cols-[subgrid]', 'grid-cols-subgrid'],
      ['grid-rows-[subgrid]', 'grid-rows-subgrid'],

      // Handle zeroes
      ['m-[0]', 'm-0'],
      ['m-[0px]', 'm-0'],
      ['m-[0rem]', 'm-0'],

      ['-m-[0]', 'm-0'],
      ['-m-[0px]', 'm-0'],
      ['-m-[0rem]', 'm-0'],

      ['m-[-0]', 'm-0'],
      ['m-[-0px]', 'm-0'],
      ['m-[-0rem]', 'm-0'],

      ['-m-[-0]', 'm-0'],
      ['-m-[-0px]', 'm-0'],
      ['-m-[-0rem]', 'm-0'],

      ['[margin:0]', 'm-0'],
      ['[margin:-0]', 'm-0'],
      ['[margin:0px]', 'm-0'],

      // Not a length-unit, can't safely constant fold
      ['[margin:0%]', 'm-[0%]'],

      // Only 50-200% (inclusive) are valid:
      // https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch#percentage
      ['font-stretch-[50%]', 'font-stretch-50%'],
      ['font-stretch-[50.5%]', 'font-stretch-[50.5%]'],
      ['font-stretch-[201%]', 'font-stretch-[201%]'],
      ['font-stretch-[49%]', 'font-stretch-[49%]'],
      // Should stay as-is
      ['font-stretch-[1/2]', 'font-stretch-[1/2]'],

      // Bare value with % is valid for these utilities
      ['from-[28%]', 'from-28%'],
      ['via-[28%]', 'via-28%'],
      ['to-[28%]', 'to-28%'],
      ['from-[28.5%]', 'from-[28.5%]'],
      ['via-[28.5%]', 'via-[28.5%]'],
      ['to-[28.5%]', 'to-[28.5%]'],

      // This test in itself is a bit flawed because `text-[1/2]` currently
      // generates something. Converting it to `text-1/2` doesn't produce anything.
      ['text-[1/2]', 'text-[1/2]'],

      // Leading is special, because `leading-[123]` is the direct value of 123, but
      // `leading-123` maps to `calc(--spacing(123))`.
      ['leading-[123]', 'leading-[123]'],

      ['data-[selected]:flex', 'data-selected:flex'],
      ['data-[foo=bar]:flex', 'data-[foo=bar]:flex'],

      ['supports-[gap]:flex', 'supports-gap:flex'],
      ['supports-[display:grid]:flex', 'supports-[display:grid]:flex'],

      ['group-data-[selected]:flex', 'group-data-selected:flex'],
      ['group-data-[foo=bar]:flex', 'group-data-[foo=bar]:flex'],
      ['group-has-data-[selected]:flex', 'group-has-data-selected:flex'],

      ['aria-[selected]:flex', 'aria-[selected]:flex'],
      ['aria-[selected="true"]:flex', 'aria-selected:flex'],
      ['aria-[selected*="true"]:flex', 'aria-[selected*="true"]:flex'],

      ['group-aria-[selected]:flex', 'group-aria-[selected]:flex'],
      ['group-aria-[selected="true"]:flex', 'group-aria-selected:flex'],
      ['group-has-aria-[selected]:flex', 'group-has-aria-[selected]:flex'],

      ['max-lg:hover:data-[selected]:flex', 'max-lg:hover:data-selected:flex'],
      [
        'data-[selected]:aria-[selected="true"]:aspect-[12/34]',
        'data-selected:aria-selected:aspect-12/34',
      ],
    ])(testName, { timeout }, async (candidate, expected) => {
      let input = css`
        @import 'tailwindcss';
      `
      await expectCanonicalization(input, candidate, expected)
    })
  })

  describe('modernize arbitrary variants', () => {
    test.each([
      // Arbitrary variants
      ['[[data-visible]]:flex', 'data-visible:flex'],
      ['[&[data-visible]]:flex', 'data-visible:flex'],
      ['[[data-visible]&]:flex', 'data-visible:flex'],
      ['[&>[data-visible]]:flex', '*:data-visible:flex'],
      ['[&_>_[data-visible]]:flex', '*:data-visible:flex'],
      ['[&>*]:flex', '*:flex'],
      ['[&_>_*]:flex', '*:flex'],
      ['[&_>_[foo]]:flex', '*:[[foo]]:flex'],
      ['[&_[foo]]:flex', '**:[[foo]]:flex'],
      ['[&_>_[foo=bar]]:flex', '*:[[foo=bar]]:flex'],
      ['[&_[foo=bar]]:flex', '**:[[foo=bar]]:flex'],

      ['[&_[data-visible]]:flex', '**:data-visible:flex'],
      ['[&_*]:flex', '**:flex'],

      ['[&:first-child]:flex', 'first:flex'],
      ['[&:not(:first-child)]:flex', 'not-first:flex'],

      ['[&_:first-child]:flex', '**:first:flex'],
      ['[&_>_:first-child]:flex', '*:first:flex'],
      ['[&_:--custom]:flex', '**:[:--custom]:flex'],
      ['[&_>_:--custom]:flex', '*:[:--custom]:flex'],

      // in-* variants
      ['[p_&]:flex', 'in-[p]:flex'],
      ['[.foo_&]:flex', 'in-[.foo]:flex'],
      ['[[data-visible]_&]:flex', 'in-data-visible:flex'],
      // Multiple selectors, should stay as-is
      ['[[data-foo][data-bar]_&]:flex', '[[data-foo][data-bar]_&]:flex'],
      // Using `>` instead of ` ` should not be transformed:
      ['[figure>&]:my-0', '[figure>&]:my-0'],

      // nth-child
      ['[&:nth-child(2)]:flex', 'nth-2:flex'],
      ['[&:not(:nth-child(2))]:flex', 'not-nth-2:flex'],

      ['[&:nth-child(-n+3)]:flex', 'nth-[-n+3]:flex'],
      ['[&:not(:nth-child(-n+3))]:flex', 'not-nth-[-n+3]:flex'],
      ['[&:nth-child(-n_+_3)]:flex', 'nth-[-n+3]:flex'],
      ['[&:not(:nth-child(-n_+_3))]:flex', 'not-nth-[-n+3]:flex'],

      // nth-last-child
      ['[&:nth-last-child(2)]:flex', 'nth-last-2:flex'],
      ['[&:not(:nth-last-child(2))]:flex', 'not-nth-last-2:flex'],

      ['[&:nth-last-child(-n+3)]:flex', 'nth-last-[-n+3]:flex'],
      ['[&:not(:nth-last-child(-n+3))]:flex', 'not-nth-last-[-n+3]:flex'],
      ['[&:nth-last-child(-n_+_3)]:flex', 'nth-last-[-n+3]:flex'],
      ['[&:not(:nth-last-child(-n_+_3))]:flex', 'not-nth-last-[-n+3]:flex'],

      // nth-child odd/even
      ['[&:nth-child(odd)]:flex', 'odd:flex'],
      ['[&:not(:nth-child(odd))]:flex', 'even:flex'],
      ['[&:nth-child(even)]:flex', 'even:flex'],
      ['[&:not(:nth-child(even))]:flex', 'odd:flex'],

      // Keep multiple attribute selectors as-is
      ['[[data-visible][data-dark]]:flex', '[[data-visible][data-dark]]:flex'],

      // Keep `:where(…)` as is
      ['[:where([data-visible])]:flex', '[:where([data-visible])]:flex'],

      // Complex attribute selectors with operators, quotes and insensitivity flags
      ['[[data-url*="example"]]:flex', 'data-[url*="example"]:flex'],
      ['[[data-url$=".com"_i]]:flex', 'data-[url$=".com"_i]:flex'],
      ['[[data-url$=.com_i]]:flex', 'data-[url$=.com_i]:flex'],

      // Attribute selector wrapped in `&:is(…)`
      ['[&:is([data-visible])]:flex', 'data-visible:flex'],

      // Media queries
      ['[@media(pointer:fine)]:flex', 'pointer-fine:flex'],
      ['[@media_(pointer_:_fine)]:flex', 'pointer-fine:flex'],
      ['[@media_not_(pointer_:_fine)]:flex', 'not-pointer-fine:flex'],
      ['[@media_print]:flex', 'print:flex'],
      ['[@media_not_print]:flex', 'not-print:flex'],

      // Hoist the `:not` part to a compound variant
      ['[@media_not_(prefers-color-scheme:dark)]:flex', 'not-dark:flex'],
      [
        '[@media_not_(prefers-color-scheme:unknown)]:flex',
        'not-[@media_(prefers-color-scheme:unknown)]:flex',
      ],

      // Compound arbitrary variants
      ['has-[[data-visible]]:flex', 'has-data-visible:flex'],
      ['has-[&:is([data-visible])]:flex', 'has-data-visible:flex'],
      ['has-[&>[data-visible]]:flex', 'has-[&>[data-visible]]:flex'],

      ['has-[[data-slot=description]]:flex', 'has-data-[slot=description]:flex'],
      ['has-[&:is([data-slot=description])]:flex', 'has-data-[slot=description]:flex'],

      ['has-[[aria-visible="true"]]:flex', 'has-aria-visible:flex'],
      ['has-[[aria-visible]]:flex', 'has-aria-[visible]:flex'],

      ['has-[&:not(:nth-child(even))]:flex', 'has-odd:flex'],
    ])(testName, { timeout }, async (candidate, expected) => {
      let input = css`
        @import 'tailwindcss';
      `
      await expectCanonicalization(input, candidate, expected)
    })
  })

  describe('optimize modifier', () => {
    let input = css`
      @import 'tailwindcss';
      @theme {
        --*: initial;
        --color-red-500: red;
      }
    `

    test.each([
      // Keep the modifier as-is, nothing to optimize
      ['bg-red-500/25', 'bg-red-500/25'],

      // Use a bare value modifier
      ['bg-red-500/[25%]', 'bg-red-500/25'],

      // Convert 0-1 values to bare values
      ['bg-[#f00]/[0.16]', 'bg-[#f00]/16'],

      // Drop unnecessary modifiers
      ['bg-red-500/[100%]', 'bg-red-500'],
      ['bg-red-500/100', 'bg-red-500'],

      // Keep modifiers on classes that don't _really_ exist
      ['group/name', 'group/name'],
    ])(testName, { timeout }, async (candidate, expected) => {
      await expectCanonicalization(input, candidate, expected)
    })
  })

  test.each([
    // 4 to 1
    ['mt-1 mr-1 mb-1 ml-1', 'm-1'],

    // 2 to 1
    ['mt-1 mb-1', 'my-1'],

    // Different order as above
    ['mb-1 mt-1', 'my-1'],

    // To completely different utility
    ['w-4 h-4', 'size-4'],

    // Do not touch if not operating on the same variants
    ['hover:w-4 h-4', 'hover:w-4 h-4'],

    // Arbitrary properties to combined class
    ['[width:_16px_] [height:16px]', 'size-4'],

    // Arbitrary properties to combined class with modifier
    ['[font-size:14px] [line-height:1.625]', 'text-sm/relaxed'],
  ])(
    'should canonicalize multiple classes `%s` into a shorthand `%s`',
    { timeout },
    async (candidates, expected) => {
      let input = css`
        @import 'tailwindcss';
      `
      await expectCombinedCanonicalization(input, candidates, expected)
    },
  )
})

describe('theme to var', () => {
  test('extended space scale converts to var or calc', { timeout }, async () => {
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

  test('custom space scale converts to var', { timeout }, async () => {
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

describe('options', () => {
  test('normalize `rem` units to `px`', { timeout }, async () => {
    let designSystem = await __unstable__loadDesignSystem(
      css`
        @tailwind utilities;
        @theme {
          --spacing: 0.25rem;
        }
      `,
      { base: __dirname },
    )

    expect(designSystem.canonicalizeCandidates(['m-[16px]'])).toEqual(['m-[16px]'])
    expect(designSystem.canonicalizeCandidates(['m-[16px]'], { rem: 16 })).toEqual(['m-4'])
    expect(designSystem.canonicalizeCandidates(['m-[16px]'], { rem: 64 })).toEqual(['m-1'])
    expect(designSystem.canonicalizeCandidates(['m-[16px]'])).toEqual(['m-[16px]']) // Ensure options don't influence shared state
  })
})
