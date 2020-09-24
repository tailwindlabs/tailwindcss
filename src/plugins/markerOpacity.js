import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('markerOpacity') === 'ie11') {
      return
    }

    createUtilityPlugin('markerOpacity', [['marker-opacity', ['--marker-opacity']]])({
      target,
      ...args
    })
  }
}
