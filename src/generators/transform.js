import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function defineRotations(rotations) {
  return _.flatMap(rotations, (size, modifier) => {
    return defineClasses({
      [`rotate-x-${modifier}`]: {
        transform: `rotateY(${size})`,
      },
      [`rotate-y-${modifier}`]: {
        transform: `rotateX(${size})`,
      },
      [`rotate-z-${modifier}`]: {
        transform: `rotateZ(${size})`,
      },
    })
  })
}

export default function({ rotations }) {
  return _.flatten([
    defineRotations(rotations),
    defineClasses({
      'rotate-x': {
        transform: 'rotateY(180deg)',
      },
      'rotate-y': {
        transform: 'rotateX(180deg)',
      },
      'rotate-z': {
        transform: 'rotateZ(180deg)',
      },
    })
  ])
}
