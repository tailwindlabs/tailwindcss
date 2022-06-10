import { PluginCreator } from 'postcss'
import type { Config } from './config.d'

declare const plugin: PluginCreator<string | Config | { config: string | Config }>

export { Config }
export default plugin
