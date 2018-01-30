import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'appearance-none': {
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none',
    },
  })
}
