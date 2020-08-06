import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gridRow') === 'ie11') {
      return
    }

    createUtilityPlugin('gridRow', [['row', ['gridRow']]])({ target, ...args })
  }
}
