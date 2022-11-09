import type { Config } from './types/config'
declare function defineConfig<T extends Config>(config: T): T
export = defineConfig
