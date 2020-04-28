import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('backgroundOpacity') === 'ie11') {
      return
    }

    createUtilityPlugin('backgroundOpacity', [['bg-opacity', ['--bg-opacity']]])({
      target,
      ...args,
    })
  }
}
