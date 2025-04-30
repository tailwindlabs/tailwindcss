import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test } from 'vitest'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { migrateDropUnnecessaryDataTypes } from './migrate-drop-unnecessary-data-types'

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
    }
  `

  test.each([
    // A color value can be inferred from the value
    ['bg-[color:#008cc]', 'bg-[#008cc]'],

    // A position can be inferred from the value
    ['bg-[position:123px]', 'bg-[123px]'],

    // A color is the default for `bg-*`
    ['bg-(color:--my-value)', 'bg-(--my-value)'],

    // A position is not the default, so the `position` data type is kept
    ['bg-(position:--my-value)', 'bg-(position:--my-value)'],
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

    let migrated = migrateDropUnnecessaryDataTypes(designSystem, {}, candidate)
    expect(migrated).toEqual(expected)
  })
})
