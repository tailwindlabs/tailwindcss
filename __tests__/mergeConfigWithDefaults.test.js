import mergeConfigWithDefaults from '../src/util/mergeConfigWithDefaults'

test('user top-level keys override default top-level keys except modules', () => {
  const userConfig = {
    modules: {},
    prefix: 'tw-',
    important: true,
  }

  const defaultConfig = {
    modules: {
      flexbox: ['responsive'],
    },
    prefix: '-',
    important: false,
  }

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

  expect(result).toEqual({
    modules: {
      flexbox: ['responsive'],
    },
    prefix: 'tw-',
    important: true,
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

test('user modules are merged with default modules', () => {
  const userConfig = {
    modules: { flexbox: false },
  }

  const defaultConfig = {
    modules: {
      flexbox: ['responsive'],
      textAlign: ['responsive'],
    },
  }

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

  expect(result).toEqual({
    modules: {
      flexbox: false,
      textAlign: ['responsive'],
    },
  })
})

test('setting modules to "all" creates all variants for all modules', () => {
  const userConfig = {
    modules: 'all',
  }

  const defaultConfig = {
    modules: {
      flexbox: ['responsive'],
      textAlign: ['hover'],
      textColors: ['focus'],
    },
  }

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

  expect(result).toEqual({
    modules: {
      flexbox: ['responsive', 'group-hover', 'hover', 'focus-within', 'focus', 'active'],
      textAlign: ['responsive', 'group-hover', 'hover', 'focus-within', 'focus', 'active'],
      textColors: ['responsive', 'group-hover', 'hover', 'focus-within', 'focus', 'active'],
    },
  })
})

test('setting modules to an array of variants applies those variants to all modules', () => {
  const userConfig = {
    modules: ['responsive', 'focus', 'hover', 'custom-variant'],
  }

  const defaultConfig = {
    modules: {
      flexbox: ['responsive'],
      textAlign: ['hover'],
      textColors: ['focus'],
    },
  }

  const result = mergeConfigWithDefaults(userConfig, defaultConfig)

  expect(result).toEqual({
    modules: {
      flexbox: ['responsive', 'focus', 'hover', 'custom-variant'],
      textAlign: ['responsive', 'focus', 'hover', 'custom-variant'],
      textColors: ['responsive', 'focus', 'hover', 'custom-variant'],
    },
  })
})
