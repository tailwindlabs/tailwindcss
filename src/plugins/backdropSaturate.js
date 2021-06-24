import { addBaseSelector } from './backdropFilter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    matchUtilities(
      {
        'backdrop-saturate': (value, { selector }) => {
          if (config('mode') === 'jit') {
            addBaseSelector(memory, selector)
          }

          return {
            '--tw-backdrop-saturate': `saturate(${value})`,
            ...(config('mode') === 'jit' ? { 'backdrop-filter': 'var(--tw-backdrop-filter)' } : {}),
          }
        },
      },
      {
        values: theme('backdropSaturate'),
        variants: variants('backdropSaturate'),
        type: 'any',
      }
    )
  }
}
