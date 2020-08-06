import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('borderOpacity') === 'ie11') {
      return
    }

    createUtilityPlugin('borderOpacity', [['border-opacity', ['--border-opacity']]])({
      target,
      ...args,
    })
  }
}
