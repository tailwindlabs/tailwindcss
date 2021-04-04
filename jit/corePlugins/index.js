const postcss = require('postcss')
const buildMediaQuery = require('../../lib/util/buildMediaQuery').default
const prefixSelector = require('../../lib/util/prefixSelector').default
const {
  updateLastClasses,
  updateAllClasses,
  transformAllSelectors,
  transformAllClasses,
  transformLastClasses,
} = require('../pluginUtils')

module.exports = {
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
        () => postcss.atRule({ name: 'media', params: '(prefers-reduced-motion: no-preference)' })
      )
    )

    addVariant(
      'motion-reduce',
      transformLastClasses(
        (className) => {
          return `motion-reduce${config('separator')}${className}`
        },
        () => postcss.atRule({ name: 'media', params: '(prefers-reduced-motion: reduce)' })
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
          () => postcss.atRule({ name: 'media', params: '(prefers-color-scheme: dark)' })
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
  preflight: require('./preflight'),

  // Components
  container: require('./container'),

  // Utilitiles
  accessibility: require('./accessibility'),
  pointerEvents: require('./pointerEvents'),
  visibility: require('./visibility'),
  position: require('./position'),
  inset: require('./inset'),
  isolation: require('./isolation'),
  zIndex: require('./zIndex'),
  order: require('./order'),
  gridColumn: require('./gridColumn'),
  gridColumnEnd: require('./gridColumnEnd'),
  gridColumnStart: require('./gridColumnStart'),
  gridRow: require('./gridRow'),
  gridRowEnd: require('./gridRowEnd'),
  gridRowStart: require('./gridRowStart'),
  float: require('./float'),
  clear: require('./clear'),
  margin: require('./margin'),
  boxSizing: require('./boxSizing'),
  display: require('./display'),
  height: require('./height'),
  maxHeight: require('./maxHeight'),
  minHeight: require('./minHeight'),
  width: require('./width'),
  minWidth: require('./minWidth'),
  maxWidth: require('./maxWidth'),
  flex: require('./flex'),
  flexShrink: require('./flexShrink'),
  flexGrow: require('./flexGrow'),
  tableLayout: require('./tableLayout'),
  borderCollapse: require('./borderCollapse'),

  transform: require('./transform'),
  transformOrigin: require('./transformOrigin'),
  translate: require('./translate'),
  rotate: require('./rotate'),
  skew: require('./skew'),
  scale: require('./scale'),

  animation: require('./animation'),

  cursor: require('./cursor'),
  userSelect: require('./userSelect'),
  resize: require('./resize'),

  listStylePosition: require('./listStylePosition'),
  listStyleType: require('./listStyleType'),

  appearance: require('./appearance'),
  gridAutoColumns: require('./gridAutoColumns'),
  gridAutoFlow: require('./gridAutoFlow'),
  gridAutoRows: require('./gridAutoRows'),
  gridTemplateColumns: require('./gridTemplateColumns'),
  gridTemplateRows: require('./gridTemplateRows'),
  flexDirection: require('./flexDirection'),
  flexWrap: require('./flexWrap'),
  placeContent: require('./placeContent'),
  placeItems: require('./placeItems'),
  alignContent: require('./alignContent'),
  alignItems: require('./alignItems'),
  justifyContent: require('./justifyContent'),
  justifyItems: require('./justifyItems'),
  gap: require('./gap'),
  space: require('./space'),
  divideWidth: require('./divideWidth'),
  divideStyle: require('./divideStyle'),
  divideColor: require('./divideColor'),
  divideOpacity: require('./divideOpacity'),

  placeSelf: require('./placeSelf'),
  alignSelf: require('./alignSelf'),
  justifySelf: require('./justifySelf'),

  overflow: require('./overflow'),
  overscrollBehavior: require('./overscrollBehavior'),
  textOverflow: require('./textOverflow'),
  whitespace: require('./whitespace'),
  wordBreak: require('./wordBreak'),

  borderRadius: require('./borderRadius'),
  borderWidth: require('./borderWidth'),
  borderStyle: require('./borderStyle'),
  borderColor: require('./borderColor'),
  borderOpacity: require('./borderOpacity'),

  backgroundColor: require('./backgroundColor'),
  backgroundOpacity: require('./backgroundOpacity'),
  backgroundImage: require('./backgroundImage'),
  gradientColorStops: require('./gradientColorStops'),
  boxDecorationBreak: require('./boxDecorationBreak'),
  backgroundSize: require('./backgroundSize'),
  backgroundAttachment: require('./backgroundAttachment'),
  backgroundClip: require('./backgroundClip'),
  backgroundPosition: require('./backgroundPosition'),
  backgroundRepeat: require('./backgroundRepeat'),

  fill: require('./fill'),
  stroke: require('./stroke'),
  strokeWidth: require('./strokeWidth'),

  objectFit: require('./objectFit'),
  objectPosition: require('./objectPosition'),

  padding: require('./padding'),

  textAlign: require('./textAlign'),
  verticalAlign: require('./verticalAlign'),
  fontFamily: require('./fontFamily'),
  fontSize: require('./fontSize'),
  fontWeight: require('./fontWeight'),
  textTransform: require('./textTransform'),
  fontStyle: require('./fontStyle'),
  fontVariantNumeric: require('./fontVariantNumeric'),
  lineHeight: require('./lineHeight'),
  letterSpacing: require('./letterSpacing'),
  textColor: require('./textColor'),
  textOpacity: require('./textOpacity'),
  textDecoration: require('./textDecoration'),
  fontSmoothing: require('./fontSmoothing'),
  placeholderColor: require('./placeholderColor'),
  placeholderOpacity: require('./placeholderOpacity'),

  opacity: require('./opacity'),
  backgroundBlendMode: require('./backgroundBlendMode'),
  mixBlendMode: require('./mixBlendMode'),
  boxShadow: require('./boxShadow'),
  outline: require('./outline'),
  ringWidth: require('./ringWidth'),
  ringColor: require('./ringColor'),
  ringOpacity: require('./ringOpacity'),
  ringOffsetWidth: require('./ringOffsetWidth'),
  ringOffsetColor: require('./ringOffsetColor'),

  filter: require('../../lib/plugins/filter').default(),
  blur: require('../../lib/plugins/blur').default(),
  brightness: require('../../lib/plugins/brightness').default(),
  contrast: require('../../lib/plugins/contrast').default(),
  dropShadow: require('../../lib/plugins/dropShadow').default(),
  grayscale: require('../../lib/plugins/grayscale').default(),
  hueRotate: require('../../lib/plugins/hueRotate').default(),
  invert: require('../../lib/plugins/invert').default(),
  saturate: require('../../lib/plugins/saturate').default(),
  sepia: require('../../lib/plugins/sepia').default(),

  backdropFilter: require('../../lib/plugins/backdropFilter').default(),
  backdropBlur: require('../../lib/plugins/backdropBlur').default(),
  backdropBrightness: require('../../lib/plugins/backdropBrightness').default(),
  backdropContrast: require('../../lib/plugins/backdropContrast').default(),
  backdropGrayscale: require('../../lib/plugins/backdropGrayscale').default(),
  backdropHueRotate: require('../../lib/plugins/backdropHueRotate').default(),
  backdropInvert: require('../../lib/plugins/backdropInvert').default(),
  backdropOpacity: require('../../lib/plugins/backdropOpacity').default(),
  backdropSaturate: require('../../lib/plugins/backdropSaturate').default(),
  backdropSepia: require('../../lib/plugins/backdropSepia').default(),

  transitionProperty: require('./transitionProperty'),
  transitionDelay: require('./transitionDelay'),
  transitionDuration: require('./transitionDuration'),
  transitionTimingFunction: require('./transitionTimingFunction'),
}
