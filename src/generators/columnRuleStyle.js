import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'column-solid': {
      'column-rule-style': 'solid',
    },
    'column-dashed': {
      'column-rule-style': 'dashed',
    },
    'column-dotted': {
      'column-rule-style': 'dotted',
    },
    'column-none': {
      'column-rule-style': 'none',
    },
  })
}
