import _ from 'lodash'
import appearance from '../generators/appearance'
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

export default function(options) {
  return function(css) {
    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'utilities') {
        const utilities = _.flatten([
          appearance(options),
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
          backgroundPositions(options),
          backgroundSize(options),
          borderStylesReset(options),
          borderWidths(options),
          borderColors(options),
          borderStyles(options),
          rounded(options),
          display(options),
          position(options),
          overflow(options),
          sizing(options),
          spacing(options),
          shadows(options),
          flex(options),
          floats(options),
          visibility(options),
          zIndex(options),
          opacity(options),
          userSelect(options),
          pointerEvents(options),
          resize(options),
          cursor(options),
        ])

        atRule.before(container(options))
        atRule.before(responsive(utilities))
        atRule.remove()
      }
    })
  }
}
