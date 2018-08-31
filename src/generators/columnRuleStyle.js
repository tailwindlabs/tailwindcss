import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'col-solid': {
      'column-rule-style': 'solid',
    },
    'col-dashed': {
      'column-rule-style': 'dashed',
    },
    'col-dotted': {
      'column-rule-style': 'dotted',
    },
    'col-none': {
      'column-rule-style': 'none',
    },
  })
}
