import _ from 'lodash'
import buildMediaQuery from '../util/buildMediaQuery'

export default function(config) {
  return function(css) {
    css.walkAtRules('screen', atRule => {
      const screen = atRule.params

      if (!_.has(config.screens, screen)) {
        throw atRule.error(`No \`${screen}\` screen found.`)
      }

      atRule.name = 'media'
      atRule.params = buildMediaQuery(config.screens[screen])
    })
  }
}
