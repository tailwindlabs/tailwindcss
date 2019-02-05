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
