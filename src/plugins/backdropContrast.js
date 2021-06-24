import { addBaseSelector } from './backdropFilter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    matchUtilities(
      {
        'backdrop-contrast': (value, { selector }) => {
          if (config('mode') === 'jit') {
            addBaseSelector(memory, selector)
          }

          return {
            '--tw-backdrop-contrast': `contrast(${value})`,
            ...(config('mode') === 'jit' ? { 'backdrop-filter': 'var(--tw-backdrop-filter)' } : {}),
          }
        },
      },
      {
        values: theme('backdropContrast'),
        variants: variants('backdropContrast'),
        type: 'any',
      }
    )
  }
}
