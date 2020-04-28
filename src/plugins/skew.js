import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('skew') === 'ie11') {
      return
    }

    createUtilityPlugin('skew', [
      ['skew-x', ['--transform-skew-x']],
      ['skew-y', ['--transform-skew-y']],
    ])({ target, ...args })
  }
}
