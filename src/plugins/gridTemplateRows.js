import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gridTemplateRows') === 'ie11') {
      return
    }

    createUtilityPlugin('gridTemplateRows', [['grid-rows', ['gridTemplateRows']]])({
      target,
      ...args,
    })
  }
}
