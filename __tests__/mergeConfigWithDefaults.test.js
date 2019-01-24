import mergeConfigWithDefaults from '../src/util/mergeConfigWithDefaults'

test('user top-level keys override default top-level keys', () => {
  const userConfig = {
    prefix: 'tw-',
    important: true,
  }

  const defaultConfig = {
    prefix: '-',
    important: false,
    separator: ':',
  }

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

  expect(result).toEqual({
    prefix: 'tw-',
    important: true,
    separator: ':',
  })
})

test('missing top level keys are pulled from the default config', () => {
  const userConfig = {
    colors: { red: '#ff0000' },
    modules: {},
  }

  const defaultConfig = {
    colors: { green: '#00ff00' },
    screens: {
      sm: '576px',
    },
    modules: {},
  }

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

  expect(result).toEqual({
    colors: { red: '#ff0000' },
    screens: {
      sm: '576px',
    },
    modules: {},
  })
})
