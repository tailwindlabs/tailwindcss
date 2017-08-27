import _ from 'lodash'

export default function findColor(colors, color) {
  return _.get(colors, color, color)
}
