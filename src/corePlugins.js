import * as plugins from './plugins/index.js'
import configurePlugins from './util/configurePlugins'

function move(items, item, befores) {
  let lowestBefore = -1

  for (let before of befores) {
    let index = items.indexOf(before)
    if (index >= 0 && (index < lowestBefore || lowestBefore === -1)) {
      lowestBefore = index
    }
  }

  if (items.indexOf(item) === -1 || lowestBefore === -1) {
    return items
  }

  items = [...items]
  let fromIndex = items.indexOf(item)
  let toIndex = lowestBefore
  items.splice(fromIndex, 1)
  items.splice(toIndex, 0, item)
  return items
}

export default function ({ corePlugins: corePluginConfig }) {
  let pluginOrder = Object.keys(plugins)

  pluginOrder = configurePlugins(corePluginConfig, pluginOrder)
  pluginOrder = move(pluginOrder, 'transform', ['translate', 'rotate', 'skew', 'scale'])
  pluginOrder = move(pluginOrder, 'filter', [
    'blur',
    'brightness',
    'contrast',
    'dropShadow',
    'grayscale',
    'hueRotate',
    'invert',
    'saturate',
    'sepia',
  ])
  pluginOrder = move(pluginOrder, 'backdropFilter', [
    'backdropBlur',
    'backdropBrightness',
    'backdropContrast',
    'backdropGrayscale',
    'backdropHueRotate',
    'backdropInvert',
    'backdropOpacity',
    'backdropSaturate',
    'backdropSepia',
  ])

  return pluginOrder.map((pluginName) => {
    return plugins[pluginName]()
  })
}
