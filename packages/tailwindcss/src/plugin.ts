import type { Config, PluginFn, PluginWithConfig, PluginWithOptions } from './compat/plugin-api'

function createPlugin(handler: PluginFn, config?: Partial<Config>): PluginWithConfig {
  return {
    handler,
    config,
  }
}

createPlugin.withOptions = function <T>(
  pluginFunction: (options?: T) => PluginFn,
  configFunction: (options?: T) => Partial<Config> = () => ({}),
): PluginWithOptions<T> {
  function optionsFunction(options: T): PluginWithConfig {
    return {
      handler: pluginFunction(options),
      config: configFunction(options),
    }
  }

  optionsFunction.__isOptionsFunction = true as const

  return optionsFunction as PluginWithOptions<T>
}

export default createPlugin
