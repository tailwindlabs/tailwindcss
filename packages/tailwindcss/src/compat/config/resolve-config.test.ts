import { expect, test, vi } from 'vitest'
import { buildDesignSystem } from '../../design-system'
import { Theme } from '../../theme'
import { resolveConfig } from './resolve-config'

test('top level theme keys are replaced', () => {
  let design = buildDesignSystem(new Theme())

  let config = resolveConfig(design, [
    {
      config: {
        theme: {
          colors: {
            red: 'red',
          },

          fontFamily: {
            sans: 'SF Pro Display',
          },
        },
      },
      base: '/root',
    },
    {
      config: {
        theme: {
          colors: {
            green: 'green',
          },
        },
      },
      base: '/root',
    },
    {
      config: {
        theme: {
          colors: {
            blue: 'blue',
          },
        },
      },
      base: '/root',
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

test('theme can be extended', () => {
  let design = buildDesignSystem(new Theme())

  let config = resolveConfig(design, [
    {
      config: {
        theme: {
          colors: {
            red: 'red',
          },

          fontFamily: {
            sans: 'SF Pro Display',
          },
        },
      },
      base: '/root',
    },
    {
      config: {
        theme: {
          extend: {
            colors: {
              blue: 'blue',
            },
          },
        },
      },
      base: '/root',
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
      config: {
        theme: {
          colors: {
            red: 'red',
          },
          placeholderColor: {
            green: 'green',
          },
        },
      },
      base: '/root',
    },
    {
      config: {
        theme: {
          extend: {
            colors: ({ theme }) => ({
              ...theme('placeholderColor'),
              blue: 'blue',
            }),
          },
        },
      },
      base: '/root',
    },
    {
      config: {
        theme: {
          extend: {
            caretColor: ({ theme }) => theme('accentColor'),
            accentColor: ({ theme }) => theme('backgroundColor'),
            backgroundColor: ({ theme }) => theme('colors'),
          },
        },
      },
      base: '/root',
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

test('theme keys can read from the CSS theme', () => {
  let originalWarn = console.warn
  try {
    console.warn = vi.fn()
    let theme = new Theme()
    theme.add('--color-green', 'green')

    let design = buildDesignSystem(theme)

    let config = resolveConfig(design, [
      {
        config: {
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
            caretColor: ({ colors }) => ({
              // Gives access to the colors object directly
              primary: colors.green,
            }),
            transitionColor: (theme: any) => ({
              // The parameter object is also the theme function
              ...theme('colors'),
            }),
          },
        },
        base: '/root',
      },
    ])

    expect(config).toMatchObject({
      theme: {
        colors: {
          red: 'red',
          green: 'green',
        },
        accentColor: {
          red: 'red',
          green: 'green',
        },
        placeholderColor: {
          primary: 'green',
          secondary: 'green',
        },
        caretColor: {
          primary: {
            '50': '#f0fdf4',
            '100': '#dcfce7',
            '200': '#bbf7d0',
            '300': '#86efac',
            '400': '#4ade80',
            '500': '#22c55e',
            '600': '#16a34a',
            '700': '#15803d',
            '800': '#166534',
            '900': '#14532d',
            '950': '#052e16',
          },
        },
        transitionColor: {
          red: 'red',
          green: 'green',
        },
      },
    })
    expect(console.warn).toHaveBeenCalledWith(
      'Using the plugin object parameter as the theme function is deprecated. Please use the `theme` property instead.',
    )
  } finally {
    console.warn = originalWarn
  }
})
