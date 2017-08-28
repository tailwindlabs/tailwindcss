import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'fixed': { position: 'fixed' },
    'absolute': { position: 'absolute' },
    'relative': { position: 'relative' },
    'pin-t': { top: 0 },
    'pin-r': { right: 0 },
    'pin-b': { bottom: 0 },
    'pin-l': { left: 0 },
    'pin-y': { top: 0, bottom: 0 },
    'pin-x': { right: 0, left: 0 },
    'pin': { top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' },
  })
}
