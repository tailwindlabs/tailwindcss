export function fit(
  parentWidth,
  parentHeight,
  childWidth,
  childHeight,
  scale = 1,
  offsetX = 0.5,
  offsetY = 0.5
) {
  const childRatio = childWidth / childHeight
  const parentRatio = parentWidth / parentHeight
  let width = parentWidth * scale
  let height = parentHeight * scale

  if (childRatio < parentRatio) {
    height = width / childRatio
  } else {
    width = height * childRatio
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
    left: Math.round((parentWidth - width) * offsetX),
    top: Math.round((parentHeight - height) * offsetY),
  }
}
