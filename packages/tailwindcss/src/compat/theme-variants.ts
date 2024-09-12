import type { PluginAPI } from '../plugin-api'

export function themeVariantsPlugin({ addVariant, config }: PluginAPI) {
  let ariaVariants = config('theme.aria', {})
  let supportsVariants = config('theme.supports', {})
  let dataVariants = config('theme.data', {})

  for (let [name, rule] of Object.entries(ariaVariants)) {
    addVariant(`aria-${name}`, `&[aria-${rule}]`)
  }

  for (let [name, rule] of Object.entries(supportsVariants)) {
    addVariant(`supports-${name}`, `@supports (${rule})`)
  }

  for (let [name, rule] of Object.entries(dataVariants)) {
    addVariant(`data-${name}`, `&[data-${rule}]`)
  }
}
