import { addBaseSelector } from './filter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    if (config('mode') === 'jit') {
      matchUtilities(
        {
          saturate: (value, { selector }) => {
            addBaseSelector(memory, selector)

            return {
              '--tw-saturate': `saturate(${value})`,
              filter: 'var(--tw-filter)',
            }
          },
        },
        {
          values: theme('saturate'),
          variants: variants('saturate'),
          type: 'any',
        }
      )
    } else {
      matchUtilities(
        {
          saturate: (value) => {
            return {
              '--tw-saturate': `saturate(${value})`,
              ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
            }
          },
        },
        {
          values: theme('saturate'),
          variants: variants('saturate'),
          type: 'any',
        }
      )
    }
  }
}
