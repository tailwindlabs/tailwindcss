import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function definePadding(padding, ns) {
  const generators = [
    (size, modifier) =>
      defineClasses({
        [`${ns.base}${ns.modifierPrefix}${modifier}`]: { padding: `${size}` },
      }),
    (size, modifier) =>
      defineClasses({
        [`${ns.base}${ns.y}${ns.modifierPrefix}${modifier}`]: {
          'padding-top': `${size}`,
          'padding-bottom': `${size}`,
        },
        [`${ns.base}${ns.x}${ns.modifierPrefix}${modifier}`]: {
          'padding-left': `${size}`,
          'padding-right': `${size}`,
        },
      }),
    (size, modifier) =>
      defineClasses({
        [`${ns.base}${ns.t}${ns.modifierPrefix}${modifier}`]: { 'padding-top': `${size}` },
        [`${ns.base}${ns.r}${ns.modifierPrefix}${modifier}`]: { 'padding-right': `${size}` },
        [`${ns.base}${ns.b}${ns.modifierPrefix}${modifier}`]: { 'padding-bottom': `${size}` },
        [`${ns.base}${ns.l}${ns.modifierPrefix}${modifier}`]: { 'padding-left': `${size}` },
      }),
  ]

  return _.flatMap(generators, generator => {
    return _.flatMap(padding, generator)
  })
}

export default function({ padding, naming: { padding: ns } }) {
  return _.flatten([definePadding(padding, ns)])
}
