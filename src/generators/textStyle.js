import defineClasses from '../util/defineClasses'

export default function({ naming: { textStyle: ns } }) {
  return defineClasses({
    [ns.italic]: { 'font-style': 'italic' },
    [ns.roman]: { 'font-style': 'normal' },

    [ns.uppercase]: { 'text-transform': 'uppercase' },
    [ns.lowercase]: { 'text-transform': 'lowercase' },
    [ns.capitalize]: { 'text-transform': 'capitalize' },
    [ns.normalCase]: { 'text-transform': 'none' },

    [ns.underline]: { 'text-decoration': 'underline' },
    [ns.lineThrough]: { 'text-decoration': 'line-through' },
    [ns.noUnderline]: { 'text-decoration': 'none' },

    [ns.antialiased]: {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    [ns.subpixelAntialiased]: {
      '-webkit-font-smoothing': 'auto',
      '-moz-osx-font-smoothing': 'auto',
    },
  })
}
