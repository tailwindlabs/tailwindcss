import defineClasses from '../util/defineClasses'

export default function({ naming: { cursor: ns } }) {
  return defineClasses({
    [ns.auto]: { cursor: 'auto' },
    [ns.default]: { cursor: 'default' },
    [ns.pointer]: { cursor: 'pointer' },
    [ns.notAllowed]: { cursor: 'not-allowed' },
  })
}
