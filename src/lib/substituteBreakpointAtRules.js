import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'

export default function(options) {
  return function(css) {
    const rules = []

    css.walkAtRules('breakpoint', atRule => {
      const breakpoint = atRule.params

      if (! _.has(options.breakpoints, breakpoint)) {
        throw atRule.error(`No \`${breakpoint}\` breakpoint found.`)
      }

      atRule.name = 'media'
      atRule.params = `(--breakpoint-${atRule.params})`
    })
  }
}
