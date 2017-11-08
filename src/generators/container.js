/* eslint-disable no-shadow */
import _ from 'lodash'
import postcss from 'postcss'
import defineClass from '../util/defineClass'

function extractMinWidths(breakpoints) {
  return _.flatMap(breakpoints, breakpoints => {
    if (_.isString(breakpoints)) {
      breakpoints = { min: breakpoints }
    }

    if (!_.isArray(breakpoints)) {
      breakpoints = [breakpoints]
    }

    return _(breakpoints)
      .filter(breakpoint => {
        return _.has(breakpoint, 'min') || _.has(breakpoint, 'min-width')
      })
      .map(breakpoint => {
        return _.get(breakpoint, 'min-width', breakpoint.min)
      })
      .value()
  })
}

export default function({ screens }) {
  const minWidths = extractMinWidths(screens)

  const atRules = _.map(minWidths, minWidth => {
    const atRule = postcss.atRule({
      name: 'media',
      params: `(min-width: ${minWidth})`,
    })
    atRule.append(
      defineClass('container', {
        'max-width': minWidth,
      })
    )
    return atRule
  })

  return [
    defineClass('container', {
      width: '100%',
    }),
    ...atRules,
  ]
}
