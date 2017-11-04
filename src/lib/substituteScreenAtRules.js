import _ from 'lodash'
import buildMediaQuery from '../util/buildMediaQuery'

export default function(config) {
  return function(css) {
    const options = config()

    css.walkAtRules('screen', atRule => {
      const screen = atRule.params

      if (!_.has(options.screens, screen)) {
        throw atRule.error(`No \`${screen}\` screen found.`)
      }

      atRule.name = 'media'
      atRule.params = buildMediaQuery(options.screens[screen])
    })
  }
}
