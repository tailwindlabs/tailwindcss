import { filterVars } from './filter'

export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        contrast: (value) => {
          return {
            '--tw-contrast': `contrast(${value})`,
            ...(config('mode') === 'jit' ? { filter: filterVars } : {}),
          }
        },
      },
      { values: theme('contrast'), variants: variants('contrast'), type: 'any' }
    )
  }
}
