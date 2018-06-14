import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'border-collapse': { 'border-collapse': 'collapse' },
    'border-separate': { 'border-collapse': 'separate' },
  })
}
