import postcss from 'postcss'
import _ from 'lodash'
import findMixin from '../util/findMixin'
import escapeClassName from '../util/escapeClassName'

function normalizeClassNames(classNames) {
  return classNames.map(className => {
    return `.${escapeClassName(_.trimStart(className, '.'))}`
  })
}

export default function(config) {
  return function(css) {
    const options = config()
    css.walkRules(function(rule) {
      rule.walkAtRules('apply', atRule => {
        const mixins = normalizeClassNames(postcss.list.space(atRule.params))

        /*
         * Don't wreck CSSNext-style @apply rules:
         * http://cssnext.io/features/#custom-properties-set-apply
         *
         * These are deprecated in CSSNext but still playing it safe for now.
         * We might consider renaming this at-rule.
         */
        const [customProperties, classes] = _.partition(mixins, mixin => {
          return _.startsWith(mixin, '--')
        })

        const decls = _.flatMap(classes, mixin => {
          return findMixin(css, mixin, () => {
            throw atRule.error(`No ${mixin} class found.`)
          })
        })

        atRule.before(decls)

        atRule.params = customProperties.join(' ')

        if (_.isEmpty(customProperties)) {
          atRule.remove()
        }
      })
    })
  }
}
