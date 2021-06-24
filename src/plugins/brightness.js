import { addBaseSelector } from './filter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    if (config('mode') === 'jit') {
      matchUtilities(
        {
          brightness: (value, { selector }) => {
            addBaseSelector(memory, selector)

            return {
              '--tw-brightness': `brightness(${value})`,
              filter: 'var(--tw-filter)',
            }
          },
        },
        {
          values: theme('brightness'),
          variants: variants('brightness'),
          type: 'any',
        }
      )
    } else {
      matchUtilities(
        {
          brightness: (value) => {
            return {
              '--tw-brightness': `brightness(${value})`,
              ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
            }
          },
        },
        {
          values: theme('brightness'),
          variants: variants('brightness'),
          type: 'any',
        }
      )
    }
  }
}
