export default function() {
  return function({ addUtilities, config }) {
    const textStyleTextTransform = config('classesNames').textTransform

    addUtilities(
      {
        [`.${textStyleTextTransform}uppercase`]: { 'text-transform': 'uppercase' },
        [`.${textStyleTextTransform}lowercase`]: { 'text-transform': 'lowercase' },
        [`.${textStyleTextTransform}capitalize`]: { 'text-transform': 'capitalize' },
        [`.${textStyleTextTransform}normal-case`]: { 'text-transform': 'none' },
      },
      config('variants.textTransform')
    )
  }
}
