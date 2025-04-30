import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test } from 'vitest'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { migrateArbitraryVariants } from './migrate-arbitrary-variants'

const css = String.raw
const designSystems = new DefaultMap((base: string) => {
  return new DefaultMap((input: string) => {
    return __unstable__loadDesignSystem(input, { base })
  })
})

describe.each([['default'], ['important'], ['prefix']].slice(0, 1))('%s', (strategy) => {
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
  ])(testName, async (candidate, result) => {
    if (strategy === 'important') {
      candidate = `${candidate}!`
      result = `${result}!`
    } else if (strategy === 'prefix') {
      // Not only do we need to prefix the candidate, we also have to make
      // sure that we prefix all CSS variables.
      candidate = `tw:${candidate.replaceAll('var(--', 'var(--tw-')}`
      result = `tw:${result.replaceAll('var(--', 'var(--tw-')}`
    }

    let designSystem = await designSystems.get(__dirname).get(input)
    let migrated = migrateArbitraryVariants(designSystem, {}, candidate)
    expect(migrated).toEqual(result)
  })
})

test('unsafe migrations keep the candidate as-is', async () => {
  // `hover:` also includes an `@media` query in addition to the `&:hover`
  // state. Migration is not safe because the functionality would be different.
  let candidate = '[&:hover]:flex'
  let result = '[&:hover]:flex'
  let input = css`
    @import 'tailwindcss';
    @theme {
      --*: initial;
    }
  `

  let designSystem = await designSystems.get(__dirname).get(input)
  let migrated = migrateArbitraryVariants(designSystem, {}, candidate)
  expect(migrated).toEqual(result)
})

test('make unsafe migration safe (1)', async () => {
  // Overriding the `hover:` variant to only use a selector will make the
  // migration safe.
  let candidate = '[&:hover]:flex'
  let result = 'hover:flex'
  let input = css`
    @import 'tailwindcss';
    @theme {
      --*: initial;
    }
    @variant hover (&:hover);
  `

  let designSystem = await designSystems.get(__dirname).get(input)
  let migrated = migrateArbitraryVariants(designSystem, {}, candidate)
  expect(migrated).toEqual(result)
})

test('make unsafe migration safe (2)', async () => {
  // Overriding the `hover:` variant to only use a selector will make the
  // migration safe. This time with the long-hand `@variant` syntax.
  let candidate = '[&:hover]:flex'
  let result = 'hover:flex'
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

  let designSystem = await designSystems.get(__dirname).get(input)
  let migrated = migrateArbitraryVariants(designSystem, {}, candidate)
  expect(migrated).toEqual(result)
})

test('custom selector-based variants', async () => {
  let candidate = '[&.macos]:flex'
  let result = 'is-macos:flex'
  let input = css`
    @import 'tailwindcss';
    @theme {
      --*: initial;
    }
    @variant is-macos (&.macos);
  `

  let designSystem = await designSystems.get(__dirname).get(input)
  let migrated = migrateArbitraryVariants(designSystem, {}, candidate)
  expect(migrated).toEqual(result)
})

test('custom @media-based variants', async () => {
  let candidate = '[@media(prefers-reduced-transparency:reduce)]:flex'
  let result = 'transparency-safe:flex'
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

  let designSystem = await designSystems.get(__dirname).get(input)
  let migrated = migrateArbitraryVariants(designSystem, {}, candidate)
  expect(migrated).toEqual(result)
})
