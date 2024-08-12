import type { PluginAPI } from './plugin-api'

type Config = Record<string, any>

type PluginFn = (api: PluginAPI) => void
type PluginWithConfig = { handler: PluginFn; config?: Partial<Config> }
type PluginWithOptions<T> = {
  (options?: T): PluginWithConfig
  __isOptionsFunction: true
}

export type Plugin = PluginFn | PluginWithConfig | PluginWithOptions<any>

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
