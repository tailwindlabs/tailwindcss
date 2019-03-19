import transform from '../src/cli/commands/update/transform'
import defaultConfig from '../stubs/defaultConfig.stub.js'

describe('cli update transform', () => {
  let oldConfig
  let containerPlugin

  beforeEach(() => {
    containerPlugin = {
      plugin: 'container',
      options: {},
    }

    oldConfig = {
      options: {},
      modules: {},
      plugins: [containerPlugin],
    }
  })

  it('returns complete configuration', () => {
    expect(transform(oldConfig)).toEqual(defaultConfig)
  })

  it('populates theme', () => {
    oldConfig.colors = 'test'
    expect(transform(oldConfig).theme.colors).toEqual('test')
  })

  it('transforms theme values that have changed', () => {
    oldConfig.shadows = 'test'
    expect(transform(oldConfig).theme.boxShadow).toEqual('test')
  })

  it('populates variants', () => {
    oldConfig.modules.appearance = 'test'
    expect(transform(oldConfig).variants.appearance).toEqual('test')
  })

  it('transforms variants that have changed', () => {
    oldConfig.modules.svgFill = 'test'
    expect(transform(oldConfig).variants.fill).toEqual('test')
  })

  it('disables variants using corePlugins', () => {
    oldConfig.modules.float = false
    expect(transform(oldConfig).corePlugins.float).toEqual(false)
  })

  it('populates options', () => {
    oldConfig.options.important = 'test'
    expect(transform(oldConfig).important).toEqual('test')
  })

  it('populates plugins', () => {
    oldConfig.plugins = [jest.fn()]
    expect(transform(oldConfig).plugins).toEqual(oldConfig.plugins)
  })

  it('transforms container plugin', () => {
    containerPlugin.options = { padding: 'test' }
    expect(transform(oldConfig).theme.container).toEqual(containerPlugin.options)
  })

  it('disables container plugin', () => {
    oldConfig.plugins = []
    expect(transform(oldConfig).corePlugins.container).toEqual(false)
  })
})
