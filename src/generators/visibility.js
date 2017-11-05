import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    visible: { visibility: 'visible' },
    invisible: { visibility: 'hidden' },
  })
}
