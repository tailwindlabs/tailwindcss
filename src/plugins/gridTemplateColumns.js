import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ config, ...args }) {
    if (config('target') === 'ie11') {
      return
    }

    createUtilityPlugin('gridTemplateColumns', [['grid-cols', ['gridTemplateColumns']]])({
      config,
      ...args,
    })
  }
}
