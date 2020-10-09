import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gridAutoColumns') === 'ie11') {
      return
    }

    createUtilityPlugin('gridAutoColumns', [['auto-cols', ['gridAutoColumns']]])({
      target,
      ...args,
    })
  }
}
