import _ from 'lodash'

export default function prefixNegativeModifiers(base, modifier) {
  if (modifier === '-') {
    return `-${base}`
  } else if (_.startsWith(modifier, '-')) {
    return `-${base}-${modifier.slice(1)}`
  } else {
    return `${base}-${modifier}`
  }
}
