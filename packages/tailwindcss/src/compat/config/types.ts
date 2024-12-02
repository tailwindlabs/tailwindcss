import type { Plugin, PluginWithConfig } from '../plugin-api'
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
  content?: ContentFile[] | { relative?: boolean; files: ContentFile[] }
}

type ResolvedContent = { base: string; pattern: string } | { raw: string; extension?: string }

export interface ResolvedContentConfig {
  files: ResolvedContent[]
}

export interface ResolvedConfig {
  content: ResolvedContentConfig
}

// Dark Mode support
type DarkModeStrategy =
  // No dark mode support
  | false

  // Use the `media` query strategy.
  | 'media'

  // Use the `class` strategy, which requires a `.dark` class on the `html`.
  | 'class'

  // Use the `class` strategy with a custom class instead of `.dark`.
  | ['class', string]

  // Use the `selector` strategy — same as `class` but uses `:where()` for more predicable behavior
  | 'selector'

  // Use the `selector` strategy with a custom selector instead of `.dark`.
  | ['selector', string]

  // Use the `variant` strategy, which allows you to completely customize the selector
  // It takes a string or an array of strings, which are passed directly to `addVariant()`
  | ['variant', string | string[]]

export interface UserConfig {
  darkMode?: DarkModeStrategy
}

export interface ResolvedConfig {
  darkMode: DarkModeStrategy | null
}

// `prefix` support
export interface UserConfig {
  prefix?: string
}

export interface ResolvedConfig {
  prefix: string
}

// `blocklist` support
export interface UserConfig {
  blocklist?: string[]
}

export interface ResolvedConfig {
  blocklist: string[]
}

// `important` support
export interface UserConfig {
  important?: boolean | string
}

export interface ResolvedConfig {
  important: boolean | string
}

// `future` key support
export interface UserConfig {
  future?: 'all' | Record<string, boolean>
}

export interface ResolvedConfig {
  future: Record<string, boolean>
}
