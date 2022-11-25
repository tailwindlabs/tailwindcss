import type { Config, ResolvableTo } from './types/config'

type UnwrapResolvables<T> = {
  [K in keyof T]: T[K] extends ResolvableTo<infer R> ? R : T[K]
}

type ResolvedConfig<T extends Config> = Omit<T, 'theme'> & {
  theme: UnwrapResolvables<T['theme']>
}

declare function resolveConfig<T extends Config>(config: T): ResolvedConfig<T>
export = resolveConfig
