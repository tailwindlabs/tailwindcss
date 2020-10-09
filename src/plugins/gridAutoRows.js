import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gridAutoRows') === 'ie11') {
      return
    }

    createUtilityPlugin('gridAutoRows', [['auto-rows', ['gridAutoRows']]])({ target, ...args })
  }
}
