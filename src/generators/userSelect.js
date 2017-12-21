import defineClasses from '../util/defineClasses'

export default function({ naming: { userSelect: ns } }) {
  return defineClasses({
    [ns.selectNone]: { 'user-select': 'none' },
    [ns.selectText]: { 'user-select': 'text' },
  })
}
