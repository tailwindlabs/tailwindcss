import { expect, test } from 'vitest'
import { __unstable__loadDesignSystem } from '.'
import { buildDesignSystem } from './design-system'
import plugin from './plugin'
import { Theme } from './theme'

const css = String.raw

function loadDesignSystem() {
  let theme = new Theme()
  theme.add('--spacing-0_5', '0.125rem')
  theme.add('--spacing-1', '0.25rem')
  theme.add('--spacing-3', '0.75rem')
  theme.add('--spacing-4', '1rem')
  theme.add('--width-4', '1rem')
  theme.add('--colors-red-500', 'red')
  theme.add('--colors-blue-500', 'blue')
  theme.add('--breakpoint-sm', '640px')
  theme.add('--font-size-xs', '0.75rem')
  theme.add('--font-size-xs--line-height', '1rem')
  theme.add('--perspective-dramatic', '100px')
  theme.add('--perspective-normal', '500px')
  theme.add('--opacity-background', '0.3')
  return buildDesignSystem(theme)
}

test('getClassList', () => {
  let design = loadDesignSystem()
  let classList = design.getClassList()
  let classNames = classList.flatMap(([name, meta]) => [
    name,
    ...meta.modifiers.map((m) => `${name}/${m}`),
  ])

  expect(classNames).toMatchSnapshot()
})

test('Theme values with underscores are converted back to decimal points', () => {
  let design = loadDesignSystem()
  let classes = design.getClassList()

  expect(classes).toContainEqual(['inset-0.5', { modifiers: [] }])
})

test('getVariants', () => {
  let design = loadDesignSystem()
  let variants = design.getVariants()

  expect(variants).toMatchSnapshot()
})

test('getVariants compound', () => {
  let design = loadDesignSystem()
  let variants = design.getVariants()
  let group = variants.find((v) => v.name === 'group')!

  let list = [
    // A selector-based variant
    group.selectors({ value: 'hover' }),

    // A selector-based variant with a modifier
    group.selectors({ value: 'hover', modifier: 'sidebar' }),

    // A nested, compound, selector-based variant
    group.selectors({ value: 'group-hover' }),

    // This variant produced an at rule
    group.selectors({ value: 'sm' }),

    // This variant does not exist
    group.selectors({ value: 'md' }),
  ]

  expect(list).toEqual([
    ['&:is(:where(.group):hover *)'],
    ['&:is(:where(.group\\/sidebar):hover *)'],
    ['&:is(:where(.group):is(:where(.group):hover *) *)'],
    [],
    [],
  ])
})

test('The variant `has-force` does not crash', () => {
  let design = loadDesignSystem()
  let variants = design.getVariants()
  let has = variants.find((v) => v.name === 'has')!

  expect(has.selectors({ value: 'force' })).toMatchInlineSnapshot(`[]`)
})

test('Can produce CSS per candidate using `candidatesToCss`', () => {
  let design = loadDesignSystem()
  design.invalidCandidates = new Set(['bg-[#fff]'])

  expect(design.candidatesToCss(['underline', 'i-dont-exist', 'bg-[#fff]', 'bg-[#000]']))
    .toMatchInlineSnapshot(`
    [
      ".underline {
      text-decoration-line: underline;
    }
    ",
      null,
      null,
      ".bg-\\[\\#000\\] {
      background-color: #000;
    }
    ",
    ]
  `)
})

test('Utilities do not show wrapping selector in intellisense', async () => {
  let input = css`
    @import 'tailwindcss/utilities';
    @config './config.js';
  `

  let design = await __unstable__loadDesignSystem(input, {
    loadStylesheet: async (_, base) => ({
      base,
      content: '@tailwind utilities;',
    }),
    loadModule: async () => ({
      base: '',
      module: {
        important: '#app',
      },
    }),
  })

  expect(design.candidatesToCss(['underline', 'hover:line-through'])).toMatchInlineSnapshot(`
    [
      ".underline {
      text-decoration-line: underline;
    }
    ",
      ".hover\\:line-through {
      &:hover {
        @media (hover: hover) {
          text-decoration-line: line-through;
        }
      }
    }
    ",
    ]
  `)
})

test('Utilities, when marked as important, show as important in intellisense', async () => {
  let input = css`
    @import 'tailwindcss/utilities' important;
  `

  let design = await __unstable__loadDesignSystem(input, {
    loadStylesheet: async (_, base) => ({
      base,
      content: '@tailwind utilities;',
    }),
  })

  expect(design.candidatesToCss(['underline', 'hover:line-through'])).toMatchInlineSnapshot(`
    [
      ".underline {
      text-decoration-line: underline !important;
    }
    ",
      ".hover\\:line-through {
      &:hover {
        @media (hover: hover) {
          text-decoration-line: line-through !important;
        }
      }
    }
    ",
    ]
  `)
})

test('Static utilities from plugins are listed in hovers and completions', async () => {
  let input = css`
    @import 'tailwindcss/utilities';
    @plugin "./plugin.js"l;
  `

  let design = await __unstable__loadDesignSystem(input, {
    loadStylesheet: async (_, base) => ({
      base,
      content: '@tailwind utilities;',
    }),
    loadModule: async () => ({
      base: '',
      module: plugin(({ addUtilities }) => {
        addUtilities({
          '.custom-utility': {
            color: 'red',
          },
        })
      }),
    }),
  })

  expect(design.candidatesToCss(['custom-utility'])).toMatchInlineSnapshot(`
    [
      ".custom-utility {
      color: red;
    }
    ",
    ]
  `)

  expect(design.getClassList().map((entry) => entry[0])).toContain('custom-utility')
})

test('Functional utilities from plugins are listed in hovers and completions', async () => {
  let input = css`
    @import 'tailwindcss/utilities';
    @plugin "./plugin.js"l;
  `

  let design = await __unstable__loadDesignSystem(input, {
    loadStylesheet: async (_, base) => ({
      base,
      content: '@tailwind utilities;',
    }),
    loadModule: async () => ({
      base: '',
      module: plugin(({ matchUtilities }) => {
        matchUtilities(
          {
            'custom-1': (value) => ({
              color: value,
            }),
          },
          {
            values: {
              red: '#ff0000',
              green: '#ff0000',
            },
          },
        )

        matchUtilities(
          {
            'custom-2': (value, { modifier }) => ({
              color: `${value} / ${modifier ?? '0%'}`,
            }),
          },
          {
            values: {
              red: '#ff0000',
              green: '#ff0000',
            },
            modifiers: {
              '50': '50%',
              '75': '75%',
            },
          },
        )

        matchUtilities(
          {
            'custom-3': (value, { modifier }) => ({
              color: `${value} / ${modifier ?? '0%'}`,
            }),
          },
          {
            values: {
              red: '#ff0000',
              green: '#ff0000',
            },
            modifiers: 'any',
          },
        )
      }),
    }),
  })

  expect(design.candidatesToCss(['custom-1-red', 'custom-1-green', 'custom-1-unknown']))
    .toMatchInlineSnapshot(`
    [
      ".custom-1-red {
      color: #ff0000;
    }
    ",
      ".custom-1-green {
      color: #ff0000;
    }
    ",
      null,
    ]
  `)

  expect(design.candidatesToCss(['custom-2-red', 'custom-2-green', 'custom-2-unknown']))
    .toMatchInlineSnapshot(`
    [
      ".custom-2-red {
      color: #ff0000 / 0%;
    }
    ",
      ".custom-2-green {
      color: #ff0000 / 0%;
    }
    ",
      null,
    ]
  `)

  expect(design.candidatesToCss(['custom-2-red/50', 'custom-2-red/75', 'custom-2-red/unknown']))
    .toMatchInlineSnapshot(`
    [
      ".custom-2-red\\/50 {
      color: #ff0000 / 50%;
    }
    ",
      ".custom-2-red\\/75 {
      color: #ff0000 / 75%;
    }
    ",
      null,
    ]
  `)

  let classMap = new Map(design.getClassList())
  let classNames = Array.from(classMap.keys())

  // matchUtilities without modifiers
  expect(classNames).toContain('custom-1-red')
  expect(classMap.get('custom-1-red')?.modifiers).toEqual([])

  expect(classNames).toContain('custom-1-green')
  expect(classMap.get('custom-1-green')?.modifiers).toEqual([])

  expect(classNames).not.toContain('custom-1-unknown')

  // matchUtilities with a set list of modifiers
  expect(classNames).toContain('custom-2-red')
  expect(classMap.get('custom-2-red')?.modifiers).toEqual(['50', '75'])

  expect(classNames).toContain('custom-2-green')
  expect(classMap.get('custom-2-green')?.modifiers).toEqual(['50', '75'])

  expect(classNames).not.toContain('custom-2-unknown')

  // matchUtilities with a any modifiers
  expect(classNames).toContain('custom-3-red')
  expect(classMap.get('custom-3-red')?.modifiers).toEqual([])

  expect(classNames).toContain('custom-3-green')
  expect(classMap.get('custom-3-green')?.modifiers).toEqual([])

  expect(classNames).not.toContain('custom-3-unknown')
})
