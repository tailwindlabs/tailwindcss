import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('skew') === 'ie11') {
      createUtilityPlugin('skew', [
        ['skew-x', ['transform'], value => `skewX(${value})`],
        ['skew-y', ['transform'], value => `skewY(${value})`],
      ])({ target, ...args })

      return
    }

    createUtilityPlugin('skew', [
      ['skew-x', ['--transform-skew-x']],
      ['skew-y', ['--transform-skew-y']],
    ])({ target, ...args })
  }
}
