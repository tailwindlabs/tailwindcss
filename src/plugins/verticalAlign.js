export default function() {
  return function({ addUtilities, config }) {
    const verticalAlign = config('classesNames').verticalAlign

    addUtilities(
      {
        [`.${verticalAlign}-baseline`]: { 'vertical-align': 'baseline' },
        [`.${verticalAlign}-top`]: { 'vertical-align': 'top' },
        [`.${verticalAlign}-middle`]: { 'vertical-align': 'middle' },
        [`.${verticalAlign}-bottom`]: { 'vertical-align': 'bottom' },
        [`.${verticalAlign}-text-top`]: { 'vertical-align': 'text-top' },
        [`.${verticalAlign}-text-bottom`]: {
          'vertical-align': 'text-bottom',
        },
      },
      config('variants.verticalAlign')
    )
  }
}
