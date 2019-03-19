import { has } from 'lodash'

const paths = [
  'colors',
  'screens',
  'fonts',
  'textSizes',
  'fontWeights',
  'leading',
  'tracking',
  'textColors',
  'backgroundColors',
  'backgroundSize',
  'borderWidths',
  'borderColors',
  'borderRadius',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'padding',
  'margin',
  'negativeMargin',
  'shadows',
  'zIndex',
  'opacity',
  'svgFill',
  'svgStroke',
  'options.prefix',
  'options.important',
  'options.separator',
  'modules',
  'plugins',
]

/**
 * Gets a list of paths that do not exist in the provided object
 *
 * @param {object} config
 * @return {string[]}
 */
export function getMissingRequiredProperties(config) {
  return paths.filter(path => !has(config, path))
}
