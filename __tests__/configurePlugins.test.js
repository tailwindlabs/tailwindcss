import configurePlugins from '../src/util/configurePlugins'

test('setting a plugin to false removes it', () => {
  const plugins = {
    fontSize: (options) => {
      return {
        plugin: 'fontSize',
        options,
      }
    },
    display: (options) => {
      return {
        plugin: 'display',
        options,
      }
    },
    backgroundPosition: (options) => {
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
