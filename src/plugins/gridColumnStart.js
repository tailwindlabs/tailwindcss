import _ from 'lodash'
import extractGridLineNames from '../util/extractGridLineNames'

export default function() {
  return function({ addUtilities, target, theme, variants }) {
    if (target('gridColumnStart') === 'ie11') {
      return
    }

    const utilities = _.fromPairs(
      _.map(theme('gridColumnStart'), value => {
        return [
          `.col-start-${value}`,
          {
            'grid-column-start': value,
          },
        ]
      })
    )

    const namedLines = _.fromPairs(
      _.map(extractGridLineNames(theme('gridTemplateColumns')), name => [
        `.col-start-${name}`,
        {
          'grid-column-start': name,
        },
      ])
    )

    addUtilities({ ...utilities, ...namedLines }, variants('gridColumnStart'))
  }
}
