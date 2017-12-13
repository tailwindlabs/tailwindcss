import _ from 'lodash'
import postcss from 'postcss'
import escapeClassName from '../util/escapeClassName'

function normalizeClassName(className) {
  return `.${escapeClassName(_.trimStart(className, '.'))}`
}

function findMixin(css, mixin, onError) {
  const matches = []

  css.walkRules(rule => {
    if (rule.selectors.includes(mixin)) {
      if (rule.parent.type !== 'root') {
        // prettier-ignore
        onError(`\`@apply\` cannot be used with ${mixin} because ${mixin} is nested inside of an at-rule (@${rule.parent.name}).`)
      }

      matches.push(rule)
    }
  })

  if (_.isEmpty(matches)) {
    // prettier-ignore
    onError(`\`@apply\` cannot be used with \`${mixin}\` because \`${mixin}\` either cannot be found, or it's actual definition includes a pseudo-selector like :hover, :active, etc. If you're sure that \`${mixin}\` exists, make sure that any \`@import\` statements are being properly processed *before* Tailwind CSS sees your CSS, as \`@apply\` can only be used for classes in the same CSS tree.`)
  }

  if (matches.length > 1) {
    // prettier-ignore
    onError(`\`@apply\` cannot be used with ${mixin} because ${mixin} is included in multiple rulesets.`)
  }

  return _.flatten(matches.map(match => match.clone().nodes))
}

export default function() {
  return function(css) {
    css.walkRules(rule => {
      rule.walkAtRules('apply', atRule => {
        const mixins = postcss.list.space(atRule.params)

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

        const decls = _(classes)
          .reject(mixin => mixin === '!important')
          .flatMap(mixin => {
            return findMixin(css, normalizeClassName(mixin), message => {
              throw atRule.error(message)
            })
          })
          .value()

        _.tap(_.last(mixins) === '!important', important => {
          decls.forEach(decl => (decl.important = important))
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
