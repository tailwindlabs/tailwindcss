import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gridColumnStart') === 'ie11') {
      return
    }

    createUtilityPlugin('gridColumnStart', [['col-start', ['gridColumnStart']]])({
      target,
      ...args,
    })
  }
}
