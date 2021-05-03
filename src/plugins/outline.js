export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        outline: (value) => {
          let [outline, outlineOffset = '0'] = Array.isArray(value) ? value : [value]

          return { outline, 'outline-offset': outlineOffset }
        },
      },
      { values: theme('outline'), variants: variants('outline'), type: 'any' }
    )
  }
}
