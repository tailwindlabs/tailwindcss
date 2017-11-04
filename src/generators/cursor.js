import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'cursor-auto': { cursor: 'auto' },
    'cursor-pointer': { cursor: 'pointer' },
    'cursor-not-allowed': { cursor: 'not-allowed' }
  })
}
