import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ config, ...args }) {
    if (config('target') === 'ie11') {
      return
    }

    createUtilityPlugin('backgroundOpacity', [['bg-opacity', ['--bg-opacity']]])({
      config,
      ...args,
    })
  }
}
