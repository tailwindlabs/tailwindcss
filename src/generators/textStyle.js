import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'text-em': { 'font-style': 'italic' },
    'text-uppercase': { 'text-transform': 'uppercase' },
    'text-lowercase': { 'text-transform': 'lowercase' },
    'text-capitalize': { 'text-transform': 'capitalize' },
    'text-underline': { 'text-decoration': 'underline' },
    'text-strike': { 'text-decoration': 'line-through' },
    'text-smooth': {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    'text-normal': {
      'text-decoration': 'none',
      'text-transform': 'none',
      'font-style': 'normal',
    },
  })
}
