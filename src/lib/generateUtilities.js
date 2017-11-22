import _ from 'lodash'
import postcss from 'postcss'
import applyClassPrefix from '../util/applyClassPrefix'
import responsive from '../util/responsive'
import hoverable from '../util/hoverable'

import lists from '../generators/lists'
import appearance from '../generators/appearance'
import backgroundColors from '../generators/backgroundColors'
import backgroundPosition from '../generators/backgroundPosition'
import backgroundSize from '../generators/backgroundSize'
import borderColors from '../generators/borderColors'
import borderRadius from '../generators/borderRadius'
import borderStyle from '../generators/borderStyle'
import borderWidths from '../generators/borderWidths'
import container from '../generators/container'
import cursor from '../generators/cursor'
import display from '../generators/display'
import flexbox from '../generators/flexbox'
import float from '../generators/float'
import fonts from '../generators/fonts'
import fontWeights from '../generators/fontWeights'
import height from '../generators/height'
import leading from '../generators/leading'
import margin from '../generators/margin'
import maxHeight from '../generators/maxHeight'
import maxWidth from '../generators/maxWidth'
import minHeight from '../generators/minHeight'
import minWidth from '../generators/minWidth'
import negativeMargin from '../generators/negativeMargin'
import opacity from '../generators/opacity'
import overflow from '../generators/overflow'
import padding from '../generators/padding'
import pointerEvents from '../generators/pointerEvents'
import position from '../generators/position'
import resize from '../generators/resize'
import shadows from '../generators/shadows'
import textAlign from '../generators/textAlign'
import textColors from '../generators/textColors'
import textSizes from '../generators/textSizes'
import textStyle from '../generators/textStyle'
import tracking from '../generators/tracking'
import userSelect from '../generators/userSelect'
import verticalAlign from '../generators/verticalAlign'
import visibility from '../generators/visibility'
import whitespace from '../generators/whitespace'
import width from '../generators/width'
import zIndex from '../generators/zIndex'

function withVariants(module, variants) {
  return _.reduce(variants, (module, variant) => {
    return {
      responsive: responsive,
      hover: hoverable,
    }[variant](module)
  }, module)
}

export default function(config) {
  return function(css) {
    const unwrappedConfig = config()

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'utilities') {
        const utilities = postcss.root({
          nodes: _.flatten([
            // The `lists` module needs to be first to allow overriding the margin and
            // padding values that it sets with other utilities.
            withVariants(lists(unwrappedConfig), unwrappedConfig.options.modules.lists),
            withVariants(appearance(unwrappedConfig), unwrappedConfig.options.modules.appearance),
            withVariants(backgroundColors(unwrappedConfig), unwrappedConfig.options.modules.backgroundColors),
            withVariants(backgroundPosition(unwrappedConfig), unwrappedConfig.options.modules.backgroundPosition),
            withVariants(backgroundSize(unwrappedConfig), unwrappedConfig.options.modules.backgroundSize),
            withVariants(borderColors(unwrappedConfig), unwrappedConfig.options.modules.borderColors),
            withVariants(borderRadius(unwrappedConfig), unwrappedConfig.options.modules.borderRadius),
            withVariants(borderStyle(unwrappedConfig), unwrappedConfig.options.modules.borderStyle),
            withVariants(borderWidths(unwrappedConfig), unwrappedConfig.options.modules.borderWidths),
            withVariants(cursor(unwrappedConfig), unwrappedConfig.options.modules.cursor),
            withVariants(display(unwrappedConfig), unwrappedConfig.options.modules.display),
            withVariants(flexbox(unwrappedConfig), unwrappedConfig.options.modules.flexbox),
            withVariants(float(unwrappedConfig), unwrappedConfig.options.modules.float),
            withVariants(fonts(unwrappedConfig), unwrappedConfig.options.modules.fonts),
            withVariants(fontWeights(unwrappedConfig), unwrappedConfig.options.modules.fontWeights),
            withVariants(height(unwrappedConfig), unwrappedConfig.options.modules.height),
            withVariants(leading(unwrappedConfig), unwrappedConfig.options.modules.leading),
            withVariants(margin(unwrappedConfig), unwrappedConfig.options.modules.margin),
            withVariants(maxHeight(unwrappedConfig), unwrappedConfig.options.modules.maxHeight),
            withVariants(maxWidth(unwrappedConfig), unwrappedConfig.options.modules.maxWidth),
            withVariants(minHeight(unwrappedConfig), unwrappedConfig.options.modules.minHeight),
            withVariants(minWidth(unwrappedConfig), unwrappedConfig.options.modules.minWidth),
            withVariants(negativeMargin(unwrappedConfig), unwrappedConfig.options.modules.negativeMargin),
            withVariants(opacity(unwrappedConfig), unwrappedConfig.options.modules.opacity),
            withVariants(overflow(unwrappedConfig), unwrappedConfig.options.modules.overflow),
            withVariants(padding(unwrappedConfig), unwrappedConfig.options.modules.padding),
            withVariants(pointerEvents(unwrappedConfig), unwrappedConfig.options.modules.pointerEvents),
            withVariants(position(unwrappedConfig), unwrappedConfig.options.modules.position),
            withVariants(resize(unwrappedConfig), unwrappedConfig.options.modules.resize),
            withVariants(shadows(unwrappedConfig), unwrappedConfig.options.modules.shadows),
            withVariants(textAlign(unwrappedConfig), unwrappedConfig.options.modules.textAlign),
            withVariants(textColors(unwrappedConfig), unwrappedConfig.options.modules.textColors),
            withVariants(textSizes(unwrappedConfig), unwrappedConfig.options.modules.textSizes),
            withVariants(textStyle(unwrappedConfig), unwrappedConfig.options.modules.textStyle),
            withVariants(tracking(unwrappedConfig), unwrappedConfig.options.modules.tracking),
            withVariants(userSelect(unwrappedConfig), unwrappedConfig.options.modules.userSelect),
            withVariants(verticalAlign(unwrappedConfig), unwrappedConfig.options.modules.verticalAlign),
            withVariants(visibility(unwrappedConfig), unwrappedConfig.options.modules.visibility),
            withVariants(whitespace(unwrappedConfig), unwrappedConfig.options.modules.whitespace),
            withVariants(width(unwrappedConfig), unwrappedConfig.options.modules.width),
            withVariants(zIndex(unwrappedConfig), unwrappedConfig.options.modules.zIndex),
          ]),
        })

        if (_.get(unwrappedConfig, 'options.important', false)) {
          utilities.walkDecls(decl => (decl.important = true))
        }

        const tailwindClasses = postcss.root({
          nodes: [...container(unwrappedConfig), ...utilities.nodes],
        })

        applyClassPrefix(tailwindClasses, _.get(unwrappedConfig, 'options.prefix', ''))

        atRule.before(tailwindClasses)
        atRule.remove()
      }
    })
  }
}
