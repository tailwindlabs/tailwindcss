export default function() {
  return function({ addUtilities, config }) {
    const objectFit = config('classesNames').objectFit

    addUtilities(
      {
        [`.${objectFit}-contain`]: { 'object-fit': 'contain' },
        [`.${objectFit}-cover`]: { 'object-fit': 'cover' },
        [`.${objectFit}-fill`]: { 'object-fit': 'fill' },
        [`.${objectFit}-none`]: { 'object-fit': 'none' },
        [`.${objectFit}-scale-down`]: { 'object-fit': 'scale-down' },
      },
      config('variants.objectFit')
    )
  }
}
