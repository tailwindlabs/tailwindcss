export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.object-contain': { 'object-fit': 'contain' },
        '.object-cover': { 'object-fit': 'cover' },
        '.object-fill': { 'object-fit': 'fill' },
        '.object-none': { 'object-fit': 'none' },
        '.object-scale-down': { 'object-fit': 'scale-down' },
      },
      config('modules.objectFit')
    )
  }
}
