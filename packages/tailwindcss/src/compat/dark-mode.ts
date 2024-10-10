import type { ResolvedConfig } from './config/types'
import type { PluginAPI } from './plugin-api'

export function darkModePlugin({ addVariant, config }: Pick<PluginAPI, 'addVariant' | 'config'>) {
  let darkMode = config('darkMode', null) as ResolvedConfig['darkMode']
  let [mode, selector = '.dark'] = Array.isArray(darkMode) ? darkMode : [darkMode]

  if (mode === 'variant') {
    let formats

    if (Array.isArray(selector)) {
      formats = selector
    } else if (typeof selector === 'function') {
      formats = selector
    } else if (typeof selector === 'string') {
      formats = [selector]
    }

    if (Array.isArray(formats)) {
      for (let format of formats) {
        if (format === '.dark') {
          mode = false
          console.warn(
            'When using `variant` for `darkMode`, you must provide a selector.\nExample: `darkMode: ["variant", ".your-selector &"]`',
          )
        } else if (!format.includes('&')) {
          mode = false
          console.warn(
            'When using `variant` for `darkMode`, your selector must contain `&`.\nExample `darkMode: ["variant", ".your-selector &"]`',
          )
        }
      }
    }

    selector = formats as any
  }

  if (mode === null) {
    // Do nothing
  } else if (mode === 'selector') {
    // New preferred behavior
    addVariant('dark', `&:where(${selector}, ${selector} *)`)
  } else if (mode === 'media') {
    addVariant('dark', '@media (prefers-color-scheme: dark)')
  } else if (mode === 'variant') {
    addVariant('dark', selector)
  } else if (mode === 'class') {
    // Old behavior
    addVariant('dark', `&:is(${selector} *)`)
  }
}
