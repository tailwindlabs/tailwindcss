import { Config, ResolvableTo } from './types/config'
import { DefaultTheme } from './types/generated/default-theme'
import { DefaultColors } from './types/generated/colors'

type ResolvedConfig<T extends Config> = Omit<T, 'theme'> & {
  theme: MergeThemes<UnwrapResolvables<T['theme']>, UnwrapResolvables<T['theme']['extend']>>
}

type UnwrapResolvables<T> = {
  [K in keyof T]: T[K] extends ResolvableTo<infer R> ? R : T[K]
}

type DefaultThemeFull = DefaultTheme & { colors: DefaultColors }

type MergeThemes<T extends Config['theme'], E extends Config['theme']['extend']> = {
  [K in keyof DefaultThemeFull]: (K extends keyof T ? T[K] : DefaultThemeFull[K])
    & (K extends keyof E ? E[K] : {})
}

declare function resolveConfig<T extends Config>(config: T): ResolvedConfig<T>
export = resolveConfig
