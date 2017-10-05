import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function definePadding(padding) {
  return _.flatMap(padding, (size, modifier) => {
    return defineClasses({
      [`pt-${modifier}`]: {
        'padding-top': `${size}`,
      },
      [`pr-${modifier}`]: {
        'padding-right': `${size}`,
      },
      [`pb-${modifier}`]: {
        'padding-bottom': `${size}`,
      },
      [`pl-${modifier}`]: {
        'padding-left': `${size}`,
      },
      [`px-${modifier}`]: {
        'padding-left': `${size}`,
        'padding-right': `${size}`,
      },
      [`py-${modifier}`]: {
        'padding-top': `${size}`,
        'padding-bottom': `${size}`,
      },
      [`p-${modifier}`]: {
        'padding': `${size}`,
      },
    })
  })
}

function defineMargin(margin) {
  return _.flatMap(margin, (size, modifier) => {
    return defineClasses({
      [`mt-${modifier}`]: {
        'margin-top': `${size}`,
      },
      [`mr-${modifier}`]: {
        'margin-right': `${size}`,
      },
      [`mb-${modifier}`]: {
        'margin-bottom': `${size}`,
      },
      [`ml-${modifier}`]: {
        'margin-left': `${size}`,
      },
      [`mx-${modifier}`]: {
        'margin-left': `${size}`,
        'margin-right': `${size}`,
      },
      [`my-${modifier}`]: {
        'margin-top': `${size}`,
        'margin-bottom': `${size}`,
      },
      [`m-${modifier}`]: {
        'margin': `${size}`,
      },
    })
  })
}

function defineNegativeMargin(negativeMargin) {
  return _.flatMap(negativeMargin, (size, modifier) => {
    size = `${size}` === '0' ? `${size}` : `-${size}`

    return defineClasses({
      [`-mt-${modifier}`]: {
        'margin-top': `${size}`,
      },
      [`-mr-${modifier}`]: {
        'margin-right': `${size}`,
      },
      [`-mb-${modifier}`]: {
        'margin-bottom': `${size}`,
      },
      [`-ml-${modifier}`]: {
        'margin-left': `${size}`,
      },
      [`-mx-${modifier}`]: {
        'margin-left': `${size}`,
        'margin-right': `${size}`,
      },
      [`-my-${modifier}`]: {
        'margin-top': `${size}`,
        'margin-bottom': `${size}`,
      },
      [`-m${modifier}`]: {
        'margin': `${size}`,
      },
    })
  })
}

export default function ({ spacing }) {
  return _.flatten([
    definePadding(spacing.padding),
    defineMargin(spacing.margin),
    defineClasses({
      'mr-auto': {
        'margin-right': 'auto',
      },
      'ml-auto': {
        'margin-left': 'auto',
      },
      'mx-auto': {
        'margin-left': 'auto',
        'margin-right': 'auto',
      },
    }),
    defineNegativeMargin(spacing.negativeMargin),
  ])
}
