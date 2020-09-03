import _ from 'lodash'
import extractGridLineNames from '../util/extractGridLineNames'

export default function() {
  return function({ addUtilities, target, theme, variants }) {
    if (target('gridColumnEnd') === 'ie11') {
      return
    }

    const utilities = _.fromPairs(
      _.map(theme('gridColumnEnd'), value => {
        return [
          `.col-end-${value}`,
          {
            'grid-column-end': value,
          },
        ]
      })
    )

    const namedLines = _.fromPairs(
      _.map(extractGridLineNames(theme('gridTemplateColumns')), name => [
        `.col-end-${name}`,
        {
          'grid-column-end': name,
        },
      ])
    )

    addUtilities({ ...utilities, ...namedLines }, variants('gridColumnEnd'))
  }
}
