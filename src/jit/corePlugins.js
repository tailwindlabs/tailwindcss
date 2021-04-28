import postcss from 'postcss'
import buildMediaQuery from '../util/buildMediaQuery'
import prefixSelector from '../util/prefixSelector'
import * as corePlugins from '../plugins'
import {
  updateLastClasses,
  updateAllClasses,
  transformAllSelectors,
  transformAllClasses,
  transformLastClasses,
} from './pluginUtils'

export default {
  pseudoClassVariants: function ({ config, addVariant }) {
    let pseudoVariants = [
      ['first', 'first-child'],
      ['last', 'last-child'],
      ['odd', 'nth-child(odd)'],
      ['even', 'nth-child(even)'],
      'visited',
      'checked',
      'focus-within',
      'hover',
      'focus',
      'focus-visible',
      'active',
      'disabled',
    ]

    for (let variant of pseudoVariants) {
      let [variantName, state] = Array.isArray(variant) ? variant : [variant, variant]

      addVariant(
        variantName,
        transformAllClasses((className, { withPseudo }) => {
          return withPseudo(`${variantName}${config('separator')}${className}`, state)
        })
      )
    }

    for (let variant of pseudoVariants) {
      let [variantName, state] = Array.isArray(variant) ? variant : [variant, variant]
      let groupVariantName = `group-${variantName}`

      addVariant(
        groupVariantName,
        transformAllSelectors((selector) => {
          let variantSelector = updateAllClasses(selector, (className) => {
            return `${groupVariantName}${config('separator')}${className}`
          })

          if (variantSelector === selector) {
            return null
          }

          let groupSelector = prefixSelector(
            config('prefix'),
            `.group${config('separator')}${state}`
          )

          return `${groupSelector} ${variantSelector}`
        })
      )
    }
  },
  directionVariants: function ({ config, addVariant }) {
    addVariant(
      'ltr',
      transformAllSelectors(
        (selector) =>
          `[dir="ltr"] ${updateAllClasses(
            selector,
            (className) => `ltr${config('separator')}${className}`
          )}`
      )
    )

    addVariant(
      'rtl',
      transformAllSelectors(
        (selector) =>
          `[dir="rtl"] ${updateAllClasses(
            selector,
            (className) => `rtl${config('separator')}${className}`
          )}`
      )
    )
  },
  reducedMotionVariants: function ({ config, addVariant }) {
    addVariant(
      'motion-safe',
      transformLastClasses(
        (className) => {
          return `motion-safe${config('separator')}${className}`
        },
        () =>
          postcss.atRule({
            name: 'media',
            params: '(prefers-reduced-motion: no-preference)',
          })
      )
    )

    addVariant(
      'motion-reduce',
      transformLastClasses(
        (className) => {
          return `motion-reduce${config('separator')}${className}`
        },
        () =>
          postcss.atRule({
            name: 'media',
            params: '(prefers-reduced-motion: reduce)',
          })
      )
    )
  },
  darkVariants: function ({ config, addVariant }) {
    if (config('darkMode') === 'class') {
      addVariant(
        'dark',
        transformAllSelectors((selector) => {
          let variantSelector = updateLastClasses(selector, (className) => {
            return `dark${config('separator')}${className}`
          })

          if (variantSelector === selector) {
            return null
          }

          let darkSelector = prefixSelector(config('prefix'), `.dark`)

          return `${darkSelector} ${variantSelector}`
        })
      )
    } else if (config('darkMode') === 'media') {
      addVariant(
        'dark',
        transformLastClasses(
          (className) => {
            return `dark${config('separator')}${className}`
          },
          () =>
            postcss.atRule({
              name: 'media',
              params: '(prefers-color-scheme: dark)',
            })
        )
      )
    }
  },
  screenVariants: function ({ config, theme, addVariant }) {
    for (let screen in theme('screens')) {
      let size = theme('screens')[screen]
      let query = buildMediaQuery(size)

      addVariant(
        screen,
        transformLastClasses(
          (className) => {
            return `${screen}${config('separator')}${className}`
          },
          () => postcss.atRule({ name: 'media', params: query })
        )
      )
    }
  },

  // Base
  preflight: corePlugins.preflight(),

  // Components
  container: corePlugins.container(),

  // Utilitiles
  accessibility: corePlugins.accessibility(),
  pointerEvents: corePlugins.pointerEvents(),
  visibility: corePlugins.visibility(),
  position: corePlugins.position(),
  inset: corePlugins.inset(),
  isolation: corePlugins.isolation(),
  zIndex: corePlugins.zIndex(),
  order: corePlugins.order(),
  gridColumn: corePlugins.gridColumn(),
  gridColumnStart: corePlugins.gridColumnStart(),
  gridColumnEnd: corePlugins.gridColumnEnd(),
  gridRow: corePlugins.gridRow(),
  gridRowStart: corePlugins.gridRowStart(),
  gridRowEnd: corePlugins.gridRowEnd(),
  float: corePlugins.float(),
  clear: corePlugins.clear(),
  margin: corePlugins.margin(),
  boxSizing: corePlugins.boxSizing(),
  display: corePlugins.display(),
  height: corePlugins.height(),
  maxHeight: corePlugins.maxHeight(),
  minHeight: corePlugins.minHeight(),
  width: corePlugins.width(),
  minWidth: corePlugins.minWidth(),
  maxWidth: corePlugins.maxWidth(),
  flex: corePlugins.flex(),
  flexShrink: corePlugins.flexShrink(),
  flexGrow: corePlugins.flexGrow(),
  tableLayout: corePlugins.tableLayout(),
  borderCollapse: corePlugins.borderCollapse(),

  transform: corePlugins.transform(),
  transformOrigin: corePlugins.transformOrigin(),
  translate: corePlugins.translate(),
  rotate: corePlugins.rotate(),
  skew: corePlugins.skew(),
  scale: corePlugins.scale(),

  animation: corePlugins.animation(),

  cursor: corePlugins.cursor(),
  userSelect: corePlugins.userSelect(),
  resize: corePlugins.resize(),

  listStylePosition: corePlugins.listStylePosition(),
  listStyleType: corePlugins.listStyleType(),

  appearance: corePlugins.appearance(),
  gridAutoColumns: corePlugins.gridAutoColumns(),
  gridAutoFlow: corePlugins.gridAutoFlow(),
  gridAutoRows: corePlugins.gridAutoRows(),
  gridTemplateColumns: corePlugins.gridTemplateColumns(),
  gridTemplateRows: corePlugins.gridTemplateRows(),
  flexDirection: corePlugins.flexDirection(),
  flexWrap: corePlugins.flexWrap(),
  placeContent: corePlugins.placeContent(),
  placeItems: corePlugins.placeItems(),
  alignContent: corePlugins.alignContent(),
  alignItems: corePlugins.alignItems(),
  justifyContent: corePlugins.justifyContent(),
  justifyItems: corePlugins.justifyItems(),
  gap: corePlugins.gap(),
  space: corePlugins.space(),
  divideWidth: corePlugins.divideWidth(),
  divideStyle: corePlugins.divideStyle(),
  divideColor: corePlugins.divideColor(),
  divideOpacity: corePlugins.divideOpacity(),

  placeSelf: corePlugins.placeSelf(),
  alignSelf: corePlugins.alignSelf(),
  justifySelf: corePlugins.justifySelf(),

  overflow: corePlugins.overflow(),
  overscrollBehavior: corePlugins.overscrollBehavior(),
  textOverflow: corePlugins.textOverflow(),
  whitespace: corePlugins.whitespace(),
  wordBreak: corePlugins.wordBreak(),

  borderRadius: corePlugins.borderRadius(),
  borderWidth: corePlugins.borderWidth(),
  borderStyle: corePlugins.borderStyle(),
  borderColor: corePlugins.borderColor(),
  borderOpacity: corePlugins.borderOpacity(),

  backgroundColor: corePlugins.backgroundColor(),
  backgroundOpacity: corePlugins.backgroundOpacity(),
  backgroundImage: corePlugins.backgroundImage(),
  gradientColorStops: corePlugins.gradientColorStops(),
  boxDecorationBreak: corePlugins.boxDecorationBreak(),
  backgroundSize: corePlugins.backgroundSize(),
  backgroundAttachment: corePlugins.backgroundAttachment(),
  backgroundClip: corePlugins.backgroundClip(),
  backgroundPosition: corePlugins.backgroundPosition(),
  backgroundRepeat: corePlugins.backgroundRepeat(),
  backgroundOrigin: corePlugins.backgroundOrigin(),

  fill: corePlugins.fill(),
  stroke: corePlugins.stroke(),
  strokeWidth: corePlugins.strokeWidth(),

  objectFit: corePlugins.objectFit(),
  objectPosition: corePlugins.objectPosition(),

  padding: corePlugins.padding(),

  textAlign: corePlugins.textAlign(),
  verticalAlign: corePlugins.verticalAlign(),
  fontFamily: corePlugins.fontFamily(),
  fontSize: corePlugins.fontSize(),
  fontWeight: corePlugins.fontWeight(),
  textTransform: corePlugins.textTransform(),
  fontStyle: corePlugins.fontStyle(),
  fontVariantNumeric: corePlugins.fontVariantNumeric(),
  lineHeight: corePlugins.lineHeight(),
  letterSpacing: corePlugins.letterSpacing(),
  textColor: corePlugins.textColor(),
  textOpacity: corePlugins.textOpacity(),
  textDecoration: corePlugins.textDecoration(),
  fontSmoothing: corePlugins.fontSmoothing(),
  placeholderColor: corePlugins.placeholderColor(),
  placeholderOpacity: corePlugins.placeholderOpacity(),

  opacity: corePlugins.opacity(),
  backgroundBlendMode: corePlugins.backgroundBlendMode(),
  mixBlendMode: corePlugins.mixBlendMode(),
  boxShadow: corePlugins.boxShadow(),
  outline: corePlugins.outline(),
  ringWidth: corePlugins.ringWidth(),
  ringColor: corePlugins.ringColor(),
  ringOpacity: corePlugins.ringOpacity(),
  ringOffsetWidth: corePlugins.ringOffsetWidth(),
  ringOffsetColor: corePlugins.ringOffsetColor(),

  filter: corePlugins.filter(),
  blur: corePlugins.blur(),
  brightness: corePlugins.brightness(),
  contrast: corePlugins.contrast(),
  dropShadow: corePlugins.dropShadow(),
  grayscale: corePlugins.grayscale(),
  hueRotate: corePlugins.hueRotate(),
  invert: corePlugins.invert(),
  saturate: corePlugins.saturate(),
  sepia: corePlugins.sepia(),

  backdropFilter: corePlugins.backdropFilter(),
  backdropBlur: corePlugins.backdropBlur(),
  backdropBrightness: corePlugins.backdropBrightness(),
  backdropContrast: corePlugins.backdropContrast(),
  backdropGrayscale: corePlugins.backdropGrayscale(),
  backdropHueRotate: corePlugins.backdropHueRotate(),
  backdropInvert: corePlugins.backdropInvert(),
  backdropOpacity: corePlugins.backdropOpacity(),
  backdropSaturate: corePlugins.backdropSaturate(),
  backdropSepia: corePlugins.backdropSepia(),

  transitionProperty: corePlugins.transitionProperty(),
  transitionDelay: corePlugins.transitionDelay(),
  transitionDuration: corePlugins.transitionDuration(),
  transitionTimingFunction: corePlugins.transitionTimingFunction(),
}
