import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function defineNegativeMargin(negativeMargin) {
  const generators = [
    (size, modifier) =>
      defineClasses({
        [`-m-${modifier}`]: { margin: `${size}` },
      }),
    (size, modifier) =>
      defineClasses({
        [`-my-${modifier}`]: { 'margin-top': `${size}`, 'margin-bottom': `${size}` },
        [`-mx-${modifier}`]: { 'margin-left': `${size}`, 'margin-right': `${size}` },
      }),
    (size, modifier) =>
      defineClasses({
        [`-mt-${modifier}`]: { 'margin-top': `${size}` },
        [`-mr-${modifier}`]: { 'margin-right': `${size}` },
        [`-mb-${modifier}`]: { 'margin-bottom': `${size}` },
        [`-ml-${modifier}`]: { 'margin-left': `${size}` },
      }),
  ]

  return _.flatMap(generators, generator => {
    return _.flatMap(negativeMargin, (size, modifier) => {
      return generator(`${size}` === '0' ? `${size}` : `-${size}`, modifier)
    })
  })
}

export default function({ negativeMargin }) {
  return _.flatten([defineNegativeMargin(negativeMargin)])
}
