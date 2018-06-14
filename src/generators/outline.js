import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ outline }) {
  return _.map(outline, (value, modifier) => {
    return defineClass(modifier === 'default' ? 'outline' : `outline-${modifier}`, {
      outline: value,
    })
  })
}
