import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function ({ fonts }) {
  return _.map(fonts, (families, font) => {
    return defineClass(`font-${font}`, {
      'font-family': `${families}`,
    })
  })
}
