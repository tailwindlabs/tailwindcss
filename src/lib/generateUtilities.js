import _ from 'lodash'
import responsive from '../util/responsive'
import backgroundColors from '../generators/backgroundColors'
import backgroundSize from '../generators/backgroundSize'
import borderWidths from '../generators/borderWidths'
import borderColors from '../generators/borderColors'
import constrain from '../generators/constrain'
import shadows from '../generators/shadows'
import flex from '../generators/flex'

export default function(options) {
  return function(css) {
    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'utilities') {
        const utilities = _.flatten([
          backgroundColors(options),
          backgroundSize(options),
          borderWidths(options),
          borderColors(options),
          constrain(options),
          shadows(options),
          flex(options),
        ])
        css.insertBefore(atRule, responsive(utilities))
        atRule.remove()
      }
    })
  }
}
