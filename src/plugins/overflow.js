export default function() {
  return function({ addUtilities, config }) {
    const overflow = config('classesNames').overflow
    const overflowScrolling = config('classesNames').overflowScrolling

    addUtilities(
      {
        [`.${overflow}-auto`]: { overflow: 'auto' },
        [`.${overflow}-hidden`]: { overflow: 'hidden' },
        [`.${overflow}-visible`]: { overflow: 'visible' },
        [`.${overflow}-scroll`]: { overflow: 'scroll' },
        [`.${overflow}-${config('sides').horizontal}-auto`]: {
          'overflow-x': 'auto',
        },
        [`.${overflow}-${config('sides').vertical}-auto`]: {
          'overflow-y': 'auto',
        },
        [`.${overflow}-${config('sides').horizontal}-hidden`]: {
          'overflow-x': 'hidden',
        },
        [`.${overflow}-${config('sides').vertical}-hidden`]: {
          'overflow-y': 'hidden',
        },
        [`.${overflow}-${config('sides').horizontal}-visible`]: {
          'overflow-x': 'visible',
        },
        [`.${overflow}-${config('sides').vertical}-visible`]: {
          'overflow-y': 'visible',
        },
        [`.${overflow}-${config('sides').horizontal}-scroll`]: {
          'overflow-x': 'scroll',
        },
        [`.${overflow}-${config('sides').vertical}-scroll`]: {
          'overflow-y': 'scroll',
        },
        [`.${overflowScrolling}-touch`]: {
          '-webkit-overflow-scrolling': 'touch',
        },
        [`.${overflowScrolling}-auto`]: {
          '-webkit-overflow-scrolling': 'auto',
        },
      },
      config('variants.overflow')
    )
  }
}
