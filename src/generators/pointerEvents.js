import defineClasses from '../util/defineClasses'

export default function({ naming: { pointerEvents: ns } }) {
  return defineClasses({
    [ns.pointerNone]: { 'pointer-events': 'none' },
    [ns.pointerAuto]: { 'pointer-events': 'auto' },
  })
}
