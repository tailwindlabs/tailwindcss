import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function() {
  return function({ addUtilities, e, theme, variants, target, corePlugins }) {
    const colors = flattenColorPalette(theme('borderColor'))

    const getProperties = (property, value) => {
      if (target('borderColor') === 'ie11') {
        return { [property]: value }
      }

      if (corePlugins('borderOpacity')) {
        return withAlphaVariable({
          color: value,
          property,
          variable: '--border-opacity',
        })
      }

      return { borderColor: value }
    }

    const generators = [
      function generateBorderColor(value, modifier) {
        return {
          [`.${e(`border${modifier}`)}`]: getProperties('border-color', value),
        }
      },
      function generateBorderColorPerThingy(value, modifier) {
        return {
          [`.${e(`border-t${modifier}`)}`]: getProperties('borderTopColor', value), // { borderTopColor: `${value}` },
          [`.${e(`border-r${modifier}`)}`]: getProperties('borderRightColor', value), // { borderRightColor: `${value}` },
          [`.${e(`border-b${modifier}`)}`]: getProperties('borderBottomColor', value), // { borderBottomColor: `${value}` },
          [`.${e(`border-l${modifier}`)}`]: getProperties('borderLeftColor', value), // { borderLeftColor: `${value}` },
        }
      },
    ]

    const utilities = _.flatMap(generators, (generator) => {
      return _.flatMap(colors, (value, modifier) => {
        return generator(value, modifier === 'default' ? '' : `-${modifier}`)
      })
    })

    addUtilities(utilities, variants('border'))
  }
}
