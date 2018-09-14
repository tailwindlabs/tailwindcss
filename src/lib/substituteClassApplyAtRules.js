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

function buildShadowTable(generatedUtilities) {
  const utilities = postcss.root()

  postcss.root({ nodes: generatedUtilities }).walkAtRules('variants', atRule => {
    utilities.append(atRule.clone().nodes)
  })

  return buildClassTable(utilities)
}

function normalizeClassName(className) {
  return `.${escapeClassName(_.trimStart(className, '.'))}`
}

function findClass(classToApply, classTable, shadowLookup, prefix, onError) {
  let matches = _.get(classTable, classToApply, [])

  if (_.isEmpty(matches)) {
    if (_.isEmpty(shadowLookup)) 
      if (prefix) {
        classToApply = '.' + prefix + classToApply.substr(1)
        matches = _.get(classTable, classToApply, []);
        if (_.isEmpty(matches)) {
          if (_.isEmpty(shadowLookup)) {
            // prettier-ignore
            throw onError(`\`@apply\` cannot be used with \`${classToApply}\` because \`${classToApply}\` either cannot be found, or it's actual definition includes a pseudo-selector like :hover, :active, etc. If you're sure that \`${classToApply}\` exists, make sure that any \`@import\` statements are being properly processed *before* Tailwind CSS sees your CSS, as \`@apply\` can only be used for classes in the same CSS tree.`);
          }

          return findClass(classToApply, shadowLookup, {}, '', onError);
        }
      } else {
        // prettier-ignore
        throw onError(`\`@apply\` cannot be used with \`${classToApply}\` because \`${classToApply}\` either cannot be found, or it's actual definition includes a pseudo-selector like :hover, :active, etc. If you're sure that \`${classToApply}\` exists, make sure that any \`@import\` statements are being properly processed *before* Tailwind CSS sees your CSS, as \`@apply\` can only be used for classes in the same CSS tree.`)
      }
    } else {
      return findClass(classToApply, shadowLookup, {}, prefix, onError)
    }
  }

  if (matches.length > 1) {
    // prettier-ignore
    throw onError(`\`@apply\` cannot be used with ${classToApply} because ${classToApply} is included in multiple rulesets.`)
  }

  const [match] = matches

  if (match.parent.type !== 'root') {
    // prettier-ignore
    throw onError(`\`@apply\` cannot be used with ${classToApply} because ${classToApply} is nested inside of an at-rule (@${match.parent.name}).`)
  }

  return match.clone().nodes
}

export default function(config, generatedUtilities) {
  return function(css) {
    const classLookup = buildClassTable(css)
    const shadowLookup = _.get(config, 'experiments.shadowLookup', false)
      ? buildShadowTable(generatedUtilities)
      : {}

    css.walkRules(rule => {
      rule.walkAtRules('apply', atRule => {
        const classesAndProperties = postcss.list.space(atRule.params)

        /*
         * Don't wreck CSSNext-style @apply rules:
         * http://cssnext.io/features/#custom-properties-set-apply
         *
         * These are deprecated in CSSNext but still playing it safe for now.
         * We might consider renaming this at-rule.
         */
        const [customProperties, classes] = _.partition(classesAndProperties, classOrProperty => {
          return _.startsWith(classOrProperty, '--')
        })

        const decls = _(classes)
          .reject(cssClass => cssClass === '!important')
          .flatMap(cssClass => {
            return findClass(normalizeClassName(cssClass), classLookup, shadowLookup, config.options.prefix, message => {
              return atRule.error(message)
            })
          })
          .value()

        _.tap(_.last(classesAndProperties) === '!important', important => {
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
