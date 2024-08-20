import type { PluginUtils } from './resolve-config'

export type ResolvableTo<T> = T | ((utils: PluginUtils) => T)

export interface UserConfig {
  theme?: ThemeConfig
}

export type ThemeValue = ResolvableTo<Record<string, unknown>> | null | undefined
export type ResolvedThemeValue = Record<string, unknown> | null

export type ThemeConfig = Record<string, ThemeValue> & {
  extend?: Record<string, ThemeValue>
}

export interface ResolvedConfig {
  theme: Record<string, Record<string, unknown>>
}
