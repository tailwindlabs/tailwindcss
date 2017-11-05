import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'select-none': { 'user-select': 'none' },
    'select-text': { 'user-select': 'text' },
  })
}
