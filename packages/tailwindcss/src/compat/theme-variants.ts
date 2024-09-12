import type { PluginAPI } from '../plugin-api'
import DefaultTheme from './default-theme'

export function themeVariantsPlugin({ addVariant, config }: PluginAPI) {
  let ariaVariants = config('theme.aria', {})
  let supportsVariants = config('theme.supports', {})
  let dataVariants = config('theme.data', {})

  for (let [name, rule] of Object.entries(DefaultTheme.aria)) {
    // `theme.aria` contains values from the default theme. We don't
    // want to create variants for these values as these are already
    // handled by the core utility.
    if (Object.hasOwn(DefaultTheme.aria, name) && ariaVariants[name] === rule) {
      continue
    }

    if (ariaVariants[name] === rule) {
      delete ariaVariants[name]
    }
  }

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
