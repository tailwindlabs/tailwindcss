import _ from 'lodash'
import postcss from 'postcss'
import defineClasses from '../util/defineClasses'

export default function({ naming: { floats: ns } }) {
  return _.concat(
    defineClasses({
      [ns.floatRight]: { float: 'right' },
      [ns.floatLeft]: { float: 'left' },
      [ns.floatNone]: { float: 'none' },
    }),
    postcss.parse(`
      .${ns.clearfix}:after {
        content: "";
        display: table;
        clear: both;
      }
    `).nodes
  )
}
