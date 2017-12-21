import defineClasses from '../util/defineClasses'

export default function({ naming: { resize: ns } }) {
  return defineClasses({
    [ns.resizeNone]: { resize: 'none' },
    [ns.resizeY]: { resize: 'vertical' },
    [ns.resizeX]: { resize: 'horizontal' },
    [ns.resize]: { resize: 'both' },
  })
}
