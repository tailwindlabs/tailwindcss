import type { Config, PluginCreator } from './types/config'
declare function createPlugin(
  plugin: PluginCreator,
  config?: Config
): { handler: PluginCreator; config?: Config }
export = createPlugin
