import configurePlugins from '../src/util/configurePlugins'

test('setting a plugin to false removes it', () => {
  const plugins = {
    fontSize: options => {
      return {
        plugin: 'fontSize',
        options,
      }
    },
    display: options => {
      return {
        plugin: 'display',
        options,
      }
    },
    backgroundPosition: options => {
      return {
        plugin: 'backgroundPosition',
        options,
      }
    },
  }

  const configuredPlugins = configurePlugins(plugins, {
    fontSize: {},
    display: false,
    backgroundPosition: {},
  })

  expect(configuredPlugins).toEqual([
    { plugin: 'fontSize', options: {} },
    { plugin: 'backgroundPosition', options: {} },
  ])
})

test('setting a plugin to an object configures that plugin', () => {
  const plugins = {
    fontSize: options => {
      return {
        plugin: 'fontSize',
        options,
      }
    },
    display: options => {
      return {
        plugin: 'display',
        options,
      }
    },
    backgroundPosition: options => {
      return {
        plugin: 'backgroundPosition',
        options,
      }
    },
  }

  const configuredPlugins = configurePlugins(plugins, {
    fontSize: {
      variants: ['responsive', 'hover'],
      values: { '12': '12px', '14': '14px', '16': '16px' },
    },
    display: { variants: ['responsive'] },
    backgroundPosition: {},
  })

  expect(configuredPlugins).toEqual([
    {
      plugin: 'fontSize',
      options: {
        variants: ['responsive', 'hover'],
        values: { '12': '12px', '14': '14px', '16': '16px' },
      },
    },
    { plugin: 'display', options: { variants: ['responsive'] } },
    { plugin: 'backgroundPosition', options: {} },
  ])
})

test('plugins are configured with their default configuration if no custom config is provided', () => {
  const plugins = {
    fontSize: options => {
      return {
        plugin: 'fontSize',
        options,
      }
    },
    display: options => {
      return {
        plugin: 'display',
        options,
      }
    },
    backgroundPosition: options => {
      return {
        plugin: 'backgroundPosition',
        options,
      }
    },
  }

  const configuredPlugins = configurePlugins(plugins, {
    fontSize: {
      variants: ['responsive', 'hover'],
      values: { '12': '12px', '14': '14px', '16': '16px' },
    },
    backgroundPosition: {},
  }, {
    display: { variants: ['responsive'] },
  })

  expect(configuredPlugins).toEqual([
    {
      plugin: 'fontSize',
      options: {
        variants: ['responsive', 'hover'],
        values: { '12': '12px', '14': '14px', '16': '16px' },
      },
    },
    { plugin: 'display', options: { variants: ['responsive'] } },
    { plugin: 'backgroundPosition', options: {} },
  ])
})

test('custom plugin configuration overrides default plugin configuration', () => {
  const plugins = {
    fontSize: options => {
      return {
        plugin: 'fontSize',
        options,
      }
    },
    display: options => {
      return {
        plugin: 'display',
        options,
      }
    },
    backgroundPosition: options => {
      return {
        plugin: 'backgroundPosition',
        options,
      }
    },
  }

  const configuredPlugins = configurePlugins(plugins, {
    fontSize: {
      variants: ['responsive', 'hover'],
      values: { '12': '12px', '14': '14px', '16': '16px' },
    },
    display: { variants: ['responsive'] },
    backgroundPosition: {},
  }, {
    fontSize: {
      variants: ['focus', 'active'],
      values: { 'sm': '.75rem', 'md': '1rem', 'lg': '1.5rem' },
    },
  })

  expect(configuredPlugins).toEqual([
    {
      plugin: 'fontSize',
      options: {
        variants: ['responsive', 'hover'],
        values: { '12': '12px', '14': '14px', '16': '16px' },
      },
    },
    { plugin: 'display', options: { variants: ['responsive'] } },
    { plugin: 'backgroundPosition', options: {} },
  ])
})
