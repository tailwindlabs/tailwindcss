import _ from 'lodash'
import postcss from 'postcss'
import applyClassPrefix from '../util/applyClassPrefix'
import responsive from '../util/responsive'

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
            lists(unwrappedConfig),
            appearance(unwrappedConfig),
            backgroundColors(unwrappedConfig),
            backgroundPosition(unwrappedConfig),
            backgroundSize(unwrappedConfig),
            borderColors(unwrappedConfig),
            borderRadius(unwrappedConfig),
            borderStyle(unwrappedConfig),
            borderWidths(unwrappedConfig),
            cursor(unwrappedConfig),
            display(unwrappedConfig),
            flexbox(unwrappedConfig),
            float(unwrappedConfig),
            fonts(unwrappedConfig),
            fontWeights(unwrappedConfig),
            height(unwrappedConfig),
            leading(unwrappedConfig),
            margin(unwrappedConfig),
            maxHeight(unwrappedConfig),
            maxWidth(unwrappedConfig),
            minHeight(unwrappedConfig),
            minWidth(unwrappedConfig),
            negativeMargin(unwrappedConfig),
            opacity(unwrappedConfig),
            overflow(unwrappedConfig),
            padding(unwrappedConfig),
            pointerEvents(unwrappedConfig),
            position(unwrappedConfig),
            resize(unwrappedConfig),
            shadows(unwrappedConfig),
            textAlign(unwrappedConfig),
            textColors(unwrappedConfig),
            textSizes(unwrappedConfig),
            textStyle(unwrappedConfig),
            tracking(unwrappedConfig),
            userSelect(unwrappedConfig),
            verticalAlign(unwrappedConfig),
            visibility(unwrappedConfig),
            whitespace(unwrappedConfig),
            width(unwrappedConfig),
            zIndex(unwrappedConfig),
          ]),
        })

        if (_.get(unwrappedConfig, 'options.important', false)) {
          utilities.walkDecls(decl => (decl.important = true))
        }

        const tailwindClasses = postcss.root({
          nodes: [...container(unwrappedConfig), responsive(utilities)],
        })

        applyClassPrefix(tailwindClasses, _.get(unwrappedConfig, 'options.prefix', ''))

        atRule.before(tailwindClasses)
        atRule.remove()
      }
    })
  }
}
