import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { themeToVar } from './theme-to-var'

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
  ['bg-[theme(colors.red.500,red)]', 'bg-[var(--color-red-500,_red)]'],

  // Keep `theme(…)` if we can't resolve the path
  ['bg-[theme(colors.foo.1000)]', 'bg-[theme(colors.foo.1000)]'],

  // Keep `theme(…)` if we can't resolve the path, but still try to convert the
  // fallback value.
  [
    'bg-[theme(colors.foo.1000,theme(colors.red.500))]',
    'bg-[theme(colors.foo.1000,var(--color-red-500))]',
  ],

  // Use `theme(…)` (deeply nested) inside of a `calc(…)` function
  ['text-[calc(theme(fontSize.xs)*2)]', 'text-[calc(var(--font-size-xs)_*_2)]'],

  // Multiple `theme(… / …)` calls should result in modern syntax of `theme(…)`
  // - Can't convert to `var(…)` because that would lose the modifier.
  // - Can't convert to a candidate modifier because there are multiple
  //   `theme(…)` calls.
  //
  //   If we really want to, we can make a fancy migration that tries to move it
  //   to a candidate modifier _if_ all `theme(…)` calls use the same modifier.
  [
    '[color:theme(colors.red.500/50,theme(colors.blue.500/50))]',
    '[color:theme(--color-red-500/50,_theme(--color-blue-500/50))]',
  ],
  [
    '[color:theme(colors.red.500/50,theme(colors.blue.500/50))]/50',
    '[color:theme(--color-red-500/50,_theme(--color-blue-500/50))]/50',
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

  // `theme(…)` calls valid in v3, but not in v4 should still be converted.
  ['[--foo:theme(fontWeight.semibold)]', '[--foo:theme(fontWeight.semibold)]'],

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
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(themeToVar(designSystem, {}, candidate)).toEqual(result)
})
