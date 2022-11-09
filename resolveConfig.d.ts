import type { Config } from './types/config'
declare function resolveConfig<T extends Config>(config: T): T
export = resolveConfig
