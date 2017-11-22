import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function definePadding(padding) {
  const generators = [
    (size, modifier) =>
      defineClasses({
        [`p-${modifier}`]: { padding: `${size}` },
      }),
    (size, modifier) =>
      defineClasses({
        [`py-${modifier}`]: { 'padding-top': `${size}`, 'padding-bottom': `${size}` },
        [`px-${modifier}`]: { 'padding-left': `${size}`, 'padding-right': `${size}` },
      }),
    (size, modifier) =>
      defineClasses({
        [`pt-${modifier}`]: { 'padding-top': `${size}` },
        [`pr-${modifier}`]: { 'padding-right': `${size}` },
        [`pb-${modifier}`]: { 'padding-bottom': `${size}` },
        [`pl-${modifier}`]: { 'padding-left': `${size}` },
      }),
  ]

  return _.flatMap(generators, generator => {
    return _.flatMap(padding, generator)
  })
}

export default function({ padding }) {
  return _.flatten([definePadding(padding)])
}
