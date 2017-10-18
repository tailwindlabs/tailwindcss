import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'wrap': { 'white-space': 'normal' },
    'no-wrap': { 'white-space': 'nowrap' },
    'pre': { 'white-space': 'pre' },
    'pre-line': { 'white-space': 'pre-line' },
    'pre-wrap': { 'white-space': 'pre-wrap' },
    'break-words': { 'word-wrap': 'break-word' },
    'break-normal': { 'word-wrap': 'normal' },
    'truncate': {
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
  })
}
