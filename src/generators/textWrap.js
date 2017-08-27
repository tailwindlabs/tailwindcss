import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'wrap-normal': { 'white-space': 'normal' },
    'wrap-none': { 'white-space': 'nowrap' },
    'wrap-pre': { 'white-space': 'pre' },
    'wrap-pre-line': { 'white-space': 'pre-line' },
    'wrap-pre-wrap': { 'white-space': 'pre-wrap' },
    'wrap-force': { 'word-wrap': 'break-word' },
    'wrap-truncate': {
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
  })
}
