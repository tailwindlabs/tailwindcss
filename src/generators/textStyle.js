import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'italic': { 'font-style': 'italic' },
    'normal': { 'font-style': 'normal' },
    'uppercase': { 'text-transform': 'uppercase' },
    'lowercase': { 'text-transform': 'lowercase' },
    'capitalize': { 'text-transform': 'capitalize' },
    'transform-none': { 'text-transform': 'none' },
    'underline': { 'text-decoration': 'underline' },
    'line-through': { 'text-decoration': 'line-through' },
    'decoration-none': { 'text-decoration': 'none' },
    'antialiased': {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale'
    },
  })
}
