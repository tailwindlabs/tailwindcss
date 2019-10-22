import resolveConfig from '../src/util/resolveConfig'

test('prefix key overrides default prefix', () => {
  const userConfig = {
    prefix: 'tw-',
  }

  const defaultConfig = {
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: 'tw-',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  })
})

test('important key overrides default important', () => {
  const userConfig = {
    important: true,
  }

  const defaultConfig = {
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '',
    important: true,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  })
})

test('important (selector) key overrides default important', () => {
  const userConfig = {
    important: '#app',
  }

  const defaultConfig = {
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '',
    important: '#app',
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  })
})

test('separator key overrides default separator', () => {
  const userConfig = {
    separator: '__',
  }

  const defaultConfig = {
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '',
    important: false,
    separator: '__',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  })
})

test('theme key is merged instead of replaced', () => {
  const userConfig = {
    theme: {
      screens: {
        mobile: '400px',
      },
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        'grey-darker': '#606f7b',
        'grey-dark': '#8795a1',
        grey: '#b8c2cc',
        'grey-light': '#dae1e7',
        'grey-lighter': '#f1f5f8',
      },
      fonts: {
        sans: ['system-ui', 'BlinkMacSystemFont', '-apple-system', 'Roboto', 'sans-serif'],
        serif: ['Constantia', 'Lucida Bright', 'Georgia', 'serif'],
      },
      screens: {
        sm: '500px',
        md: '750px',
        lg: '1000px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        'grey-darker': '#606f7b',
        'grey-dark': '#8795a1',
        grey: '#b8c2cc',
        'grey-light': '#dae1e7',
        'grey-lighter': '#f1f5f8',
      },
      fonts: {
        sans: ['system-ui', 'BlinkMacSystemFont', '-apple-system', 'Roboto', 'sans-serif'],
        serif: ['Constantia', 'Lucida Bright', 'Georgia', 'serif'],
      },
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  })
})

test('variants key is merged instead of replaced', () => {
  const userConfig = {
    variants: {
      backgroundAttachment: [],
      borderColors: ['responsive', 'hover', 'focus', 'active'],
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        'grey-darker': '#606f7b',
        'grey-dark': '#8795a1',
        grey: '#b8c2cc',
        'grey-light': '#dae1e7',
        'grey-lighter': '#f1f5f8',
      },
      fonts: {
        sans: ['system-ui', 'BlinkMacSystemFont', '-apple-system', 'Roboto', 'sans-serif'],
        serif: ['Constantia', 'Lucida Bright', 'Georgia', 'serif'],
      },
      screens: {
        sm: '500px',
        md: '750px',
        lg: '1000px',
      },
    },
    variants: {
      appearance: ['responsive'],
      backgroundAttachment: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
      borderRadius: ['responsive'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        'grey-darker': '#606f7b',
        'grey-dark': '#8795a1',
        grey: '#b8c2cc',
        'grey-light': '#dae1e7',
        'grey-lighter': '#f1f5f8',
      },
      fonts: {
        sans: ['system-ui', 'BlinkMacSystemFont', '-apple-system', 'Roboto', 'sans-serif'],
        serif: ['Constantia', 'Lucida Bright', 'Georgia', 'serif'],
      },
      screens: {
        sm: '500px',
        md: '750px',
        lg: '1000px',
      },
    },
    variants: {
      appearance: ['responsive'],
      backgroundAttachment: [],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus', 'active'],
      borderRadius: ['responsive'],
    },
  })
})

test('a global variants list replaces the default', () => {
  const userConfig = {
    variants: ['responsive', 'hover', 'focus', 'active'],
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        'grey-darker': '#606f7b',
        'grey-dark': '#8795a1',
        grey: '#b8c2cc',
        'grey-light': '#dae1e7',
        'grey-lighter': '#f1f5f8',
      },
      fonts: {
        sans: ['system-ui', 'BlinkMacSystemFont', '-apple-system', 'Roboto', 'sans-serif'],
        serif: ['Constantia', 'Lucida Bright', 'Georgia', 'serif'],
      },
      screens: {
        sm: '500px',
        md: '750px',
        lg: '1000px',
      },
    },
    variants: {
      appearance: ['responsive'],
      backgroundAttachment: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
      borderRadius: ['responsive'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        'grey-darker': '#606f7b',
        'grey-dark': '#8795a1',
        grey: '#b8c2cc',
        'grey-light': '#dae1e7',
        'grey-lighter': '#f1f5f8',
      },
      fonts: {
        sans: ['system-ui', 'BlinkMacSystemFont', '-apple-system', 'Roboto', 'sans-serif'],
        serif: ['Constantia', 'Lucida Bright', 'Georgia', 'serif'],
      },
      screens: {
        sm: '500px',
        md: '750px',
        lg: '1000px',
      },
    },
    variants: ['responsive', 'hover', 'focus', 'active'],
  })
})

test('missing top level keys are pulled from the default config', () => {
  const userConfig = {}

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: { green: '#00ff00' },
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: { green: '#00ff00' },
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  })
})

test('functions in the default theme section are lazily evaluated', () => {
  const userConfig = {
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      backgroundColors: theme => theme('colors'),
      textColors: theme => theme('colors'),
    },
    variants: {
      backgroundColors: ['responsive', 'hover', 'focus'],
      textColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      textColors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    },
    variants: {
      backgroundColors: ['responsive', 'hover', 'focus'],
      textColors: ['responsive', 'hover', 'focus'],
    },
  })
})

test('functions in the user theme section are lazily evaluated', () => {
  const userConfig = {
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColors: theme => ({
        ...theme('colors'),
        customBackground: '#bada55',
      }),
      textColors: theme => ({
        ...theme('colors'),
        customText: '#facade',
      }),
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      backgroundColors: ({ colors }) => colors,
      textColors: ({ colors }) => colors,
    },
    variants: {
      backgroundColors: ['responsive', 'hover', 'focus'],
      textColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
        customBackground: '#bada55',
      },
      textColors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
        customText: '#facade',
      },
    },
    variants: {
      backgroundColors: ['responsive', 'hover', 'focus'],
      textColors: ['responsive', 'hover', 'focus'],
    },
  })
})

test('theme values in the extend section extend the existing theme', () => {
  const userConfig = {
    theme: {
      extend: {
        opacity: {
          '25': '25',
          '75': '.75',
        },
        backgroundColors: {
          customBackground: '#bada55',
        },
      },
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      opacity: {
        '0': '0',
        '50': '.5',
        '100': '1',
      },
      backgroundColors: theme => theme('colors'),
    },
    variants: {
      backgroundColors: ['responsive', 'hover', 'focus'],
      opacity: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      opacity: {
        '0': '0',
        '50': '.5',
        '100': '1',
        '25': '25',
        '75': '.75',
      },
      backgroundColors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
        customBackground: '#bada55',
      },
    },
    variants: {
      backgroundColors: ['responsive', 'hover', 'focus'],
      opacity: ['responsive', 'hover', 'focus'],
    },
  })
})

test('theme values in the extend section extend the user theme', () => {
  const userConfig = {
    theme: {
      opacity: {
        '0': '0',
        '20': '.2',
        '40': '.4',
      },
      height: theme => theme('width'),
      extend: {
        opacity: {
          '60': '.6',
          '80': '.8',
          '100': '1',
        },
        height: {
          customHeight: '500vh',
        },
      },
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      opacity: {
        '0': '0',
        '50': '.5',
        '100': '1',
      },
      height: {
        '0': 0,
        full: '100%',
      },
      width: {
        '0': 0,
        '1': '.25rem',
        '2': '.5rem',
        '3': '.75rem',
        '4': '1rem',
      },
    },
    variants: {
      opacity: ['responsive', 'hover', 'focus'],
      height: ['responsive'],
      width: ['responsive'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      opacity: {
        '0': '0',
        '20': '.2',
        '40': '.4',
        '60': '.6',
        '80': '.8',
        '100': '1',
      },
      height: {
        '0': 0,
        '1': '.25rem',
        '2': '.5rem',
        '3': '.75rem',
        '4': '1rem',
        customHeight: '500vh',
      },
      width: {
        '0': 0,
        '1': '.25rem',
        '2': '.5rem',
        '3': '.75rem',
        '4': '1rem',
      },
    },
    variants: {
      opacity: ['responsive', 'hover', 'focus'],
      height: ['responsive'],
      width: ['responsive'],
    },
  })
})

test('theme values in the extend section can extend values that are depended on lazily', () => {
  const userConfig = {
    theme: {
      extend: {
        colors: {
          red: 'red',
          green: 'green',
          blue: 'blue',
        },
        backgroundColors: {
          customBackground: '#bada55',
        },
      },
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      backgroundColors: theme => theme('colors'),
    },
    variants: {
      backgroundColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
        red: 'red',
        green: 'green',
        blue: 'blue',
        customBackground: '#bada55',
      },
    },
    variants: {
      backgroundColors: ['responsive', 'hover', 'focus'],
    },
  })
})

test('theme values in the extend section are not deeply merged', () => {
  const userConfig = {
    theme: {
      extend: {
        fonts: {
          sans: ['Comic Sans'],
        },
      },
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      fonts: {
        sans: ['system-ui', 'Helvetica Neue', 'sans-serif'],
        serif: ['Constantia', 'Georgia', 'serif'],
        mono: ['Menlo', 'Courier New', 'monospace'],
      },
    },
    variants: {
      fonts: ['responsive'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      fonts: {
        sans: ['Comic Sans'],
        serif: ['Constantia', 'Georgia', 'serif'],
        mono: ['Menlo', 'Courier New', 'monospace'],
      },
    },
    variants: {
      fonts: ['responsive'],
    },
  })
})

test('the theme function can use a default value if the key is missing', () => {
  const userConfig = {
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      borderColor: theme => ({
        default: theme('colors.gray', 'currentColor'),
        ...theme('colors'),
      }),
    },
    variants: {
      borderColor: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      borderColor: {
        default: 'currentColor',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    },
    variants: {
      borderColor: ['responsive', 'hover', 'focus'],
    },
  })
})

test('the theme function can resolve function values', () => {
  const userConfig = {
    theme: {
      textColor: theme => ({
        lime: 'lime',
        ...theme('colors'),
      }),
      backgroundColor: theme => ({
        orange: 'orange',
        ...theme('textColor'),
      }),
      borderColor: theme => theme('backgroundColor'),
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    },
    variants: {
      backgroundColor: ['responsive', 'hover', 'focus'],
      borderColor: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      textColor: {
        lime: 'lime',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColor: {
        lime: 'lime',
        orange: 'orange',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      borderColor: {
        lime: 'lime',
        orange: 'orange',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    },
    variants: {
      backgroundColor: ['responsive', 'hover', 'focus'],
      borderColor: ['responsive', 'hover', 'focus'],
    },
  })
})

test('the theme function can resolve deep function values', () => {
  const userConfig = {
    theme: {
      minWidth: theme => ({
        '1/3': theme('width.1/3'),
      }),
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      spacing: {
        '0': '0',
      },
      width: theme => ({
        ...theme('spacing'),
        '1/3': '33.33333%',
      }),
    },
    variants: {
      backgroundColor: ['responsive', 'hover', 'focus'],
      borderColor: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      spacing: {
        '0': '0',
      },
      width: {
        '0': '0',
        '1/3': '33.33333%',
      },
      minWidth: {
        '1/3': '33.33333%',
      },
    },
    variants: {
      backgroundColor: ['responsive', 'hover', 'focus'],
      borderColor: ['responsive', 'hover', 'focus'],
    },
  })
})

test('theme values in the extend section are lazily evaluated', () => {
  const userConfig = {
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      extend: {
        colors: {
          orange: 'orange',
        },
        borderColor: theme => ({
          foo: theme('colors.orange'),
          bar: theme('colors.red'),
        }),
      },
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      borderColor: theme => ({
        default: theme('colors.yellow', 'currentColor'),
        ...theme('colors'),
      }),
    },
    variants: {
      borderColor: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        orange: 'orange',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      borderColor: {
        default: 'currentColor',
        foo: 'orange',
        bar: 'red',
        orange: 'orange',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    },
    variants: {
      borderColor: ['responsive', 'hover', 'focus'],
    },
  })
})

test('lazily evaluated values have access to the config utils', () => {
  const userConfig = {
    theme: {
      inset: theme => theme('margin'),
      shift: (theme, { negative }) => ({
        ...theme('spacing'),
        ...negative(theme('spacing')),
      }),
      extend: {
        nudge: (theme, { negative }) => ({
          ...theme('spacing'),
          ...negative(theme('spacing')),
        }),
      },
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      spacing: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      margin: (theme, { negative }) => ({
        ...theme('spacing'),
        ...negative(theme('spacing')),
      }),
    },
    variants: {},
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      spacing: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      inset: {
        '-1': '-1px',
        '-2': '-2px',
        '-3': '-3px',
        '-4': '-4px',
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      margin: {
        '-1': '-1px',
        '-2': '-2px',
        '-3': '-3px',
        '-4': '-4px',
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      shift: {
        '-1': '-1px',
        '-2': '-2px',
        '-3': '-3px',
        '-4': '-4px',
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      nudge: {
        '-1': '-1px',
        '-2': '-2px',
        '-3': '-3px',
        '-4': '-4px',
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
    },
    variants: {},
  })
})

test('the original theme is not mutated', () => {
  const userConfig = {
    theme: {
      extend: {
        colors: {
          orange: 'orange',
        },
      },
    },
    variants: {
      borderColor: ['responsive', 'hover'],
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
    },
    variants: {
      backgroundColor: ['responsive', 'hover', 'focus'],
    },
  }

  resolveConfig([userConfig, defaultConfig])

  expect(userConfig).toEqual({
    theme: {
      extend: {
        colors: {
          orange: 'orange',
        },
      },
    },
    variants: {
      borderColor: ['responsive', 'hover'],
    },
  })
})

test('custom properties are multiplied by -1 for negative values', () => {
  const userConfig = {
    theme: {
      spacing: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        foo: 'var(--foo)',
        bar: 'var(--bar, 500px)',
        baz: 'calc(50% - 10px)',
      },
      margin: (theme, { negative }) => ({
        ...theme('spacing'),
        ...negative(theme('spacing')),
      }),
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {},
    variants: {},
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      spacing: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        foo: 'var(--foo)',
        bar: 'var(--bar, 500px)',
        baz: 'calc(50% - 10px)',
      },
      margin: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        foo: 'var(--foo)',
        bar: 'var(--bar, 500px)',
        baz: 'calc(50% - 10px)',
        '-1': '-1px',
        '-2': '-2px',
        '-3': '-3px',
        '-4': '-4px',
        '-foo': 'calc(var(--foo) * -1)',
        '-bar': 'calc(var(--bar, 500px) * -1)',
        '-baz': 'calc(-50% - -10px)',
      },
    },
    variants: {},
  })
})

test('more than two config objects can be resolved', () => {
  const firstConfig = {
    theme: {
      extend: {
        fontFamily: () => ({
          code: ['Menlo', 'monospace'],
        }),
        colors: {
          red: 'red',
        },
        backgroundColor: {
          customBackgroundOne: '#bada55',
        },
        textDecorationColor: {
          orange: 'orange',
        },
      },
    },
  }

  const secondConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      extend: {
        fontFamily: {
          quote: ['Helvetica', 'serif'],
        },
        colors: {
          green: 'green',
        },
        backgroundColor: {
          customBackgroundTwo: '#facade',
        },
        textDecorationColor: theme => theme('colors'),
      },
    },
  }

  const thirdConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      extend: {
        fontFamily: {
          hero: ['Futura', 'sans-serif'],
        },
        colors: {
          pink: 'pink',
        },
        backgroundColor: () => ({
          customBackgroundThree: '#c0ffee',
        }),
        textDecorationColor: {
          lime: 'lime',
        },
      },
    },
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      fontFamily: {
        body: ['Arial', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      colors: {
        blue: 'blue',
      },
      backgroundColor: theme => theme('colors'),
    },
    variants: {
      backgroundColor: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([firstConfig, secondConfig, thirdConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '-',
    important: false,
    separator: ':',
    theme: {
      fontFamily: {
        body: ['Arial', 'sans-serif'],
        display: ['Georgia', 'serif'],
        code: ['Menlo', 'monospace'],
        quote: ['Helvetica', 'serif'],
        hero: ['Futura', 'sans-serif'],
      },
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
        pink: 'pink',
      },
      backgroundColor: {
        red: 'red',
        green: 'green',
        blue: 'blue',
        pink: 'pink',
        customBackgroundOne: '#bada55',
        customBackgroundTwo: '#facade',
        customBackgroundThree: '#c0ffee',
      },
      textDecorationColor: {
        red: 'red',
        green: 'green',
        blue: 'blue',
        pink: 'pink',
        orange: 'orange',
        lime: 'lime',
      },
    },
    variants: {
      backgroundColor: ['responsive', 'hover', 'focus'],
    },
  })
})

test('plugin config modifications are applied', () => {
  const userConfig = {
    plugins: [
      {
        config: {
          prefix: 'tw-',
        },
      },
    ],
  }

  const defaultConfig = {
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: 'tw-',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
    plugins: userConfig.plugins,
  })
})

test('user config takes precedence over plugin config modifications', () => {
  const userConfig = {
    prefix: 'user-',
    plugins: [
      {
        config: {
          prefix: 'tw-',
        },
      },
    ],
  }

  const defaultConfig = {
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: 'user-',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
    plugins: userConfig.plugins,
  })
})

test('plugin config can register plugins that also have config', () => {
  const userConfig = {
    plugins: [
      {
        config: {
          prefix: 'tw-',
          plugins: [
            {
              config: {
                important: true,
              },
            },
            {
              config: {
                separator: '__',
              },
            },
          ],
        },
        handler() {},
      },
    ],
  }

  const defaultConfig = {
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: 'tw-',
    important: true,
    separator: '__',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
    plugins: userConfig.plugins,
  })
})

test('plugin configs take precedence over plugin configs registered by that plugin', () => {
  const userConfig = {
    plugins: [
      {
        config: {
          prefix: 'outer-',
          plugins: [
            {
              config: {
                prefix: 'inner-',
              },
            },
          ],
        },
        handler() {},
      },
    ],
  }

  const defaultConfig = {
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: 'outer-',
    important: false,
    separator: ':',
    theme: {
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
    plugins: userConfig.plugins,
  })
})

test('plugin theme extensions are added even if user overrides top-level theme config', () => {
  const userConfig = {
    theme: {
      width: {
        '1px': '1px',
      },
    },
    plugins: [
      {
        config: {
          theme: {
            extend: {
              width: {
                '2px': '2px',
                '3px': '3px',
              },
            },
          },
        },
        handler() {},
      },
    ],
  }

  const defaultConfig = {
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      width: {
        sm: '1rem',
        md: '2rem',
        lg: '3rem',
      },
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      width: {
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
      },
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
    plugins: userConfig.plugins,
  })
})

test('user theme extensions take precedence over plugin theme extensions with the same key', () => {
  const userConfig = {
    theme: {
      extend: {
        width: {
          xl: '6rem',
        },
      },
    },
    plugins: [
      {
        config: {
          theme: {
            extend: {
              width: {
                xl: '4rem',
              },
            },
          },
        },
        handler() {},
      },
    ],
  }

  const defaultConfig = {
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      width: {
        sm: '1rem',
        md: '2rem',
        lg: '3rem',
      },
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
  }

  const result = resolveConfig([userConfig, defaultConfig])

  expect(result).toEqual({
    prefix: '',
    important: false,
    separator: ':',
    theme: {
      width: {
        sm: '1rem',
        md: '2rem',
        lg: '3rem',
        xl: '6rem',
      },
      screens: {
        mobile: '400px',
      },
    },
    variants: {
      appearance: ['responsive'],
      borderCollapse: [],
      borderColors: ['responsive', 'hover', 'focus'],
    },
    plugins: userConfig.plugins,
  })
})
