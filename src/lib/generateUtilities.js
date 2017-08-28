import _ from 'lodash'
import responsive from '../util/responsive'
import textSizes from '../generators/textSizes'
import textWeights from '../generators/textWeights'
import textFonts from '../generators/textFonts'
import textColors from '../generators/textColors'
import textLeading from '../generators/textLeading'
import textTracking from '../generators/textTracking'
import textAlign from '../generators/textAlign'
import textWrap from '../generators/textWrap'
import textStyle from '../generators/textStyle'
import verticalAlign from '../generators/verticalAlign'
import backgroundColors from '../generators/backgroundColors'
import backgroundSize from '../generators/backgroundSize'
import borderWidths from '../generators/borderWidths'
import borderColors from '../generators/borderColors'
import borderStyles from '../generators/borderStyles'
import rounded from '../generators/rounded'
import display from '../generators/display'
import position from '../generators/position'
import overflow from '../generators/overflow'
import sizing from '../generators/sizing'
import spacing from '../generators/spacing'
import constrain from '../generators/constrain'
import shadows from '../generators/shadows'
import flex from '../generators/flex'
import zIndex from '../generators/zIndex'

export default function(options) {
  return function(css) {
    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'utilities') {
        const utilities = _.flatten([
          textSizes(options),
          textWeights(options),
          textFonts(options),
          textColors(options),
          textLeading(options),
          textTracking(options),
          textAlign(options),
          textWrap(options),
          textStyle(options),
          verticalAlign(options),
          backgroundColors(options),
          backgroundSize(options),
          borderWidths(options),
          borderColors(options),
          borderStyles(options),
          rounded(options),
          display(options),
          position(options),
          overflow(options),
          sizing(options),
          spacing(options),
          constrain(options),
          shadows(options),
          flex(options),
          zIndex(options),
        ])
        css.insertBefore(atRule, responsive(utilities))
        atRule.remove()
      }
    })
  }
}
