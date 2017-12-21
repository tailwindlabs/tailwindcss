import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function defineNegativeMargin(negativeMargin, ns) {
  const generators = [
    (size, modifier) =>
      defineClasses({
        [`${ns.base}${ns.modifierPrefix}${modifier}`]: { margin: `${size}` },
      }),
    (size, modifier) =>
      defineClasses({
        [`${ns.base}${ns.y}${ns.modifierPrefix}${modifier}`]: {
          'margin-top': `${size}`,
          'margin-bottom': `${size}`,
        },
        [`${ns.base}${ns.x}${ns.modifierPrefix}${modifier}`]: {
          'margin-left': `${size}`,
          'margin-right': `${size}`,
        },
      }),
    (size, modifier) =>
      defineClasses({
        [`${ns.base}${ns.t}${ns.modifierPrefix}${modifier}`]: { 'margin-top': `${size}` },
        [`${ns.base}${ns.r}${ns.modifierPrefix}${modifier}`]: { 'margin-right': `${size}` },
        [`${ns.base}${ns.b}${ns.modifierPrefix}${modifier}`]: { 'margin-bottom': `${size}` },
        [`${ns.base}${ns.l}${ns.modifierPrefix}${modifier}`]: { 'margin-left': `${size}` },
      }),
  ]

  return _.flatMap(generators, generator => {
    return _.flatMap(negativeMargin, (size, modifier) => {
      return generator(`${size}` === '0' ? `${size}` : `-${size}`, modifier)
    })
  })
}

export default function({ negativeMargin, naming: { negativeMargin: ns } }) {
  return _.flatten([defineNegativeMargin(negativeMargin, ns)])
}
