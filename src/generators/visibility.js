import defineClasses from '../util/defineClasses'

export default function({ naming: { visibility: ns } }) {
  return defineClasses({
    [ns.visible]: { visibility: 'visible' },
    [ns.invisible]: { visibility: 'hidden' },
  })
}
