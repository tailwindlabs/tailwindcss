import type { PluginUtils } from './compat/config/resolve-config'
import type { ThemeConfig } from './compat/config/types'
import type {
  Config,
  Plugin,
  PluginAPI,
  PluginFn,
  PluginWithConfig,
  PluginWithOptions,
} from './compat/plugin-api'

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

// v3 compatible types previously exported via `tailwindcss/types/config`
export type {
  Config,
  PluginAPI,
  PluginFn as PluginCreator,
  Plugin as PluginsConfig,
  PluginUtils,
  ThemeConfig,
}
