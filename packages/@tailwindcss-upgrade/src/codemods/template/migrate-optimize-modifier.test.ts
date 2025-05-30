import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test } from 'vitest'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { migrateOptimizeModifier } from './migrate-optimize-modifier'

const css = String.raw

const designSystems = new DefaultMap((base: string) => {
  return new DefaultMap((input: string) => {
    return __unstable__loadDesignSystem(input, { base })
  })
})

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
  ])(testName, async (candidate, expected) => {
    if (strategy === 'with-variant') {
      candidate = `focus:${candidate}`
      expected = `focus:${expected}`
    } else if (strategy === 'important') {
      candidate = `${candidate}!`
      expected = `${expected}!`
    } else if (strategy === 'prefix') {
      // Not only do we need to prefix the candidate, we also have to make
      // sure that we prefix all CSS variables.
      candidate = `tw:${candidate.replaceAll('var(--', 'var(--tw-')}`
      expected = `tw:${expected.replaceAll('var(--', 'var(--tw-')}`
    }

    let designSystem = await designSystems.get(__dirname).get(input)

    let migrated = migrateOptimizeModifier(designSystem, {}, candidate)
    expect(migrated).toEqual(expected)
  })
})
