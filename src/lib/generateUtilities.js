import _ from 'lodash'
import postcss from 'postcss'
import applyClassPrefix from '../util/applyClassPrefix'
import backgroundColors from '../generators/backgroundColors'
import backgroundPositions from '../generators/backgroundPositions'
import backgroundSize from '../generators/backgroundSize'
import borderColors from '../generators/borderColors'
import borderStylesReset from '../generators/borderStylesReset'
import borderStyles from '../generators/borderStyles'
import borderWidths from '../generators/borderWidths'
import container from '../generators/container'
import cursor from '../generators/cursor'
import display from '../generators/display'
import flex from '../generators/flex'
import floats from '../generators/floats'
import forms from '../generators/forms'
import lists from '../generators/lists'
import opacity from '../generators/opacity'
import overflow from '../generators/overflow'
import pointerEvents from '../generators/pointerEvents'
import position from '../generators/position'
import resize from '../generators/resize'
import responsive from '../util/responsive'
import rounded from '../generators/rounded'
import shadows from '../generators/shadows'
import sizing from '../generators/sizing'
import spacing from '../generators/spacing'
import textAlign from '../generators/textAlign'
import textColors from '../generators/textColors'
import textFonts from '../generators/textFonts'
import textLeading from '../generators/textLeading'
import textSizes from '../generators/textSizes'
import textStyle from '../generators/textStyle'
import textTracking from '../generators/textTracking'
import textWeights from '../generators/textWeights'
import textWrap from '../generators/textWrap'
import userSelect from '../generators/userSelect'
import verticalAlign from '../generators/verticalAlign'
import visibility from '../generators/visibility'
import zIndex from '../generators/zIndex'

export default function(config) {
  return function(css) {
    const unwrappedConfig = config()

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'utilities') {
        const utilities = postcss.root({
          nodes: _.flatten([
            lists(unwrappedConfig),
            forms(unwrappedConfig),
            textSizes(unwrappedConfig),
            textWeights(unwrappedConfig),
            textFonts(unwrappedConfig),
            textColors(unwrappedConfig),
            textLeading(unwrappedConfig),
            textTracking(unwrappedConfig),
            textAlign(unwrappedConfig),
            textWrap(unwrappedConfig),
            textStyle(unwrappedConfig),
            verticalAlign(unwrappedConfig),
            backgroundColors(unwrappedConfig),
            backgroundPositions(unwrappedConfig),
            backgroundSize(unwrappedConfig),
            borderStylesReset(unwrappedConfig),
            borderWidths(unwrappedConfig),
            borderColors(unwrappedConfig),
            borderStyles(unwrappedConfig),
            rounded(unwrappedConfig),
            display(unwrappedConfig),
            position(unwrappedConfig),
            overflow(unwrappedConfig),
            sizing(unwrappedConfig),
            spacing(unwrappedConfig),
            shadows(unwrappedConfig),
            flex(unwrappedConfig),
            floats(unwrappedConfig),
            visibility(unwrappedConfig),
            zIndex(unwrappedConfig),
            opacity(unwrappedConfig),
            userSelect(unwrappedConfig),
            pointerEvents(unwrappedConfig),
            resize(unwrappedConfig),
            cursor(unwrappedConfig),
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
