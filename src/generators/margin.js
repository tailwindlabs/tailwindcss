import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function defineMargin(margin) {
  const generators = [
    (size, modifier) =>
      defineClasses({
        [`m-${modifier}`]: { margin: `${size}` },
      }),
    (size, modifier) =>
      defineClasses({
        [`my-${modifier}`]: { 'margin-top': `${size}`, 'margin-bottom': `${size}` },
        [`mx-${modifier}`]: { 'margin-left': `${size}`, 'margin-right': `${size}` },
      }),
    (size, modifier) =>
      defineClasses({
        [`mt-${modifier}`]: { 'margin-top': `${size}` },
        [`mr-${modifier}`]: { 'margin-right': `${size}` },
        [`mb-${modifier}`]: { 'margin-bottom': `${size}` },
        [`ml-${modifier}`]: { 'margin-left': `${size}` },
      }),
  ]

  return _.flatMap(generators, generator => {
    return _.flatMap(margin, generator)
  })
}

export default function({ margin }) {
  return _.flatten([defineMargin(margin)])
}
