import type { Theme } from '../../theme'
import defaultTheme from '../default-theme'
import type { PluginUtils } from './resolve-config'
import type { UserConfig } from './types'

/**
 * Returns a theme value that is safe to spread into an object.
 *
 * Depending on how `theme()` resolves a namespace, a `DEFAULT` entry may be
 * returned as a primitive string instead of an object. This helper wraps such
 * values in `{ DEFAULT: ... }` so callers can safely spread the result.
 */
export function spreadTheme(theme: PluginUtils['theme'], path: string): Record<string, string> {
  let value = theme(path, {})

  if (typeof value === 'string') {
    return { DEFAULT: value }
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { ...value } as Record<string, string>
  }

  return {}
}

export function createCompatConfig(cssTheme: Theme): UserConfig {
  return {
    theme: {
      ...defaultTheme,

      // In the defaultTheme config, the `colors` key is not a function but a
      // shallow object. We don't want to define the color namespace unless it
      // is in the CSS theme so here we explicitly overwrite the defaultTheme
      // and only allow colors from the CSS theme.
      colors: ({ theme }) => theme('color', {}),

      extend: {
        fontSize: ({ theme }) => spreadTheme(theme, 'text'),

        boxShadow: ({ theme }) => spreadTheme(theme, 'shadow'),

        animation: ({ theme }) => spreadTheme(theme, 'animate'),

        aspectRatio: ({ theme }) => spreadTheme(theme, 'aspect'),

        borderRadius: ({ theme }) => spreadTheme(theme, 'radius'),

        screens: ({ theme }) => spreadTheme(theme, 'breakpoint'),

        letterSpacing: ({ theme }) => spreadTheme(theme, 'tracking'),

        lineHeight: ({ theme }) => spreadTheme(theme, 'leading'),

        transitionDuration: {
          DEFAULT: cssTheme.get(['--default-transition-duration']) ?? null,
        },

        transitionTimingFunction: {
          DEFAULT: cssTheme.get(['--default-transition-timing-function']) ?? null,
        },

        maxWidth: ({ theme }) => spreadTheme(theme, 'container'),
      },
    },
  }
}
