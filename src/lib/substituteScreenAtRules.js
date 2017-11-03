import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'
import buildMediaQuery from '../util/buildMediaQuery'

export default function(config) {
  return function(css) {
    const options = config()
    const rules = []

    css.walkAtRules('screen', atRule => {
      const screen = atRule.params

      if (! _.has(options.screens, screen)) {
        throw atRule.error(`No \`${screen}\` screen found.`)
      }

      atRule.name = 'media'
      atRule.params = buildMediaQuery(options.screens[screen])
    })
  }
}
