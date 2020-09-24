import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(prefixNegativeModifiers('marker-space', modifier))} > :not(template)`]: {
          'padding-left': size === '0' ? '0px' : size
        }
      })
    ]

    const utilities = _.flatMap(generators, generator => {
      return [..._.flatMap(theme('markerSpace'), generator)]
    })

    addUtilities(utilities, variants('markerSpace'))
  }
}
