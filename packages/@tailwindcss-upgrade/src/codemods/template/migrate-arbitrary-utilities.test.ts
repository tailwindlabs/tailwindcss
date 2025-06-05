import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test } from 'vitest'
import type { UserConfig } from '../../../../tailwindcss/src/compat/config/types'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { migrateArbitraryUtilities } from './migrate-arbitrary-utilities'
import { migrateArbitraryValueToBareValue } from './migrate-arbitrary-value-to-bare-value'
import { migrateDropUnnecessaryDataTypes } from './migrate-drop-unnecessary-data-types'
import { migrateOptimizeModifier } from './migrate-optimize-modifier'

const designSystems = new DefaultMap((base: string) => {
  return new DefaultMap((input: string) => {
    return __unstable__loadDesignSystem(input, { base })
  })
})

function migrate(designSystem: DesignSystem, userConfig: UserConfig | null, rawCandidate: string) {
  for (let migration of [
    migrateArbitraryUtilities,
    migrateDropUnnecessaryDataTypes,
    migrateArbitraryValueToBareValue,
    migrateOptimizeModifier,
  ]) {
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
      --color-red-500: red;

      /* Equivalent of blue-500/50 */
      --color-primary: color-mix(in oklab, oklch(62.3% 0.214 259.815) 50%, transparent);
    }
  `

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
    // No need for `/50` because that's already encoded in the `--color-primary`
    // value
    ['[color:oklch(62.3%_0.214_259.815)]/50', 'text-primary'],

    // Arbitrary property to arbitrary value
    ['[max-height:20px]', 'max-h-[20px]'],

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

const css = String.raw
test('migrate with custom static utility `@utility custom {…}`', async () => {
  let candidate = '[--key:value]'
  let result = 'custom'

  let input = css`
    @import 'tailwindcss';
    @theme {
      --*: initial;
    }
    @utility custom {
      --key: value;
    }
  `
  let designSystem = await __unstable__loadDesignSystem(input, {
    base: __dirname,
  })

  let migrated = migrate(designSystem, {}, candidate)
  expect(migrated).toEqual(result)
})

test('migrate with custom functional utility `@utility custom-* {…}`', async () => {
  let candidate = '[--key:value]'
  let result = 'custom-value'

  let input = css`
    @import 'tailwindcss';
    @theme {
      --*: initial;
    }
    @utility custom-* {
      --key: --value('value');
    }
  `
  let designSystem = await __unstable__loadDesignSystem(input, {
    base: __dirname,
  })

  let migrated = migrate(designSystem, {}, candidate)
  expect(migrated).toEqual(result)
})

test('migrate with custom functional utility `@utility custom-* {…}` that supports bare values', async () => {
  let candidate = '[tab-size:4]'
  let result = 'tab-4'

  let input = css`
    @import 'tailwindcss';
    @theme {
      --*: initial;
    }
    @utility tab-* {
      tab-size: --value(integer);
    }
  `
  let designSystem = await __unstable__loadDesignSystem(input, {
    base: __dirname,
  })

  let migrated = migrate(designSystem, {}, candidate)
  expect(migrated).toEqual(result)
})

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
    let designSystem = await __unstable__loadDesignSystem(input, {
      base: __dirname,
    })

    let migrated = migrate(designSystem, {}, candidate)
    expect(migrated).toEqual(expected)
  },
)

describe.each([['@theme'], ['@theme inline']])('%s', (theme) => {
  test.each([
    ['[color:CanvasText]', 'text-canvas'],
    ['text-[CanvasText]', 'text-canvas'],
  ])('migrate arbitrary value to theme value %s => %s', async (candidate, result) => {
    let input = css`
      @import 'tailwindcss';
      ${theme} {
        --*: initial;
        --color-canvas: CanvasText;
      }
    `
    let designSystem = await __unstable__loadDesignSystem(input, {
      base: __dirname,
    })

    let migrated = migrate(designSystem, {}, candidate)
    expect(migrated).toEqual(result)
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
  ])('migrate arbitrary value to theme value %s => %s', async (candidate, result) => {
    let input = css`
      @import 'tailwindcss';
      ${theme} {
        --*: initial;
        --breakpoint-md: 48rem;
        --container-3xl: 48rem;
      }
    `
    let designSystem = await __unstable__loadDesignSystem(input, {
      base: __dirname,
    })

    let migrated = migrate(designSystem, {}, candidate)
    expect(migrated).toEqual(result)
  })
})

test('migrate an arbitrary property without spaces, to a theme value with spaces (canonicalization)', async () => {
  let candidate = 'font-[foo,bar,baz]'
  let expected = 'font-example'
  let input = css`
    @import 'tailwindcss';
    @theme {
      --*: initial;
      --font-example: foo, bar, baz;
    }
  `
  let designSystem = await __unstable__loadDesignSystem(input, {
    base: __dirname,
  })

  let migrated = migrate(designSystem, {}, candidate)
  expect(migrated).toEqual(expected)
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
  test.each([
    // Default spacing scale
    ['w-[64rem]', 'w-256', '0.25rem'],

    // Keep arbitrary value if units are different
    ['w-[124px]', 'w-[124px]', '0.25rem'],

    // Keep arbitrary value if bare value doesn't fit in steps of .25
    ['w-[0.123rem]', 'w-[0.123rem]', '0.25rem'],

    // Custom pixel based spacing scale
    ['w-[123px]', 'w-123', '1px'],
    ['w-[256px]', 'w-128', '2px'],
  ])(testName, async (candidate, expected, spacing) => {
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

    let input = css`
      @import 'tailwindcss' ${strategy === 'prefix' ? 'prefix(tw)' : ''};

      @theme {
        --*: initial;
        --spacing: ${spacing};
      }
    `
    let designSystem = await __unstable__loadDesignSystem(input, {
      base: __dirname,
    })

    let migrated = migrate(designSystem, {}, candidate)
    expect(migrated).toEqual(expected)
  })
})
