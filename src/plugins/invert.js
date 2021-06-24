import { addBaseSelector } from './filter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    if (config('mode') === 'jit') {
      matchUtilities(
        {
          invert: (value, { selector }) => {
            addBaseSelector(memory, selector)

            return {
              '--tw-invert': `invert(${value})`,
              filter: 'var(--tw-filter)',
            }
          },
        },
        {
          values: theme('invert'),
          variants: variants('invert'),
          type: 'any',
        }
      )
    } else {
      matchUtilities(
        {
          invert: (value) => {
            return {
              '--tw-invert': `invert(${value})`,
              ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
            }
          },
        },
        {
          values: theme('invert'),
          variants: variants('invert'),
          type: 'any',
        }
      )
    }
  }
}
