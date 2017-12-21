import defineClasses from '../util/defineClasses'

export default function({ naming: { borderStyle: ns } }) {
  return defineClasses({
    [ns.solid]: {
      'border-style': 'solid',
    },
    [ns.dashed]: {
      'border-style': 'dashed',
    },
    [ns.dotted]: {
      'border-style': 'dotted',
    },
    [ns.none]: {
      'border-style': 'none',
    },
  })
}
