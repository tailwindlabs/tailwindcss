import defineClasses from '../util/defineClasses'

export default function({ naming: { backgroundSize: ns } }) {
  return defineClasses({
    [ns.cover]: {
      'background-size': 'cover',
    },
    [ns.contain]: {
      'background-size': 'contain',
    },
  })
}
