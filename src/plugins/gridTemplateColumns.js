import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gridTemplateColumns') === 'ie11') {
      return
    }

    createUtilityPlugin('gridTemplateColumns', [['grid-cols', ['gridTemplateColumns']]])({
      target,
      ...args,
    })
  }
}
