import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { themeToVar } from './theme-to-var'

let css = String.raw

test.each([
  // Keep candidates that don't contain `theme(…)` or `theme(…, …)`
  ['[color:red]', '[color:red]'],

  // Handle special cases around `.1` in the `theme(…)`
  ['[--value:theme(spacing.1)]', '[--value:var(--spacing-1)]'],
  ['[--value:theme(fontSize.xs.1.lineHeight)]', '[--value:var(--font-size-xs--line-height)]'],

  // Convert to `var(…)` if we can resolve the path
  ['[color:theme(colors.red.500)]', '[color:var(--color-red-500)]'], // Arbitrary property
  ['[color:theme(colors.red.500)]/50', '[color:var(--color-red-500)]/50'], // Arbitrary property + modifier
  ['bg-[theme(colors.red.500)]', 'bg-[var(--color-red-500)]'], // Arbitrary value
  ['bg-[size:theme(spacing.4)]', 'bg-[size:var(--spacing-4)]'], // Arbitrary value + data type hint

  // Convert to `var(…)` if we can resolve the path, but keep fallback values
  ['bg-[theme(colors.red.500,red)]', 'bg-[var(--color-red-500,red)]'],

  // Keep `theme(…)` if we can't resolve the path
  ['bg-[theme(colors.foo.1000)]', 'bg-[theme(colors.foo.1000)]'],

  // Keep `theme(…)` if we can't resolve the path, but still try to convert the
  // fallback value.
  [
    'bg-[theme(colors.foo.1000,theme(colors.red.500))]',
    'bg-[theme(colors.foo.1000,var(--color-red-500))]',
  ],

  // Use `theme(…)` (deeply nested) inside of a `calc(…)` function
  ['text-[calc(theme(fontSize.xs)*2)]', 'text-[calc(var(--font-size-xs)*2)]'],

  // Multiple `theme(… / …)` calls should result in modern syntax of `theme(…)`
  // - Can't convert to `var(…)` because that would lose the modifier.
  // - Can't convert to a candidate modifier because there are multiple
  //   `theme(…)` calls.
  //
  //   If we really want to, we can make a fancy migration that tries to move it
  //   to a candidate modifier _if_ all `theme(…)` calls use the same modifier.
  [
    '[color:theme(colors.red.500/50,theme(colors.blue.500/50))]',
    '[color:theme(--color-red-500/50,theme(--color-blue-500/50))]',
  ],
  [
    '[color:theme(colors.red.500/50,theme(colors.blue.500/50))]/50',
    '[color:theme(--color-red-500/50,theme(--color-blue-500/50))]/50',
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
  ['[color:theme(colors.red.500/var(--opacity))]', '[color:var(--color-red-500)]/[var(--opacity)]'],
  ['[color:theme(colors.red.500/.12345)]', '[color:var(--color-red-500)]/[12.345]'],
  ['[color:theme(colors.red.500/50.25%)]', '[color:var(--color-red-500)]/[50.25%]'],

  // Arbitrary value
  ['bg-[theme(colors.red.500/75%)]', 'bg-[var(--color-red-500)]/75'],
  ['bg-[theme(colors.red.500/12.34%)]', 'bg-[var(--color-red-500)]/[12.34%]'],

  // Arbitrary property that already contains a modifier
  ['[color:theme(colors.red.500/50%)]/50', '[color:theme(--color-red-500/50%)]/50'],

  // Arbitrary value, where the candidate already contains a modifier
  // This should still migrate the `theme(…)` syntax to the modern syntax.
  ['bg-[theme(colors.red.500/50%)]/50', 'bg-[theme(--color-red-500/50%)]/50'],

  // Variants, we can't use `var(…)` especially inside of `@media(…)`. We can
  // still upgrade the `theme(…)` to the modern syntax.
  ['max-[theme(spacing.4)]:flex', 'max-[theme(--spacing-4)]:flex'],

  // This test in itself doesn't make much sense. But we need to make sure
  // that this doesn't end up as the modifier in the candidate itself.
  ['max-[theme(spacing.4/50)]:flex', 'max-[theme(--spacing-4/50)]:flex'],

  // `theme(…)` calls in another CSS function is replaced correctly.
  // Additionally we remove unnecessary whitespace.
  ['grid-cols-[min(50%_,_theme(spacing.80))_auto]', 'grid-cols-[min(50%,var(--spacing-80))_auto]'],

  // `theme(…)` calls valid in v3, but not in v4 should still be converted.
  ['[--foo:theme(fontWeight.semibold)]', '[--foo:theme(fontWeight.semibold)]'],

  // `screens` values
  ['max-w-[theme(screens.md)]', 'max-w-[var(--breakpoint-md)]'],

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
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';
      @theme {
        --spacing-px: 1px;
        --spacing-0: 0px;
        --spacing-0_5: 0.125rem;
        --spacing-1: 0.25rem;
        --spacing-1_5: 0.375rem;
        --spacing-2: 0.5rem;
        --spacing-2_5: 0.625rem;
        --spacing-3: 0.75rem;
        --spacing-3_5: 0.875rem;
        --spacing-4: 1rem;
        --spacing-5: 1.25rem;
        --spacing-6: 1.5rem;
        --spacing-7: 1.75rem;
        --spacing-8: 2rem;
        --spacing-9: 2.25rem;
        --spacing-10: 2.5rem;
        --spacing-11: 2.75rem;
        --spacing-12: 3rem;
        --spacing-14: 3.5rem;
        --spacing-16: 4rem;
        --spacing-20: 5rem;
        --spacing-24: 6rem;
        --spacing-28: 7rem;
        --spacing-32: 8rem;
        --spacing-36: 9rem;
        --spacing-40: 10rem;
        --spacing-44: 11rem;
        --spacing-48: 12rem;
        --spacing-52: 13rem;
        --spacing-56: 14rem;
        --spacing-60: 15rem;
        --spacing-64: 16rem;
        --spacing-72: 18rem;
        --spacing-80: 20rem;
        --spacing-96: 24rem;
      }
    `,
    {
      base: __dirname,
    },
  )

  expect(themeToVar(designSystem, {}, candidate)).toEqual(result)
})
