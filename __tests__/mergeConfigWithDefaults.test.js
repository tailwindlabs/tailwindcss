import mergeConfigWithDefaults from '../src/util/mergeConfigWithDefaults'

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

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

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

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

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

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

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

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

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

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

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

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

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

test('user colors replace background, text, and border colors', () => {
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
      backgroundColors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      textColors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      borderColors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
    },
    variants: {
      backgroundColors: ['responsive'],
      textColors: ['responsive'],
      borderColors: ['responsive'],
    },
  }

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

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
      borderColors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    },
    variants: {
      backgroundColors: ['responsive'],
      textColors: ['responsive'],
      borderColors: ['responsive'],
    },
  })
})

test('user background, text, and border colors replace user colors', () => {
  const userConfig = {
    theme: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColors: {
        cyan: 'cyan',
      },
      textColors: {
        magenta: 'magenta',
      },
      borderColors: {
        yellow: 'yellow',
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
      backgroundColors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      textColors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      borderColors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
    },
    variants: {
      backgroundColors: ['responsive'],
      textColors: ['responsive'],
      borderColors: ['responsive'],
    },
  }

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

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
        cyan: 'cyan',
      },
      textColors: {
        magenta: 'magenta',
      },
      borderColors: {
        yellow: 'yellow',
      },
    },
    variants: {
      backgroundColors: ['responsive'],
      textColors: ['responsive'],
      borderColors: ['responsive'],
    },
  })
})
