import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gridColumn') === 'ie11') {
      return
    }

    createUtilityPlugin('gridColumn', [['col', ['gridColumn']]])({ target, ...args })
  }
}
