import _ from 'lodash'

function ruleIsValidMixin(rule) {
  if (rule.parent.type === 'root') {
    return true
  }

  return rule.parent.type === 'atrule' && ['silent'].includes(rule.parent.name)
}

export default function findMixin(css, mixin, onError) {
  const matches = []

  css.walkRules(rule => {
    if (rule.selectors.includes(mixin) && ruleIsValidMixin(rule)) {
      matches.push(rule)
    }
  })

  if (_.isEmpty(matches) && _.isFunction(onError)) {
    onError()
  }

  return _.flatten(matches.map(match => match.clone().nodes))
}
