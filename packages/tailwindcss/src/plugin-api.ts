import type { DesignSystem } from './design-system'
import { DefaultMap } from './utils/default-map'

export function buildPluginApi(designSystem: DesignSystem) {
  return {
    theme(path: string, fallback?: any) {
      if (path.startsWith('--')) {
        if (path.endsWith('-*')) {
          return Object.fromEntries(
            designSystem.theme.namespace(path.slice(0, -2) as any).entries(),
          )
        }

        return designSystem.theme.resolveValue(null, [path] as any) ?? fallback ?? null
      }

      let original = path
        // Escape dots used inside square brackets
        .replace(/\[(.*?)\]/g, (_, value) => `-${value.replace('.', '_')}`)
        // Replace dots with dashes
        .replace(/\./g, '-')
        // Replace camelCase with dashes
        .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`)

      // Perform an "upgrade" on the path so that, for example, a request for
      // accentColor merges values from --color-* and --accent-color-*
      let paths: string[] = []

      for (let prefix in themeUpgradeMap) {
        if (!original.startsWith(prefix)) continue

        // This makes sure that:
        // `accent-color` is turned into `color`; AND
        // `accent-color-foo` is turned into `color-foo`
        let suffix = original.slice(prefix.length)

        for (let upgrade of themeUpgradeMap[prefix]) {
          paths.push(upgrade + suffix)
        }
      }

      // Make sure the original path is included last because it should take precedence
      paths.push(original)

      type ThemeValue =
        // A normal string value
        | string

        // A nested tuple with additional data
        | [main: string, extra: Record<string, string>]

      let map = new Map<string | null, ThemeValue>()
      let nested = new DefaultMap<string | null, Map<string, string>>(() => new Map())

      for (let path of paths) {
        let ns = designSystem.theme.namespace(`--${path}` as any)

        for (let [key, value] of ns) {
          // Non-nested values can be set directly
          if (!key || !key.includes('--')) {
            map.set(key, value)
            continue
          }

          // Nested values are stored separately
          let nestedIndex = key.indexOf('--')

          let mainKey = key.slice(0, nestedIndex)
          let nestedKey = key.slice(nestedIndex + 2)

          // Make `nestedKey` camel case:
          nestedKey = nestedKey.replace(/-([a-z])/g, (_, a) => a.toUpperCase())

          nested.get(mainKey === '' ? null : mainKey).set(nestedKey, value)
        }
      }

      for (let [key, extra] of nested) {
        let value = map.get(key)
        if (typeof value !== 'string') continue

        map.set(key, [value, Object.fromEntries(extra)])
      }

      // Now we've got the "upgraded" list of theme values let's look for the requested value

      // Does the requested value exist in the theme
      if (map.has(null)) {
        // Yes, and there are multiple values in the requested theme namespace
        if (map.size > 1) {
          return {
            DEFAULT: map.get(null),
            ...Object.fromEntries(Array.from(map.entries()).filter(([key]) => key !== null)),
          }
        }

        // Nope, just the one
        return map.get(null)
      }

      // There is at least one value in the requested theme namespace
      // but no default value
      if (map.size > 0) {
        return Object.fromEntries(map)
      }

      return fallback ?? null
    },
  }
}

let themeUpgradeMap: Record<string, string[]> = {
  'accent-color': ['color'],
  'backdrop-blur': ['blur'],
  'backdrop-brightness': ['brightness'],
  'backdrop-contrast': ['contrast'],
  'backdrop-grayscale': ['grayscale'],
  'backdrop-hue-rotate': ['hue-rotate'],
  'backdrop-invert': ['invert'],
  'backdrop-opacity': ['opacity'],
  'backdrop-saturate': ['saturate'],
  'backdrop-sepia': ['sepia'],
  'background-color': ['color'],
  'background-opacity': ['opacity'],
  'border-color': ['color'],
  'border-opacity': ['opacity'],
  'border-spacing': ['spacing'],
  'box-shadow-color': ['color'],
  'caret-color': ['color'],
  colors: ['color'],
  'divide-color': ['border-color', 'color'],
  'divide-opacity': ['border-opacity', 'opacity'],
  'divide-width': ['border-width'],
  fill: ['color'],
  'flex-basis': ['spacing'],
  gap: ['spacing'],
  'gradient-color-stops': ['color'],
  height: ['spacing'],
  inset: ['spacing'],
  margin: ['spacing'],
  'max-height': ['spacing'],
  'max-width': ['spacing', 'breakpoint'],
  'min-height': ['spacing'],
  'min-width': ['spacing'],
  'outline-color': ['color'],
  padding: ['spacing'],
  'placeholder-color': ['color'],
  'placeholder-opacity': ['opacity'],
  'ring-color': ['color'],
  'ring-offset-color': ['color'],
  'ring-opacity': ['opacity'],
  screens: ['breakpoint'],
  'scroll-margin': ['spacing'],
  'scroll-padding': ['spacing'],
  space: ['spacing'],
  stroke: ['color'],
  'text-color': ['color'],
  'text-decoration-color': ['color'],
  'text-indent': ['spacing'],
  'text-opacity': ['opacity'],
  translate: ['spacing'],
  size: ['spacing'],
  width: ['spacing'],
}
