import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('textOpacity') === 'ie11') {
      return
    }

    createUtilityPlugin('textOpacity', [['text-opacity', ['--text-opacity']]])({ target, ...args })
  }
}
