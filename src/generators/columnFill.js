import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'column-auto': {
      'column-fill': 'auto',
    },
    'column-balance': {
      'column-fill': 'balance',
    },
    'column-balance-all': {
      'column-fill': 'balance-all',
    },
  })
}
