import postcss from 'postcss'
import _ from 'lodash'
import findMixin from '../util/findMixin'

export default postcss.plugin('tailwind-apply', function(css) {
  return function(css) {
    css.walkRules(function(rule) {
      rule.walkAtRules('apply', atRule => {
        const mixins = postcss.list.space(atRule.params)

        const [customProperties, classes] = _.partition(mixins, mixin => {
          return _.startsWith(mixin, '--')
        })

        const decls = _.flatMap(classes, mixin => {
          return findMixin(css, mixin, () => {
            throw atRule.error(`No ${mixin} class found.`)
          })
        })

        rule.insertBefore(atRule, decls)

        atRule.params = customProperties.join(' ')

        if (_.isEmpty(customProperties)) {
          atRule.remove()
        }
      })
    })
  }
})
