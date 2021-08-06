export default function () {
  return function ({ matchUtilities, theme, variants }) {
    let defaultTimingFunction = theme('transitionTimingFunction.DEFAULT')
    let defaultDuration = theme('transitionDuration.DEFAULT')
    let transitionPropertyTheme = theme('transitionProperty')

    matchUtilities(
      {
        transition: (value) => {
          return {
            'transition-property': transitionPropertyTheme[value] ?? value.replace(/,/g, ', '),
            ...(value === 'none'
              ? {}
              : {
                  'transition-timing-function': defaultTimingFunction,
                  'transition-duration': defaultDuration,
                }),
          }
        },
      },
      {
        values: theme('transitionProperty'),
        variants: variants('transitionProperty'),
        type: 'any',
      }
    )
  }
}
