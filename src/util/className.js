import _ from 'lodash'
import escapeClassName from './escapeClassName'

export default function className(base, modifier) {
  const name = (() => {
    if (modifier === 'default') {
      return base
    }
    return _.startsWith(modifier, '-') ? `-${base}-${modifier.slice(1)}` : `${base}-${modifier}`
  })()

  return `.${escapeClassName(name)}`
}
