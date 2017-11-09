import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'border-solid': {
      'border-style': 'solid',
    },
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
