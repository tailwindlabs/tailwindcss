import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test } from 'vitest'
import type { UserConfig } from '../../../../tailwindcss/src/compat/config/types'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { migrateBareValueUtilities } from './migrate-bare-utilities'

const css = String.raw

const designSystems = new DefaultMap((base: string) => {
  return new DefaultMap((input: string) => {
    return __unstable__loadDesignSystem(input, { base })
  })
})

function migrate(designSystem: DesignSystem, userConfig: UserConfig | null, rawCandidate: string) {
  for (let migration of [migrateBareValueUtilities]) {
    rawCandidate = migration(designSystem, userConfig, rawCandidate)
  }
  return rawCandidate
}

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
    let migrated = migrate(designSystem, {}, candidate)
    expect(migrated).toEqual(result)
  })
})
