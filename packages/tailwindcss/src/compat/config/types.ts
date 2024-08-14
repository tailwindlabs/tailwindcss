import type { PluginAPI } from '../api'
import type { CorePluginName } from '../generated/core-utils'
import type { PluginUtils } from './utils'

export type ImportableFile = string | [path: string, options: Record<string, any>]

type FilePath = string
type RawFile = { raw: string; extension?: string }
export type RawPreset = Omit<UserConfig, 'content'>
export type Preset = RawPreset | ImportableFile
type PluginConfig = Omit<UserConfig, 'content'>

export type RawPlugin = (api: PluginAPI) => void
export type ConfigurablePlugin = {
  handler: RawPlugin
  config?: () => PluginConfig
}

export type Plugin = RawPlugin | ConfigurablePlugin | ImportableFile

export type LoadedPreset = RawPreset

export type LoadedPlugin = RawPlugin | ConfigurablePlugin

export type ContentFile = 'auto' | FilePath | RawFile

export type ContentTransform = (content: string) => string

type ContentConfig = ContentFile[] | ResolvedContentConfig

export interface ResolvedContentConfig {
  files: ContentFile[]
  transform: Record<string, ContentTransform>
}

// DarkMode related config
export type DarkModeConfig =
  // Use the `media` query strategy.
  | 'media'
  // Use the `class` strategy, which requires a `.dark` class on the `html`.
  | 'class'
  // Use the `class` strategy with a custom class instead of `.dark`.
  | ['class', string]

export type { PluginUtils }

export type ResolvableTo<T> = T | ((utils: PluginUtils) => T)

export interface UserConfig {
  important?: boolean
  content?: ContentConfig
  prefix?: string
  separator?: ':' | '_'
  darkMode?: DarkModeConfig
  presets?: Preset[]
  plugins?: Plugin[]
  theme?: ThemeConfig
  corePlugins?: Partial<Record<CorePluginName, boolean>> | CorePluginName[] | boolean
}

export type ThemeValue = ResolvableTo<Record<string, unknown>> | null | undefined
export type ResolvedThemeValue = Record<string, unknown> | null

export type ThemeConfig = Record<string, ThemeValue> & {
  extend?: Record<string, ThemeValue>
}

export interface ResolvedConfig {
  important: boolean
  content: ResolvedContentConfig
  blocklist: string[]
  prefix: string
  separator: ':' | '_'
  darkMode: DarkModeConfig
  plugins: RawPlugin[]
  theme: Record<string, Record<string, unknown>>
  corePlugins: Record<CorePluginName, boolean>
}
