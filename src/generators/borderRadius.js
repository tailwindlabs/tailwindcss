import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function defineBorderRadiusUtilities(borderRadiuses, ns) {
  const generators = [
    (radius, modifier) =>
      defineClasses({
        [`${ns.base}${modifier}`]: {
          'border-radius': `${radius}`,
        },
      }),
    (radius, modifier) =>
      defineClasses({
        [`${ns.withSides}${ns.sides.top}${modifier}`]: {
          'border-top-left-radius': `${radius}`,
          'border-top-right-radius': `${radius}`,
        },
        [`${ns.withSides}${ns.sides.right}${modifier}`]: {
          'border-top-right-radius': `${radius}`,
          'border-bottom-right-radius': `${radius}`,
        },
        [`${ns.withSides}${ns.sides.bottom}${modifier}`]: {
          'border-bottom-right-radius': `${radius}`,
          'border-bottom-left-radius': `${radius}`,
        },
        [`${ns.withSides}${ns.sides.left}${modifier}`]: {
          'border-top-left-radius': `${radius}`,
          'border-bottom-left-radius': `${radius}`,
        },
      }),
    (radius, modifier) =>
      defineClasses({
        [`${ns.withSides}${ns.sides.top}${ns.sidesSeparator}${ns.sides.left}${modifier}`]: {
          'border-top-left-radius': `${radius}`,
        },
        [`${ns.withSides}${ns.sides.top}${ns.sidesSeparator}${ns.sides.right}${modifier}`]: {
          'border-top-right-radius': `${radius}`,
        },
        [`${ns.withSides}${ns.sides.bottom}${ns.sidesSeparator}${ns.sides.right}${modifier}`]: {
          'border-bottom-right-radius': `${radius}`,
        },
        [`${ns.withSides}${ns.sides.bottom}${ns.sidesSeparator}${ns.sides.left}${modifier}`]: {
          'border-bottom-left-radius': `${radius}`,
        },
      }),
  ]

  return _.flatMap(generators, generator => {
    return _.flatMap(borderRadiuses, (radius, modifier) => {
      return generator(radius, modifier === 'default' ? '' : `${ns.modifierPrefix}${modifier}`)
    })
  })
}

module.exports = function({ borderRadius, naming: { rounded: ns } }) {
  return defineBorderRadiusUtilities(borderRadius, ns)
}
