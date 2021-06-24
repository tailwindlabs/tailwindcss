import { addBaseSelector } from './filter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    if (config('mode') === 'jit') {
      matchUtilities(
        {
          grayscale: (value, { selector }) => {
            addBaseSelector(memory, selector)

            return {
              '--tw-grayscale': `grayscale(${value})`,
              filter: 'var(--tw-filter)',
            }
          },
        },
        {
          values: theme('grayscale'),
          variants: variants('grayscale'),
          type: 'any',
        }
      )
    } else {
      matchUtilities(
        {
          grayscale: (value) => {
            return {
              '--tw-grayscale': `grayscale(${value})`,
              ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
            }
          },
        },
        {
          values: theme('grayscale'),
          variants: variants('grayscale'),
          type: 'any',
        }
      )
    }
  }
}
