import { addBaseSelector } from './filter'

export default function () {
  return function ({ config, matchUtilities, theme, variants, memory }) {
    if (config('mode') === 'jit') {
      matchUtilities(
        {
          contrast: (value, { selector }) => {
            addBaseSelector(memory, selector)

            return {
              '--tw-contrast': `contrast(${value})`,
              filter: 'var(--tw-filter)',
            }
          },
        },
        {
          values: theme('contrast'),
          variants: variants('contrast'),
          type: 'any',
        }
      )
    } else {
      matchUtilities(
        {
          contrast: (value) => {
            return {
              '--tw-contrast': `contrast(${value})`,
              ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
            }
          },
        },
        {
          values: theme('contrast'),
          variants: variants('contrast'),
          type: 'any',
        }
      )
    }
  }
}
