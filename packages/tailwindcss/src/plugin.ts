import type { PluginAPI } from './plugin-api'

interface Config {}

type PluginFn = (api: PluginAPI) => void
type PluginWithConfig = { handler: PluginFn; config?: Partial<Config> }
type PluginWithOptions = {
  (options?: any): PluginWithConfig
  __isOptionsFunction: true
}

export type Plugin = PluginFn | PluginWithConfig | PluginWithOptions

function createPlugin(handler: PluginFn, config?: Partial<Config>): Plugin {
  return {
    handler,
    config,
  }
}

createPlugin.withOptions = function (
  pluginFunction: (options?: any) => PluginFn,
  configFunction: (options?: any) => Partial<Config> = () => ({}),
): PluginWithOptions {
  function optionsFunction(options: any): PluginWithConfig {
    return {
      handler: pluginFunction(options),
      config: configFunction(options),
    }
  }

  optionsFunction.__isOptionsFunction = true as const

  return optionsFunction
}

export default createPlugin
