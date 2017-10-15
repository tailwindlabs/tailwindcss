import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'border-dashed': {
      'border-style': 'dashed',
    },
    'border-dotted': {
      'border-style': 'dotted',
    },
    'border-none': {
      'border-style': 'none',
    },
  })
}
