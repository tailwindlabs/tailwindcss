import _ from 'lodash'

export default function toColorValue(maybeFunction) {
  return _.isFunction(maybeFunction) ? maybeFunction({}) : maybeFunction
}
