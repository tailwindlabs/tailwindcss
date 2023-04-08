const flattenColorPalette = (colors, includeFunctions, ...functionParameters) =>
  Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values == 'object'
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === 'DEFAULT' ? '' : `-${number}`)]: hex,
          }))
        : typeof values == 'function'
        ? includeFunctions
          ? [{ [`${color}`]: values(...functionParameters) }]
          : []
        : [{ [`${color}`]: values }]
    )
  )

export default flattenColorPalette
