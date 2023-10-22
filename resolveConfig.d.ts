import { Config, ResolvableTo } from './types/config'
import { DefaultTheme } from './types/generated/default-theme'
import { DefaultColors } from './types/generated/colors'

type ResolvedConfig<T extends Config> = Omit<T, 'theme'> & {
  theme: MergeThemes<UnwrapResolvables<T['theme']>, UnwrapResolvables<T['theme']['extend']>>
}

type UnwrapResolvables<T> = {
  [K in keyof T]: T[K] extends ResolvableTo<infer R> ? R : T[K]
}

type DefaultThemeFull = Omit<DefaultTheme, 'extend'> & { colors: DefaultColors }

type MergeThemes<Overrides extends object, Extensions extends object> = {
  [K in keyof DefaultThemeFull]:
    (K extends keyof Overrides ? Overrides[K] : DefaultThemeFull[K])
    & (K extends keyof Extensions ? Extensions[K] : {})
}

declare function resolveConfig<T extends Config>(config: T): ResolvedConfig<T>
export = resolveConfig
