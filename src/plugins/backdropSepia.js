import { addBaseSelector } from './backdropFilter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    matchUtilities(
      {
        'backdrop-sepia': (value, { selector }) => {
          if (config('mode') === 'jit') {
            addBaseSelector(memory, selector)
          }

          return {
            '--tw-backdrop-sepia': `sepia(${value})`,
            ...(config('mode') === 'jit' ? { 'backdrop-filter': 'var(--tw-backdrop-filter)' } : {}),
          }
        },
      },
      {
        values: theme('backdropSepia'),
        variants: variants('backdropSepia'),
        type: 'any',
      }
    )
  }
}
