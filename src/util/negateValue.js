export default function (value) {
  // Flip sign of numbers
  if (
    /^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|cm|mm|Q|in|pc|pt|px|em|ex|ch|rem|lh|vw|vh|vmin|vmax)?$/.test(
      value
    )
  ) {
    return value.replace(/^[+-]?/, (sign) => (sign === '-' ? '' : '-'))
  }

  if (value.includes('var(') || value.includes('calc(')) {
    return `calc(${value} * -1)`
  }

  return value
}
