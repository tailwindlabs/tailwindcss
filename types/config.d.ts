import type { CorePluginList } from './generated/corePluginList'
import type { DefaultColors } from './generated/colors'

// Helpers
type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T
type KeyValuePair<K extends keyof any = string, V = string> = Record<K, V>
interface RecursiveKeyValuePair<K extends keyof any = string, V = string> {
  [key: string]: V | RecursiveKeyValuePair<K, V>
}
type ResolvableTo<T> = T | ((utils: PluginUtils) => T)
type CSSRuleObject = RecursiveKeyValuePair<string, string | string[]>

interface PluginUtils {
  colors: DefaultColors
  theme(path: string, defaultValue?: unknown): any
  breakpoints<I = Record<string, unknown>, O = I>(arg: I): O
  rgb(arg: string): (arg: Partial<{ opacityVariable: string; opacityValue: number }>) => string
  hsl(arg: string): (arg: Partial<{ opacityVariable: string; opacityValue: number }>) => string
}

// Content related config
type FilePath = string
type RawFile = { raw: string; extension?: string }
type ExtractorFn = (content: string) => string[]
type TransformerFn = (content: string) => string
type ContentConfig =
  | (FilePath | RawFile)[]
  | {
      files: (FilePath | RawFile)[]
      extract?: ExtractorFn | { [extension: string]: ExtractorFn }
      transform?: TransformerFn | { [extension: string]: TransformerFn }
    }

// Important related config
type ImportantConfig = boolean | string

// Prefix related config
type PrefixConfig = string

// Separator related config
type SeparatorConfig = string

// Safelist related config
type SafelistConfig =
  | string[]
  | {
      pattern: RegExp
      variants: string[]
    }[]

// Presets related config
type PresetsConfig = Config[]

// Future related config
type FutureConfigValues = never // Replace with 'future-feature-1' | 'future-feature-2'
type FutureConfig = Expand<'all' | Partial<Record<FutureConfigValues, boolean>>> | []

// Experimental related config
type ExperimentalConfigValues = 'optimizeUniversalDefaults' // Replace with 'experimental-feature-1' | 'experimental-feature-2'
type ExperimentalConfig = Expand<'all' | Partial<Record<ExperimentalConfigValues, boolean>>> | []

// DarkMode related config
type DarkModeConfig =
  // Use the `media` query strategy.
  | 'media'
  // Use the `class` stategy, which requires a `.dark` class on the `html`.
  | 'class'
  // Use the `class` stategy with a custom class instead of `.dark`.
  | ['class', string]

type Screen = { raw: string } | { min: string } | { max: string } | { min: string; max: string }
type ScreensConfig = string[] | KeyValuePair<string, string | Screen | Screen[]>

// Theme related config
interface ThemeConfig {
  // Responsiveness
  screens: ResolvableTo<ScreensConfig>

  // Reusable base configs
  colors: ResolvableTo<RecursiveKeyValuePair>
  spacing: ResolvableTo<KeyValuePair>

  // Components
  container: ResolvableTo<
    Partial<{
      screens: ScreensConfig
      center: boolean
      padding: string | Record<string, string>
    }>
  >

  // Utilities
  inset: ThemeConfig['spacing']
  zIndex: ResolvableTo<KeyValuePair>
  order: ResolvableTo<KeyValuePair>
  gridColumn: ResolvableTo<KeyValuePair>
  gridColumnStart: ResolvableTo<KeyValuePair>
  gridColumnEnd: ResolvableTo<KeyValuePair>
  gridRow: ResolvableTo<KeyValuePair>
  gridRowStart: ResolvableTo<KeyValuePair>
  gridRowEnd: ResolvableTo<KeyValuePair>
  margin: ThemeConfig['spacing']
  aspectRatio: ResolvableTo<KeyValuePair>
  height: ThemeConfig['spacing']
  maxHeight: ThemeConfig['spacing']
  minHeight: ResolvableTo<KeyValuePair>
  width: ThemeConfig['spacing']
  maxWidth: ResolvableTo<KeyValuePair>
  minWidth: ResolvableTo<KeyValuePair>
  flex: ResolvableTo<KeyValuePair>
  flexShrink: ResolvableTo<KeyValuePair>
  flexGrow: ResolvableTo<KeyValuePair>
  flexBasis: ThemeConfig['spacing']
  borderSpacing: ThemeConfig['spacing']
  transformOrigin: ResolvableTo<KeyValuePair>
  translate: ThemeConfig['spacing']
  rotate: ResolvableTo<KeyValuePair>
  skew: ResolvableTo<KeyValuePair>
  scale: ResolvableTo<KeyValuePair>
  animation: ResolvableTo<KeyValuePair>
  keyframes: ResolvableTo<KeyValuePair<string, KeyValuePair<string, KeyValuePair>>>
  cursor: ResolvableTo<KeyValuePair>
  scrollMargin: ThemeConfig['spacing']
  scrollPadding: ThemeConfig['spacing']
  listStyleType: ResolvableTo<KeyValuePair>
  columns: ResolvableTo<KeyValuePair>
  gridAutoColumns: ResolvableTo<KeyValuePair>
  gridAutoRows: ResolvableTo<KeyValuePair>
  gridTemplateColumns: ResolvableTo<KeyValuePair>
  gridTemplateRows: ResolvableTo<KeyValuePair>
  gap: ThemeConfig['spacing']
  space: ThemeConfig['spacing']
  divideWidth: ThemeConfig['borderWidth']
  divideColor: ThemeConfig['borderColor']
  divideOpacity: ThemeConfig['borderOpacity']
  borderRadius: ResolvableTo<KeyValuePair>
  borderWidth: ResolvableTo<KeyValuePair>
  borderColor: ThemeConfig['colors']
  borderOpacity: ThemeConfig['opacity']
  backgroundColor: ThemeConfig['colors']
  backgroundOpacity: ThemeConfig['opacity']
  backgroundImage: ResolvableTo<KeyValuePair>
  gradientColorStops: ThemeConfig['colors']
  backgroundSize: ResolvableTo<KeyValuePair>
  backgroundPosition: ResolvableTo<KeyValuePair>
  fill: ThemeConfig['colors']
  stroke: ThemeConfig['colors']
  strokeWidth: ResolvableTo<KeyValuePair>
  objectPosition: ResolvableTo<KeyValuePair>
  padding: ThemeConfig['spacing']
  textIndent: ThemeConfig['spacing']
  fontFamily: ResolvableTo<KeyValuePair<string, string[]>>
  fontSize: ResolvableTo<
    KeyValuePair<
      string,
      | string
      | [fontSize: string, lineHeight: string]
      | [
          fontSize: string,
          configuration: Partial<{
            lineHeight: string
            letterSpacing: string
            fontWeight: string | number
          }>
        ]
    >
  >
  fontWeight: ResolvableTo<KeyValuePair>
  lineHeight: ResolvableTo<KeyValuePair>
  letterSpacing: ResolvableTo<KeyValuePair>
  textColor: ThemeConfig['colors']
  textOpacity: ThemeConfig['opacity']
  textDecorationColor: ThemeConfig['colors']
  textDecorationThickness: ResolvableTo<KeyValuePair>
  textUnderlineOffset: ResolvableTo<KeyValuePair>
  placeholderColor: ThemeConfig['colors']
  placeholderOpacity: ThemeConfig['opacity']
  caretColor: ThemeConfig['colors']
  accentColor: ThemeConfig['colors']
  opacity: ResolvableTo<KeyValuePair>
  boxShadow: ResolvableTo<KeyValuePair>
  boxShadowColor: ThemeConfig['colors']
  outlineWidth: ResolvableTo<KeyValuePair>
  outlineOffset: ResolvableTo<KeyValuePair>
  outlineColor: ThemeConfig['colors']
  ringWidth: ResolvableTo<KeyValuePair>
  ringColor: ThemeConfig['colors']
  ringOpacity: ThemeConfig['opacity']
  ringOffsetWidth: ResolvableTo<KeyValuePair>
  ringOffsetColor: ThemeConfig['colors']
  blur: ResolvableTo<KeyValuePair>
  brightness: ResolvableTo<KeyValuePair>
  contrast: ResolvableTo<KeyValuePair>
  dropShadow: ResolvableTo<KeyValuePair>
  grayscale: ResolvableTo<KeyValuePair>
  hueRotate: ResolvableTo<KeyValuePair>
  invert: ResolvableTo<KeyValuePair>
  saturate: ResolvableTo<KeyValuePair>
  sepia: ResolvableTo<KeyValuePair>
  backdropBlur: ThemeConfig['blur']
  backdropBrightness: ThemeConfig['brightness']
  backdropContrast: ThemeConfig['contrast']
  backdropGrayscale: ThemeConfig['grayscale']
  backdropHueRotate: ThemeConfig['hueRotate']
  backdropInvert: ThemeConfig['invert']
  backdropOpacity: ThemeConfig['opacity']
  backdropSaturate: ThemeConfig['saturate']
  backdropSepia: ThemeConfig['sepia']
  transitionProperty: ResolvableTo<KeyValuePair>
  transitionTimingFunction: ResolvableTo<KeyValuePair>
  transitionDelay: ResolvableTo<KeyValuePair>
  transitionDuration: ResolvableTo<KeyValuePair>
  willChange: ResolvableTo<KeyValuePair>
  content: ResolvableTo<KeyValuePair>

  // Custom
  [key: string]: any
}

// Core plugins related config
type CorePluginsConfig = CorePluginList[] | Expand<Partial<Record<CorePluginList, boolean>>>

// Plugins related config
type ValueType =
  | 'any'
  | 'color'
  | 'url'
  | 'image'
  | 'length'
  | 'percentage'
  | 'position'
  | 'lookup'
  | 'generic-name'
  | 'family-name'
  | 'number'
  | 'line-width'
  | 'absolute-size'
  | 'relative-size'
  | 'shadow'
export interface PluginAPI {
  // for registering new static utility styles
  addUtilities(
    utilities: CSSRuleObject | CSSRuleObject[],
    options?: Partial<{
      respectPrefix: boolean
      respectImportant: boolean
    }>
  ): void
  // for registering new dynamic utility styles
  matchUtilities<T>(
    utilities: KeyValuePair<string, (value: T) => CSSRuleObject>,
    options?: Partial<{
      respectPrefix: boolean
      respectImportant: boolean
      type: ValueType | ValueType[]
      values: KeyValuePair<string, T>
      supportsNegativeValues: boolean
    }>
  ): void
  // for registering new static component styles
  addComponents(
    components: CSSRuleObject | CSSRuleObject[],
    options?: Partial<{
      respectPrefix: boolean
      respectImportant: boolean
    }>
  ): void
  // for registering new dynamic component styles
  matchComponents<T>(
    components: KeyValuePair<string, (value: T) => CSSRuleObject>,
    options?: Partial<{
      respectPrefix: boolean
      respectImportant: boolean
      type: ValueType | ValueType[]
      values: KeyValuePair<string, T>
      supportsNegativeValues: boolean
    }>
  ): void
  // for registering new base styles
  addBase(base: CSSRuleObject | CSSRuleObject[]): void
  // for registering custom variants
  addVariant(name: string, definition: string | string[] | (() => string) | (() => string)[]): void
  // for looking up values in the user’s theme configuration
  theme: <TDefaultValue = Config['theme']>(
    path?: string,
    defaultValue?: TDefaultValue
  ) => TDefaultValue
  // for looking up values in the user’s Tailwind configuration
  config: <TDefaultValue = Config>(path?: string, defaultValue?: TDefaultValue) => TDefaultValue
  // for checking if a core plugin is enabled
  corePlugins(path: string): boolean
  // for manually escaping strings meant to be used in class names
  e: (className: string) => string
}
export type PluginCreator = (api: PluginAPI) => void
export type PluginsConfig = (
  | PluginCreator
  | { handler: PluginCreator; config?: Config }
  | { (options: any): { handler: PluginCreator; config?: Config }; __isOptionsFunction: true }
)[]

// Top level config related
interface RequiredConfig {
  content: ContentConfig
}

interface OptionalConfig {
  important: Partial<ImportantConfig>
  prefix: Partial<PrefixConfig>
  separator: Partial<SeparatorConfig>
  safelist: Partial<SafelistConfig>
  presets: Partial<PresetsConfig>
  future: Partial<FutureConfig>
  experimental: Partial<ExperimentalConfig>
  darkMode: Partial<DarkModeConfig>
  theme: Partial<ThemeConfig & { extend: Partial<ThemeConfig> }>
  corePlugins: Partial<CorePluginsConfig>
  plugins: Partial<PluginsConfig>
  // Custom
  [key: string]: any
}

export type Config = RequiredConfig & Partial<OptionalConfig>
