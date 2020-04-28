import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('rotate') === 'ie11') {
      return
    }

    createUtilityPlugin('rotate', [['rotate', ['--transform-rotate']]])({ target, ...args })
  }
}
