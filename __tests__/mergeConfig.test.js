import mergeConfig from '../src/util/mergeConfig'

/**
 * Tests
 */
it('replaces simple top level keys', () => {
  const defaultConfig = {
    colors: {
      'red': '#f25451',
      'green-light': '#b1f3be',
      'blue-dark': '#3687c8',
      'indigo': '#6574cd',
    }
  }
  const userConfig = {
    colors: {
      'orange': '#ffb82b',
      'green': '#57d06f',
      'blue': '#4aa2ea',
      'indigo-dark': '#4957a5',
    }
  }
  expect(mergeConfig(defaultConfig, userConfig)).toMatchObject(userConfig)
})

it('merges keys found in the "extend" section', () => {
  const defaultConfig = {
    colors: {
      'red': '#f25451',
    },
    text: {
      sizes: {
        'base': '1rem',
        'lg': '1.25rem',
      }
    },
    spacing: {
      padding: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
      }
    }
  }
  const userConfig = {
    extend: {
      colors: {
        'blue': '#4aa2ea',
      },
      text: {
        sizes: {
          'xl': '1.5rem'
        }
      },
      spacing: {
        padding: {
          '10': '2.5rem'
        }
      }
    }
  }
  expect(mergeConfig(defaultConfig, userConfig)).toMatchObject({
    colors: {
      'red': '#f25451',
      'blue': '#4aa2ea',
    },
    text: {
      sizes: {
        'base': '1rem',
        'lg': '1.25rem',
        'xl': '1.5rem',
      }
    },
    spacing: {
      padding: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '10': '2.5rem',
      }
    }
  })
})
