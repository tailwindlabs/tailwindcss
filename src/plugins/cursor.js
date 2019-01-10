export default function () {
  return function ({ addUtilities, config }) {
    addUtilities({
        '.cursor-auto': { cursor: 'auto' },
        '.cursor-default': { cursor: 'default' },
        '.cursor-pointer': { cursor: 'pointer' },
        '.cursor-wait': { cursor: 'wait' },
        '.cursor-move': { cursor: 'move' },
        '.cursor-not-allowed': { cursor: 'not-allowed' },
    }, config('modules.cursor'))
  }
}
