import type { Plugin, PluginWithConfig } from '../../plugin-api'
import type { PluginUtils } from './resolve-config'

export type ResolvableTo<T> = T | ((utils: PluginUtils) => T)

export interface UserConfig {
  presets?: UserConfig[]
  theme?: ThemeConfig
  plugins?: Plugin[]
}

export type ThemeValue = ResolvableTo<Record<string, unknown>> | null | undefined
export type ResolvedThemeValue = Record<string, unknown> | null

export type ThemeConfig = Record<string, ThemeValue> & {
  extend?: Record<string, ThemeValue>
}

export interface ResolvedConfig {
  theme: Record<string, Record<string, unknown>>
  plugins: PluginWithConfig[]
}

// Content support
type ContentFile = string | { raw: string; extension?: string }

export interface UserConfig {
  content?: ContentFile[] | { files: ContentFile[] }
}

type ResolvedContent =
  | { base: string, pattern: string }
  | { raw: string; extension?: string }

export interface ResolvedContentConfig {
  files: ResolvedContent[],
}

export interface ResolvedConfig {
  content: ResolvedContentConfig
}
