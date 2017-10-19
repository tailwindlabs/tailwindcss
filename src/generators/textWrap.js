import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'white-space-normal': { 'white-space': 'normal' },
    'white-space-nowrap': { 'white-space': 'nowrap' },
    'white-space-pre': { 'white-space': 'pre' },
    'white-space-pre-line': { 'white-space': 'pre-line' },
    'white-space-pre-wrap': { 'white-space': 'pre-wrap' },

    'break-words': { 'word-wrap': 'break-word' },
    'break-normal': { 'word-wrap': 'normal' },

    'truncate': {
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
  })
}
