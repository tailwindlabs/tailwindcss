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

export default function(config) {
  return function(css) {
    const unwrappedConfig = config()

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'utilities') {
        const utilities = postcss.root({
          nodes: _.flatten([
            // The `lists` module needs to be first to allow overriding the margin and
            // padding values that it sets with other utilities.
            responsive(lists(unwrappedConfig)),
            responsive(appearance(unwrappedConfig)),
            responsive(hoverable(backgroundColors(unwrappedConfig))),
            responsive(backgroundPosition(unwrappedConfig)),
            responsive(backgroundSize(unwrappedConfig)),
            responsive(hoverable(borderColors(unwrappedConfig))),
            responsive(borderRadius(unwrappedConfig)),
            responsive(borderStyle(unwrappedConfig)),
            responsive(borderWidths(unwrappedConfig)),
            responsive(cursor(unwrappedConfig)),
            responsive(display(unwrappedConfig)),
            responsive(flexbox(unwrappedConfig)),
            responsive(float(unwrappedConfig)),
            responsive(fonts(unwrappedConfig)),
            responsive(hoverable(fontWeights(unwrappedConfig))),
            responsive(height(unwrappedConfig)),
            responsive(leading(unwrappedConfig)),
            responsive(margin(unwrappedConfig)),
            responsive(maxHeight(unwrappedConfig)),
            responsive(maxWidth(unwrappedConfig)),
            responsive(minHeight(unwrappedConfig)),
            responsive(minWidth(unwrappedConfig)),
            responsive(negativeMargin(unwrappedConfig)),
            responsive(opacity(unwrappedConfig)),
            responsive(overflow(unwrappedConfig)),
            responsive(padding(unwrappedConfig)),
            responsive(pointerEvents(unwrappedConfig)),
            responsive(position(unwrappedConfig)),
            responsive(resize(unwrappedConfig)),
            responsive(shadows(unwrappedConfig)),
            responsive(textAlign(unwrappedConfig)),
            responsive(hoverable(textColors(unwrappedConfig))),
            responsive(textSizes(unwrappedConfig)),
            responsive(hoverable(textStyle(unwrappedConfig))),
            responsive(tracking(unwrappedConfig)),
            responsive(userSelect(unwrappedConfig)),
            responsive(verticalAlign(unwrappedConfig)),
            responsive(visibility(unwrappedConfig)),
            responsive(whitespace(unwrappedConfig)),
            responsive(width(unwrappedConfig)),
            responsive(zIndex(unwrappedConfig)),
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
