import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gridColumnEnd') === 'ie11') {
      return
    }

    createUtilityPlugin('gridColumnEnd', [['col-end', ['gridColumnEnd']]])({ target, ...args })
  }
}
