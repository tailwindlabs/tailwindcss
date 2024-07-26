import type { DesignSystem } from './design-system'

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

      // Prepend with `--` to match CSS variables
      original = `--${original}`

      let map = designSystem.theme.namespace(original as any)

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
        return Object.fromEntries(map.entries())
      }

      return fallback ?? null
    },
  }
}

