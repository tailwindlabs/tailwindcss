import type { Theme } from '../../theme'
import defaultTheme from '../default-theme'
import type { UserConfig } from './types'

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
        fontSize: ({ theme }) => ({
          ...theme('text', {}),
        }),

        boxShadow: ({ theme }) => ({
          ...theme('shadow', {}),
        }),

        animation: ({ theme }) => ({
          ...theme('animate', {}),
        }),

        aspectRatio: ({ theme }) => ({
          ...theme('aspect', {}),
        }),

        borderRadius: ({ theme }) => ({
          ...theme('radius', {}),
        }),

        screens: ({ theme }) => ({
          ...theme('breakpoint', {}),
        }),

        letterSpacing: ({ theme }) => ({
          ...theme('tracking', {}),
        }),

        lineHeight: ({ theme }) => ({
          ...theme('leading', {}),
        }),

        transitionDuration: {
          DEFAULT: cssTheme.get(['--default-transition-duration']) ?? null,
        },

        transitionTimingFunction: {
          DEFAULT: cssTheme.get(['--default-transition-timing-function']) ?? null,
        },

        maxWidth: ({ theme }) => ({
          ...theme('container', {}),
        }),
      },
    },
  }
}
