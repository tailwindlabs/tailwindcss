export default function() {
  return function({ addUtilities, variants, target }) {
    target(
      {
        ie11: () => {},
      },
      () => {
        addUtilities(
          {
            '.object-contain': { 'object-fit': 'contain' },
            '.object-cover': { 'object-fit': 'cover' },
            '.object-fill': { 'object-fit': 'fill' },
            '.object-none': { 'object-fit': 'none' },
            '.object-scale-down': { 'object-fit': 'scale-down' },
          },
          variants('objectFit')
        )
      }
    )
  }
}
