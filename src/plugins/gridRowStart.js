import _ from 'lodash'
import extractGridLineNames from '../util/extractGridLineNames'

export default function() {
  return function({ addUtilities, target, theme, variants }) {
    if (target('gridRowStart') === 'ie11') {
      return
    }

    const utilities = _.fromPairs(
      _.map(theme('gridRowStart'), value => {
        return [
          `.row-start-${value}`,
          {
            'grid-row-start': value,
          },
        ]
      })
    )

    const namedLines = _.fromPairs(
      _.map(extractGridLineNames(theme('gridTemplateRows')), name => [
        `.row-start-${name}`,
        {
          'grid-row-start': name,
        },
      ])
    )

    addUtilities({ ...utilities, ...namedLines }, variants('gridRowStart'))
  }
}
