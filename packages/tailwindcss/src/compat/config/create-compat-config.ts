import type { NamedUtilityValue } from '../../candidate'
import type { Theme } from '../../theme'
import { segment } from '../../utils/segment'
import type { UserConfig } from './types'

function bareValues(fn: (value: NamedUtilityValue) => string | undefined) {
  return {
    // Ideally this would be a Symbol but some of the ecosystem assumes object with
    // string / number keys for example by using `Object.entries()` which means that
    // the function that handles the bare value would be lost
    __BARE_VALUE__: fn,
  }
}

let bareIntegers = bareValues((value) => {
  if (!Number.isNaN(Number(value.value))) {
    return value.value
  }
})

let barePercentages = bareValues((value: NamedUtilityValue) => {
  if (!Number.isNaN(Number(value.value))) {
    return `${value.value}%`
  }
})

let barePixels = bareValues((value: NamedUtilityValue) => {
  if (!Number.isNaN(Number(value.value))) {
    return `${value.value}px`
  }
})

let bareMilliseconds = bareValues((value: NamedUtilityValue) => {
  if (!Number.isNaN(Number(value.value))) {
    return `${value.value}ms`
  }
})

let bareDegrees = bareValues((value: NamedUtilityValue) => {
  if (!Number.isNaN(Number(value.value))) {
    return `${value.value}deg`
  }
})

export function createCompatConfig(theme: Theme): UserConfig {
  return {
    theme: {
      colors: ({ theme }) => theme('color', {}),
      accentColor: ({ theme }) => theme('colors'),
      aspectRatio: bareValues((value) => {
        if (value.fraction === null) return
        let [lhs, rhs] = segment(value.fraction, '/')
        if (!Number.isInteger(Number(lhs)) || !Number.isInteger(Number(rhs))) return
        return value.fraction
      }),
      backdropBlur: ({ theme }) => theme('blur'),
      backdropBrightness: ({ theme }) => ({
        ...theme('brightness'),
        ...barePercentages,
      }),
      backdropContrast: ({ theme }) => ({
        ...theme('contrast'),
        ...barePercentages,
      }),
      backdropGrayscale: ({ theme }) => ({
        ...theme('grayscale'),
        ...barePercentages,
      }),
      backdropHueRotate: ({ theme }) => ({
        ...theme('hueRotate'),
        ...bareDegrees,
      }),
      backdropInvert: ({ theme }) => ({
        ...theme('invert'),
        ...barePercentages,
      }),
      backdropOpacity: ({ theme }) => ({
        ...theme('opacity'),
        ...barePercentages,
      }),
      backdropSaturate: ({ theme }) => ({
        ...theme('saturate'),
        ...barePercentages,
      }),
      backdropSepia: ({ theme }) => ({
        ...theme('sepia'),
        ...barePercentages,
      }),
      backgroundColor: ({ theme }) => theme('colors'),
      backgroundOpacity: ({ theme }) => theme('opacity'),
      border: barePixels,
      borderColor: ({ theme }) => theme('colors'),
      borderOpacity: ({ theme }) => theme('opacity'),
      borderSpacing: ({ theme }) => theme('spacing'),
      boxShadowColor: ({ theme }) => theme('colors'),
      brightness: barePercentages,
      caretColor: ({ theme }) => theme('colors'),
      columns: bareIntegers,
      contrast: barePercentages,
      divideColor: ({ theme }) => theme('borderColor'),
      divideOpacity: ({ theme }) => theme('borderOpacity'),
      divideWidth: ({ theme }) => ({
        ...theme('borderWidth'),
        ...barePixels,
      }),
      fill: ({ theme }) => theme('colors'),
      flexBasis: ({ theme }) => theme('spacing'),
      flexGrow: bareIntegers,
      flexShrink: bareIntegers,
      gap: ({ theme }) => theme('spacing'),
      gradientColorStopPositions: barePercentages,
      gradientColorStops: ({ theme }) => theme('colors'),
      grayscale: barePercentages,
      gridRowEnd: bareIntegers,
      gridRowStart: bareIntegers,
      gridTemplateColumns: bareValues((value) => {
        if (!Number.isNaN(Number(value.value))) {
          return `repeat(${value.value}, minmax(0, 1fr))`
        }
      }),
      gridTemplateRows: bareValues((value) => {
        if (!Number.isNaN(Number(value.value))) {
          return `repeat(${value.value}, minmax(0, 1fr))`
        }
      }),
      height: ({ theme }) => theme('spacing'),
      hueRotate: bareDegrees,
      inset: ({ theme }) => theme('spacing'),
      invert: barePercentages,
      lineClamp: bareIntegers,
      margin: ({ theme }) => theme('spacing'),
      maxHeight: ({ theme }) => theme('spacing'),
      maxWidth: ({ theme }) => theme('spacing'),
      minHeight: ({ theme }) => theme('spacing'),
      minWidth: ({ theme }) => theme('spacing'),
      opacity: barePercentages,
      order: bareIntegers,
      outlineColor: ({ theme }) => theme('colors'),
      outlineOffset: barePixels,
      outlineWidth: barePixels,
      padding: ({ theme }) => theme('spacing'),
      placeholderColor: ({ theme }) => theme('colors'),
      placeholderOpacity: ({ theme }) => theme('opacity'),
      ringColor: ({ theme }) => theme('colors'),
      ringOffsetColor: ({ theme }) => theme('colors'),
      ringOffsetWidth: barePixels,
      ringOpacity: ({ theme }) => theme('opacity'),
      ringWidth: barePixels,
      rotate: bareDegrees,
      saturate: barePercentages,
      scale: barePercentages,
      scrollMargin: ({ theme }) => theme('spacing'),
      scrollPadding: ({ theme }) => theme('spacing'),
      sepia: barePercentages,
      size: ({ theme }) => theme('spacing'),
      skew: bareDegrees,
      space: ({ theme }) => theme('spacing'),
      stroke: ({ theme }) => theme('colors'),
      strokeWidth: barePixels,
      textColor: ({ theme }) => theme('colors'),
      textDecorationColor: ({ theme }) => theme('colors'),
      textDecorationThickness: barePixels,
      textIndent: ({ theme }) => theme('spacing'),
      textOpacity: ({ theme }) => theme('opacity'),
      textUnderlineOffset: barePixels,
      transitionDelay: bareMilliseconds,
      transitionDuration: {
        DEFAULT: theme.get(['--default-transition-duration']) ?? null,
        ...bareMilliseconds,
      },
      transitionTimingFunction: {
        DEFAULT: theme.get(['--default-transition-timing-function']) ?? null,
      },
      translate: ({ theme }) => theme('spacing'),
      width: ({ theme }) => theme('spacing'),
      zIndex: bareIntegers,
    },
  }
}
