import _ from 'lodash'
import backgroundColors from '../generators/backgroundColors'
import backgroundSize from '../generators/backgroundSize'
import borderWidths from '../generators/borderWidths'
import shadows from '../generators/shadows'
import flex from '../generators/flex'
import responsive from '../util/responsive'

export default function(options) {
  return function(css) {
    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'utilities') {
        const utilities = _.flatten([
          backgroundColors(options),
          backgroundSize(options),
          borderWidths(options),
          shadows(options),
          flex(options),
        ])
        css.insertBefore(atRule, responsive(utilities))
        atRule.remove()
      }
    })
  }
}
