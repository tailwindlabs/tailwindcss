export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.cursor-auto': { cursor: 'auto' },
        '.cursor-default': { cursor: 'default' },
        '.cursor-pointer': { cursor: 'pointer' },
        '.cursor-wait': { cursor: 'wait' },
        '.cursor-move': { cursor: 'move' },
        '.cursor-not-allowed': { cursor: 'not-allowed' },
      },
      variants
    )
  }
}
