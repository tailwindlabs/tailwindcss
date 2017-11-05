import _ from 'lodash'
import postcss from 'postcss'
import defineClasses from '../util/defineClasses'

export default function() {
  return _.concat(
    defineClasses({
      'float-right': { float: 'right' },
      'float-left': { float: 'left' },
      'float-none': { float: 'none' },
    }),
    postcss.parse(`
      .clearfix:after {
        content: "";
        display: table;
        clear: both;
      }
    `).nodes
  )
}
