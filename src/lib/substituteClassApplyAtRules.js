import _ from 'lodash'
import postcss from 'postcss'
import escapeClassName from '../util/escapeClassName'

function buildClassTable(css) {
  const classTable = {}

  css.walkRules(rule => {
    if (!_.has(classTable, rule.selector)) {
      classTable[rule.selector] = []
    }
    classTable[rule.selector].push(rule)
  })

  return classTable
}

function normalizeClassName(className) {
  return `.${escapeClassName(_.trimStart(className, '.'))}`
}

function findMixin(classTable, mixin, onError) {
  const matches = _.get(classTable, mixin, [])

  if (_.isEmpty(matches)) {
    // prettier-ignore
    onError(`\`@apply\` cannot be used with \`${mixin}\` because \`${mixin}\` either cannot be found, or it's actual definition includes a pseudo-selector like :hover, :active, etc. If you're sure that \`${mixin}\` exists, make sure that any \`@import\` statements are being properly processed *before* Tailwind CSS sees your CSS, as \`@apply\` can only be used for classes in the same CSS tree.`)
  }

  if (matches.length > 1) {
    // prettier-ignore
    onError(`\`@apply\` cannot be used with ${mixin} because ${mixin} is included in multiple rulesets.`)
  }

  const [match] = matches

  if (match.parent.type !== 'root') {
    // prettier-ignore
    onError(`\`@apply\` cannot be used with ${mixin} because ${mixin} is nested inside of an at-rule (@${match.parent.name}).`)
  }

  return match.clone().nodes
}

export default function() {
  return function(css) {
    const classLookup = buildClassTable(css)

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
            return findMixin(classLookup, normalizeClassName(mixin), message => {
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
