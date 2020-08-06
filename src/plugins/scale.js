import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('scale') === 'ie11') {
      createUtilityPlugin('scale', [
        ['scale', ['transform'], value => `scale(${value})`],
        ['scale-x', ['transform'], value => `scaleX(${value})`],
        ['scale-y', ['transform'], value => `scaleY(${value})`],
      ])({ target, ...args })

      return
    }

    createUtilityPlugin('scale', [
      ['scale', ['--transform-scale-x', '--transform-scale-y']],
      ['scale-x', ['--transform-scale-x']],
      ['scale-y', ['--transform-scale-y']],
    ])({ target, ...args })
  }
}
