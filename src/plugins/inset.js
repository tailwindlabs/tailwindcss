import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        inset: (modifier, { theme }) => {
          let value = asValue(modifier, theme['inset'])

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('inset', modifier)]: {
              top: value,
              right: value,
              bottom: value,
              left: value,
            },
          }
        },
      })
      matchUtilities({
        'inset-x': (modifier, { theme }) => {
          let value = asValue(modifier, theme['inset'])

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('inset-x', modifier)]: { left: value, right: value },
          }
        },
        'inset-y': (modifier, { theme }) => {
          let value = asValue(modifier, theme['inset'])

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('inset-y', modifier)]: { top: value, bottom: value },
          }
        },
      })
      matchUtilities({
        top: (modifier, { theme }) => {
          let value = asValue(modifier, theme['inset'])

          if (value === undefined) {
            return []
          }

          return { [nameClass('top', modifier)]: { top: value } }
        },
        right: (modifier, { theme }) => {
          let value = asValue(modifier, theme['inset'])

          if (value === undefined) {
            return []
          }

          return { [nameClass('right', modifier)]: { right: value } }
        },
        bottom: (modifier, { theme }) => {
          let value = asValue(modifier, theme['inset'])

          if (value === undefined) {
            return []
          }

          return { [nameClass('bottom', modifier)]: { bottom: value } }
        },
        left: (modifier, { theme }) => {
          let value = asValue(modifier, theme['inset'])

          if (value === undefined) {
            return []
          }

          return { [nameClass('left', modifier)]: { left: value } }
        },
      })
    } else {
      const generators = [
        (size, modifier) => ({
          [nameClass('inset', modifier)]: {
            top: `${size}`,
            right: `${size}`,
            bottom: `${size}`,
            left: `${size}`,
          },
        }),
        (size, modifier) => ({
          [nameClass('inset-y', modifier)]: {
            top: `${size}`,
            bottom: `${size}`,
          },
          [nameClass('inset-x', modifier)]: {
            right: `${size}`,
            left: `${size}`,
          },
        }),
        (size, modifier) => ({
          [nameClass('top', modifier)]: { top: `${size}` },
          [nameClass('right', modifier)]: { right: `${size}` },
          [nameClass('bottom', modifier)]: { bottom: `${size}` },
          [nameClass('left', modifier)]: { left: `${size}` },
        }),
      ]

      const utilities = _.flatMap(generators, (generator) => {
        return _.flatMap(theme('inset'), generator)
      })

      addUtilities(utilities, variants('inset'))
    }
  }
}
