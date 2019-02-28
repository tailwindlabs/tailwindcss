import configurePlugins from '../src/util/configurePlugins'

test('setting a plugin to false removes it', () => {
  const plugins = {
    fontSize: () => 'fontSize',
    display: () => 'display',
    backgroundPosition: () => 'backgroundPosition',
  }

  const configuredPlugins = configurePlugins(
    {
      display: false,
    },
    plugins
  )

  expect(configuredPlugins).toEqual(['fontSize', 'backgroundPosition'])
})
