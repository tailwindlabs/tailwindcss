import _ from 'lodash'
import postcss from 'postcss'
import escapeClassName from '../util/escapeClassName'

function normalizeClassNames(classNames) {
  return classNames.map(className => {
    return `.${escapeClassName(_.trimStart(className, '.'))}`
  })
}

function findMixin(css, mixin, onError) {
  const matches = []

  css.walkRules(rule => {
    if (rule.selectors.includes(mixin)) {
      if (rule.parent.type !== 'root') {
        onError(
          `\`@apply\` cannot be used with ${mixin} because ${mixin} is nested inside of an at-rule (@${rule
            .parent.name}).`
        )
      }

      matches.push(rule)
    }
  })

  if (_.isEmpty(matches) && _.isFunction(onError)) {
    onError(`No ${mixin} class found.`)
  }

  return _.flatten(matches.map(match => match.clone().nodes))
}

export default function() {
  return function(css) {
    css.walkRules(rule => {
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
          return findMixin(css, mixin, message => {
            throw atRule.error(message)
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
