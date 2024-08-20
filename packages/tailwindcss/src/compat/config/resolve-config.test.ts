import { test } from 'vitest'
import { buildDesignSystem } from '../../design-system'
import { Theme } from '../../theme'
import { resolveConfig } from './resolve-config'

test('top level theme keys are replaced', ({ expect }) => {
  let design = buildDesignSystem(new Theme())

  let config = resolveConfig(design, [
    {
      theme: {
        colors: {
          red: 'red',
        },

        fontFamily: {
          sans: 'SF Pro Display',
        },
      },
    },
    {
      theme: {
        colors: {
          green: 'green',
        },
      },
    },
    {
      theme: {
        colors: {
          blue: 'blue',
        },
      },
    },
  ])

  expect(config).toMatchObject({
    theme: {
      colors: {
        blue: 'blue',
      },
      fontFamily: {
        sans: 'SF Pro Display',
      },
    },
  })
})

test('theme can be extended', ({ expect }) => {
  let design = buildDesignSystem(new Theme())

  let config = resolveConfig(design, [
    {
      theme: {
        colors: {
          red: 'red',
        },

        fontFamily: {
          sans: 'SF Pro Display',
        },
      },
    },
    {
      theme: {
        extend: {
          colors: {
            blue: 'blue',
          },
        },
      },
    },
  ])

  expect(config).toMatchObject({
    theme: {
      colors: {
        red: 'red',
        blue: 'blue',
      },
      fontFamily: {
        sans: 'SF Pro Display',
      },
    },
  })
})

test('theme keys can reference other theme keys using the theme function regardless of order', ({
  expect,
}) => {
  let design = buildDesignSystem(new Theme())

  let config = resolveConfig(design, [
    {
      theme: {
        colors: {
          red: 'red',
        },
        placeholderColor: {
          green: 'green',
        },
      },
    },
    {
      theme: {
        extend: {
          colors: ({ theme }) => ({
            ...theme('placeholderColor'),
            blue: 'blue',
          }),
        },
      },
    },
    {
      theme: {
        extend: {
          caretColor: ({ theme }) => theme('accentColor'),
          accentColor: ({ theme }) => theme('backgroundColor'),
          backgroundColor: ({ theme }) => theme('colors'),
        },
      },
    },
  ])

  expect(config).toMatchObject({
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      accentColor: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColor: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      caretColor: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    },
  })
})

test('theme keys can read from the CSS theme', ({ expect }) => {
  let theme = new Theme()
  theme.add('--color-green', 'green')

  let design = buildDesignSystem(theme)

  let config = resolveConfig(design, [
    {
      theme: {
        colors: ({ theme }) => ({
          // Reads from the --color-* namespace
          ...theme('color'),
          red: 'red',
        }),
        accentColor: ({ theme }) => ({
          // Reads from the --color-* namespace through `colors`
          ...theme('colors'),
        }),
        placeholderColor: ({ theme }) => ({
          // Reads from the --color-* namespace through `colors`
          primary: theme('colors.green'),

          // Reads from the --color-* namespace directly
          secondary: theme('color.green'),
        }),
      },
    },
  ])

  expect(config).toMatchObject({
    theme: {
      colors: {
        red: 'red',
        green: 'var(--color-green, green)',
      },
      accentColor: {
        red: 'red',
        green: 'var(--color-green, green)',
      },
      placeholderColor: {
        primary: 'var(--color-green, green)',
        secondary: 'var(--color-green, green)',
      },
    },
  })
})
