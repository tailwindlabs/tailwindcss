import _ from 'lodash'

export default function prefixNegativeModifiers(base, modifier) {
  return _.startsWith(modifier, '-') ? `-${base}-${modifier.slice(1)}` : `${base}-${modifier}`
}
