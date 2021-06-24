import { addBaseSelector } from './backdropFilter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    matchUtilities(
      {
        'backdrop-hue-rotate': (value, { selector }) => {
          if (config('mode') === 'jit') {
            addBaseSelector(memory, selector)
          }

          return {
            '--tw-backdrop-hue-rotate': `hue-rotate(${value})`,
            ...(config('mode') === 'jit' ? { 'backdrop-filter': 'var(--tw-backdrop-filter)' } : {}),
          }
        },
      },
      {
        values: theme('backdropHueRotate'),
        variants: variants('backdropHueRotate'),
        type: 'any',
      }
    )
  }
}
