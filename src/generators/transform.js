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

function defineScales(scales) {
  return _.flatMap(scales, (size, modifier) => {
    return defineClasses({
      [`scale-${modifier}`]: {
        transform: `scale(${size}, ${size})`,
      },
      [`scale-x-${modifier}`]: {
        transform: `scaleX(${size})`,
      },
      [`scale-y-${modifier}`]: {
        transform: `scaleY(${size})`,
      },
    })
  })
}

export default function({ rotations, scales }) {
  return _.flatten([
    defineRotations(rotations),
    defineScales(scales),
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
