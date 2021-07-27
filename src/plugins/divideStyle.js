export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.divide-solid > :not([hidden]):not([type="hidden"]) ~ :not([hidden]):not([type="hidden"])':
          {
            'border-style': 'solid',
          },
        '.divide-dashed > :not([hidden]):not([type="hidden"]) ~ :not([hidden]):not([type="hidden"])':
          {
            'border-style': 'dashed',
          },
        '.divide-dotted > :not([hidden]):not([type="hidden"]) ~ :not([hidden]):not([type="hidden"])':
          {
            'border-style': 'dotted',
          },
        '.divide-double > :not([hidden]):not([type="hidden"]) ~ :not([hidden]):not([type="hidden"])':
          {
            'border-style': 'double',
          },
        '.divide-none > :not([hidden]):not([type="hidden"]) ~ :not([hidden]):not([type="hidden"])':
          {
            'border-style': 'none',
          },
      },
      variants('divideStyle')
    )
  }
}
