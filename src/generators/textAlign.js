import defineClasses from '../util/defineClasses'

export default function({ naming: { textAlign: ns } }) {
  return defineClasses({
    [ns.left]: { 'text-align': 'left' },
    [ns.center]: { 'text-align': 'center' },
    [ns.right]: { 'text-align': 'right' },
    [ns.justify]: { 'text-align': 'justify' },
  })
}
