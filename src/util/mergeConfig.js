import _ from 'lodash'

function normalizeColorList(colors) {
  if (_.isArray(colors)) {
    colors = _(colors).flatMap(color => {
      if (_.isString(color)) {
        return [[color, color]]
      }
      return _.toPairs(color)
    }).fromPairs().value()
  }

  return _.toPairs(colors)
}

function normalizeConfig(config) {
  return {
    breakpoints: _.toPairs(_.get(config, 'breakpoints', {})),
    colors: _.toPairs(_.get(config, 'colors', {})),
    text: {
      fonts: _.toPairs(_.get(config, 'text.fonts', {})),
      sizes: _.toPairs(_.get(config, 'text.sizes', {})),
      weights: _.toPairs(_.get(config, 'text.weights', {})),
      leading: _.toPairs(_.get(config, 'text.leading', {})),
      tracking: _.toPairs(_.get(config, 'text.tracking', {})),
      colors: normalizeColorList(_.get(config, 'text.colors', {})),
    },
    backgrounds: {
      colors: normalizeColorList(_.get(config, 'backgrounds.colors', {})),
    },
    borders: {
      defauts: _.get(config, 'borders.defaults', {}),
      widths: _.toPairs(_.get(config, 'borders.widths', {})),
      rounded: {
        default: _.get(config, 'borders.rounded.default'),
        modifiers: _.toPairs(_.get(config, 'borders.rounded.modifiers', {})),
      },
      colors: normalizeColorList(_.get(config, 'borders.colors', {})),
    },
    sizing: {
      common: _.toPairs(_.get(config, 'sizing.common', {})),
      width: _.toPairs(_.get(config, 'sizing.width', {})),
      height: _.toPairs(_.get(config, 'sizing.height', {})),
    },
    spacing: {
      common: _.toPairs(_.get(config, 'spacing.common', {})),
      padding: _.toPairs(_.get(config, 'spacing.padding', {})),
      margin: _.toPairs(_.get(config, 'spacing.margin', {})),
      pull: _.toPairs(_.get(config, 'spacing.pull', {})),
    },
    constrain: _.toPairs(_.get(config, 'constrain', {})),
    shadows: _.toPairs(_.get(config, 'shadows', {})),
    zIndex: _.toPairs(_.get(config, 'zIndex', {})),
    extend: _.get(config, 'extend', {})
  }
}

function fixPairs(config) {
  return {
    breakpoints: _.fromPairs(_.get(config, 'breakpoints', {})),
    colors: _.fromPairs(_.get(config, 'colors', {})),
    text: {
      fonts: _.fromPairs(_.get(config, 'text.fonts', {})),
      sizes: _.fromPairs(_.get(config, 'text.sizes', {})),
      weights: _.fromPairs(_.get(config, 'text.weights', {})),
      leading: _.fromPairs(_.get(config, 'text.leading', {})),
      tracking: _.fromPairs(_.get(config, 'text.tracking', {})),
      colors: normalizeColorList(_.get(config, 'text.colors', {})),
    },
    backgrounds: {
      colors: normalizeColorList(_.get(config, 'backgrounds.colors', {})),
    },
    borders: {
      defauts: _.get(config, 'borders.defaults', {}),
      widths: _.fromPairs(_.get(config, 'borders.widths', {})),
      rounded: {
        default: _.get(config, 'borders.rounded.default'),
        modifiers: _.fromPairs(_.get(config, 'borders.rounded.modifiers', {})),
      },
      colors: normalizeColorList(_.get(config, 'borders.colors', {})),
    },
    sizing: {
      common: _.fromPairs(_.get(config, 'sizing.common', {})),
      width: _.fromPairs(_.get(config, 'sizing.width', {})),
      height: _.fromPairs(_.get(config, 'sizing.height', {})),
    },
    spacing: {
      common: _.fromPairs(_.get(config, 'spacing.common', {})),
      padding: _.fromPairs(_.get(config, 'spacing.padding', {})),
      margin: _.fromPairs(_.get(config, 'spacing.margin', {})),
      pull: _.fromPairs(_.get(config, 'spacing.pull', {})),
    },
    constrain: _.fromPairs(_.get(config, 'constrain', {})),
    shadows: _.fromPairs(_.get(config, 'shadows', {})),
    zIndex: _.fromPairs(_.get(config, 'zIndex', {})),
  }
}


export default function mergeConfig(base, other) {
  const replaced = _.defaultsDeep(
    {},
    normalizeConfig(other),
    normalizeConfig(base),
  )

  const extended = _.mergeWith(
    {},
    replaced,
    normalizeConfig(_.get(replaced, 'extend', {})),
    (objValue, srcValue) => {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    }
  )

  return fixPairs(extended)
}
