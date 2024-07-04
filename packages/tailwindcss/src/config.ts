import type { Plugin } from './plugins'

export interface UserConfig {
  /**
   * A list of registered plugins
   */
  plugins?: Plugin[]
}

export interface ResolvedConfig {
  /**
   * A list of registered plugins
   */
  plugins: Plugin[]
}

export function resolve(config: UserConfig) {
  let defaults: ResolvedConfig = {
    plugins: [],
  }

  return {
    ...defaults,
    ...config,
  }
}
