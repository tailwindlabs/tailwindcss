import _ from 'lodash'

export default function prefixNegativeModifiers(base, modifier) {
  return modifier === '-'
    ? `-${base}`
    : _.startsWith(modifier, '-')
      ? `-${base}-${modifier.slice(1)}`
      : `${base}-${modifier}`
}
