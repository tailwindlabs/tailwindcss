import _ from 'lodash'

export default function() {
  return function({ addUtilities, variants }) {
    const actions = [
      'none',
      'auto',
      'pan-x',
      'pan-left',
      'pan-right',
      'pan-y',
      'pan-up',
      'pan-down',
      'pinch-zoom',
      'manipulation',
    ]
    const utilities = _.map(actions, action => ({
      [`.touch-${action}`]: {
        'touch-action': action,
      },
    }))
    addUtilities(utilities, variants('touchActions'))
  }
}
