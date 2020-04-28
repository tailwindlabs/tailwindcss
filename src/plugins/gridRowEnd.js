import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gridRowEnd') === 'ie11') {
      return
    }

    createUtilityPlugin('gridRowEnd', [['row-end', ['gridRowEnd']]])({ target, ...args })
  }
}
