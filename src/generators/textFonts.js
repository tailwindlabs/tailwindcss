import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function ({ text }) {
  return _.map(text.fonts, (families, font) => {
    return defineClass(`font-${font}`, {
      'font-family': `${families}`,
    })
  })
}
