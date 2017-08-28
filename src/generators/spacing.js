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

function definePull(pull) {
  return _.flatMap(pull, (size, modifier) => {
    size = `${size}` === '0' ? `${size}` : `-${size}`

    return defineClasses({
      [`pull-t-${modifier}`]: {
        'margin-top': `${size}`,
      },
      [`pull-r-${modifier}`]: {
        'margin-right': `${size}`,
      },
      [`pull-b-${modifier}`]: {
        'margin-bottom': `${size}`,
      },
      [`pull-l-${modifier}`]: {
        'margin-left': `${size}`,
      },
      [`pull-x-${modifier}`]: {
        'margin-left': `${size}`,
        'margin-right': `${size}`,
      },
      [`pull-y-${modifier}`]: {
        'margin-top': `${size}`,
        'margin-bottom': `${size}`,
      },
      [`pull-${modifier}`]: {
        'margin': `${size}`,
      },
    })
  })
}

export default function ({ spacing }) {
  const padding = _.merge({}, spacing.common, spacing.padding)
  const margin = _.merge({}, spacing.common, spacing.margin)
  const pull = _.merge({}, spacing.common, spacing.pull)

  return _.flatten([
    definePadding(padding),
    defineMargin(margin),
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
    definePull(pull),
  ])
}
