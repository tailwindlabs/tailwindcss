import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test, vi } from 'vitest'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import * as versions from '../../utils/version'
import { migrateCandidate as migrate } from './migrate'
vi.spyOn(versions, 'isMajor').mockReturnValue(false)

const designSystems = new DefaultMap((base: string) => {
  return new DefaultMap((input: string) => {
    return __unstable__loadDesignSystem(input, { base })
  })
})

const css = String.raw

describe.each([['default'], ['with-variant'], ['important'], ['prefix']])('%s', (strategy) => {
  let testName = '%s => %s (%#)'
  if (strategy === 'with-variant') {
    testName = testName.replaceAll('%s', 'focus:%s')
  } else if (strategy === 'important') {
    testName = testName.replaceAll('%s', '%s!')
  } else if (strategy === 'prefix') {
    testName = testName.replaceAll('%s', 'tw:%s')
  }

  // Basic input with minimal design system to keep the tests fast
  let input = css`
    @import 'tailwindcss' ${strategy === 'prefix' ? 'prefix(tw)' : ''};
    @theme {
      --*: initial;
      --spacing: 0.25rem;
      --color-red-500: red;

      /* Equivalent of blue-500/50 */
      --color-primary: color-mix(in oklab, oklch(62.3% 0.214 259.815) 50%, transparent);
    }
  `

  test.each([
    // Arbitrary property to named functional utility
    ['[color:red]', 'text-red-500'],

    // Promote data types to more specific utility if it exists
    ['bg-(position:--my-value)', 'bg-position-(--my-value)'],

    // Promote inferred data type to more specific utility if it exists
    ['bg-[123px]', 'bg-position-[123px]'],

    // Do not migrate bare values or arbitrary values to named values that are
    // deprecated
    ['order-[0]', 'order-0'],
    ['order-0', 'order-0'],

    // Migrate deprecated named values to bare values
    ['order-none', 'order-0'],

    // `-0` should not be migrated to `0`.
    //
    // This used to be a bug that translate `mt-[0px]` into `-mt-[0px]` because
    // `-mt-[0px]` translates to `margin-top: calc(0px * -1);` and therefore we
    // handle the `0px * -1` case which translates to `0px` not `-0px`.
    //
    // This translation is actually fine, because now, we will prefer the
    // non-negative version first so we can replace `-mt-[0px]` with `mt-[0px]`.
    ['mt-[0px]', 'mt-[0px]'],
    ['-mt-[0px]', 'mt-[0px]'],

    // Shorthand CSS Variables should be converted to the new syntax, even if
    // the fallback contains functions. The fallback should also be migrated to
    // the newest syntax.
    ['bg-[--my-color,theme(colors.red.500)]', 'bg-(--my-color,var(--color-red-500))'],

    // Both the positive and negative versions of arbitrary utilities should be
    // converted to the bare value version.
    ['mb-[32rem]', 'mb-128'],
    ['mb-[-32rem]', '-mb-128'],
  ])(testName, async (candidate, result) => {
    if (strategy === 'with-variant') {
      candidate = `focus:${candidate}`
      result = `focus:${result}`
    } else if (strategy === 'important') {
      candidate = `${candidate}!`
      result = `${result}!`
    } else if (strategy === 'prefix') {
      // Not only do we need to prefix the candidate, we also have to make
      // sure that we prefix all CSS variables.
      candidate = `tw:${candidate.replaceAll('var(--', 'var(--tw-')}`
      result = `tw:${result.replaceAll('var(--', 'var(--tw-')}`
    }

    let designSystem = await designSystems.get(__dirname).get(input)
    let migrated = await migrate(designSystem, {}, candidate)
    expect(migrated).toEqual(result)
  })

  test.each([
    ['order-[0]', 'order-0'],
    ['order-0', 'order-0'],

    // Do not migrate `order-none` if defined as a custom utility as it is then
    // not safe to migrate to `order-0`
    ['order-none', 'order-none'],
  ])(`${testName} with custom implementations`, async (candidate, result) => {
    if (strategy === 'with-variant') {
      candidate = `focus:${candidate}`
      result = `focus:${result}`
    } else if (strategy === 'important') {
      candidate = `${candidate}!`
      result = `${result}!`
    } else if (strategy === 'prefix') {
      // Not only do we need to prefix the candidate, we also have to make
      // sure that we prefix all CSS variables.
      candidate = `tw:${candidate.replaceAll('var(--', 'var(--tw-')}`
      result = `tw:${result.replaceAll('var(--', 'var(--tw-')}`
    }

    let localInput = css`
      ${input}

      @utility order-none {
        order: none; /* imagine this exists */
      }
    `

    let designSystem = await designSystems.get(__dirname).get(localInput)
    let migrated = await migrate(designSystem, {}, candidate)
    expect(migrated).toEqual(result)
  })
})
