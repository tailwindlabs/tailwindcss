import defineClasses from '../util/defineClasses'

export default function({ naming: { position: ns } }) {
  return defineClasses({
    [ns.static]: { position: 'static' },
    [ns.fixed]: { position: 'fixed' },
    [ns.absolute]: { position: 'absolute' },
    [ns.relative]: { position: 'relative' },
    [ns.pinNone]: {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
    },
    [ns.pin]: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    [ns.pinY]: { top: 0, bottom: 0 },
    [ns.pinX]: { right: 0, left: 0 },
    [ns.pinT]: { top: 0 },
    [ns.pinR]: { right: 0 },
    [ns.pinB]: { bottom: 0 },
    [ns.pinL]: { left: 0 },
  })
}
