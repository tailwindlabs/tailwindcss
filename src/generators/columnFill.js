import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'col-auto': {
      'column-fill': 'auto',
    },
    'col-balance': {
      'column-fill': 'balance',
    },
    'col-balance-all': {
      'column-fill': 'balance-all',
    },
  })
}
