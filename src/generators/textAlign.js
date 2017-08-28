import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'text-left': { 'text-align': 'left' },
    'text-center': { 'text-align': 'center' },
    'text-right': { 'text-align': 'right' },
    'text-justify': { 'text-align': 'justify' },
  })
}
