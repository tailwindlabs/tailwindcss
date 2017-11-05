import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'pointer-events-none': { 'pointer-events': 'none' },
    'pointer-events-auto': { 'pointer-events': 'auto' },
  })
}
