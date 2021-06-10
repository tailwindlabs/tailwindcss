import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ config, addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('dropShadow'), (value, modifier) => {
        return [
          nameClass('drop-shadow', modifier),
          {
            '--tw-drop-shadow': Array.isArray(value)
              ? value.map((v) => `drop-shadow(${v})`).join(' ')
              : `drop-shadow(${value})`,
            ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
          },
        ]
      })
    )

    addUtilities(utilities, variants('dropShadow'))
  }
}
