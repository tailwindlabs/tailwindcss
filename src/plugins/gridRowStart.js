import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gridRowStart') === 'ie11') {
      return
    }

    createUtilityPlugin('gridRowStart', [['row-start', ['gridRowStart']]])({ target, ...args })
  }
}
