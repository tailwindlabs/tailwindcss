import { addBaseSelector } from './backdropFilter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    matchUtilities(
      {
        'backdrop-brightness': (value, { selector }) => {
          if (config('mode') === 'jit') {
            addBaseSelector(memory, selector)
          }

          return {
            '--tw-backdrop-brightness': `brightness(${value})`,
            ...(config('mode') === 'jit' ? { 'backdrop-filter': 'var(--tw-backdrop-filter)' } : {}),
          }
        },
      },
      {
        values: theme('backdropBrightness'),
        variants: variants('backdropBrightness'),
        type: 'any',
      }
    )
  }
}
