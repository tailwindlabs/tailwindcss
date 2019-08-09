import reduceCalc from 'reduce-css-calc'

export default function(value) {
  try {
    return reduceCalc(`calc(${value} * -1)`)
  } catch (e) {
    return value
  }
}
