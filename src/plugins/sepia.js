import { addBaseSelector } from './filter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    if (config('mode') === 'jit') {
      matchUtilities(
        {
          sepia: (value, { selector }) => {
            addBaseSelector(memory, selector)

            return {
              '--tw-sepia': `sepia(${value})`,
              filter: 'var(--tw-filter)',
            }
          },
        },
        {
          values: theme('sepia'),
          variants: variants('sepia'),
          type: 'any',
        }
      )
    } else {
      matchUtilities(
        {
          sepia: (value) => {
            return {
              '--tw-sepia': `sepia(${value})`,
              ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
            }
          },
        },
        { values: theme('sepia'), variants: variants('sepia'), type: 'any' }
      )
    }
  }
}
