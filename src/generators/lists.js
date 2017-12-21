import defineClasses from '../util/defineClasses'

export default function({ naming: { lists: ns } }) {
  return defineClasses({
    [ns.listReset]: {
      'list-style': 'none',
      padding: '0',
    },
  })
}
