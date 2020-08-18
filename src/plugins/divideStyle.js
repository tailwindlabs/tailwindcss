export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.divide-solid > :not(template) ~ :not(template)': {
          'border-style': 'solid',
        },
        '.divide-dashed > :not(template) ~ :not(template)': {
          'border-style': 'dashed',
        },
        '.divide-dotted > :not(template) ~ :not(template)': {
          'border-style': 'dotted',
        },
        '.divide-double > :not(template) ~ :not(template)': {
          'border-style': 'double',
        },
        '.divide-none > :not(template) ~ :not(template)': {
          'border-style': 'none',
        },
      },
      variants('divideStyle')
    )
  }
}
