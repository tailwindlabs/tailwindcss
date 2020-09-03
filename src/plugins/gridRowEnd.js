import _ from 'lodash'
import extractGridLineNames from '../util/extractGridLineNames'

export default function() {
  return function({ addUtilities, target, theme, variants }) {
    if (target('gridRowEnd') === 'ie11') {
      return
    }

    const utilities = _.fromPairs(
      _.map(theme('gridRowEnd'), value => {
        return [
          `.row-end-${value}`,
          {
            'grid-row-end': value,
          },
        ]
      })
    )

    const namedLines = _.fromPairs(
      _.map(extractGridLineNames(theme('gridTemplateRows')), name => [
        `.row-end-${name}`,
        {
          'grid-row-end': name,
        },
      ])
    )

    addUtilities({ ...utilities, ...namedLines }, variants('gridRowEnd'))
  }
}
