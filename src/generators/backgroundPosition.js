import defineClasses from '../util/defineClasses'

export default function({ naming: { backgroundPositions: ns } }) {
  return defineClasses({
    [`${ns.base}${ns.sides.bottom}`]: { 'background-position': 'bottom' },
    [`${ns.base}${ns.sides.center}`]: { 'background-position': 'center' },
    [`${ns.base}${ns.sides.left}`]: { 'background-position': 'left' },
    [`${ns.base}${ns.sides.leftBottom}`]: { 'background-position': 'left bottom' },
    [`${ns.base}${ns.sides.leftTop}`]: { 'background-position': 'left top' },
    [`${ns.base}${ns.sides.right}`]: { 'background-position': 'right' },
    [`${ns.base}${ns.sides.rightBottom}`]: { 'background-position': 'right bottom' },
    [`${ns.base}${ns.sides.rightTop}`]: { 'background-position': 'right top' },
    [`${ns.base}${ns.sides.top}`]: { 'background-position': 'top' },
  })
}
