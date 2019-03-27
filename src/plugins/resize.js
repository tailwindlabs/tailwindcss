export default function() {
  return function({ addUtilities, config }) {
    const resize = config('classesNames').resize

    addUtilities(
      {
        [`.${resize}-none`]: { resize: 'none' },
        [`.${resize}-${config('sides').vertical}`]: { resize: 'vertical' },
        [`.${resize}-${config('sides').horizontal}`]: { resize: 'horizontal' },
        [`.${resize.replace(/-$/g, '')}`]: { resize: 'both' },
      },
      config('variants.resize')
    )
  }
}
