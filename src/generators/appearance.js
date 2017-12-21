import defineClasses from '../util/defineClasses'

export default function({ naming: { forms: ns } }) {
  return defineClasses({
    [ns.appearanceNone]: { appearance: 'none' },
  })
}
