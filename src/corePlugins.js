import preflight from './plugins/preflight'
import listStyle from './plugins/listStyle'
import appearance from './plugins/appearance'
import backgroundAttachment from './plugins/backgroundAttachment'
import backgroundColor from './plugins/backgroundColor'
import backgroundPosition from './plugins/backgroundPosition'
import backgroundRepeat from './plugins/backgroundRepeat'
import backgroundSize from './plugins/backgroundSize'
import borderCollapse from './plugins/borderCollapse'
import borderColor from './plugins/borderColor'
import borderRadius from './plugins/borderRadius'
import borderStyle from './plugins/borderStyle'
import borderWidth from './plugins/borderWidth'
import cursor from './plugins/cursor'
import display from './plugins/display'
import flexDirection from './plugins/flexDirection'
import flexWrap from './plugins/flexWrap'
import alignItems from './plugins/alignItems'
import alignSelf from './plugins/alignSelf'
import justifyContent from './plugins/justifyContent'
import alignContent from './plugins/alignContent'
import flex from './plugins/flex'
import flexGrow from './plugins/flexGrow'
import flexShrink from './plugins/flexShrink'
import float from './plugins/float'
import fontFamily from './plugins/fontFamily'
import fontWeight from './plugins/fontWeight'
import height from './plugins/height'
import lineHeight from './plugins/lineHeight'
import margin from './plugins/margin'
import maxHeight from './plugins/maxHeight'
import maxWidth from './plugins/maxWidth'
import minHeight from './plugins/minHeight'
import minWidth from './plugins/minWidth'
import negativeMargin from './plugins/negativeMargin'
import objectFit from './plugins/objectFit'
import objectPosition from './plugins/objectPosition'
import opacity from './plugins/opacity'
import outline from './plugins/outline'
import overflow from './plugins/overflow'
import padding from './plugins/padding'
import pointerEvents from './plugins/pointerEvents'
import position from './plugins/position'
import resize from './plugins/resize'
import boxShadow from './plugins/boxShadow'
import fill from './plugins/fill'
import stroke from './plugins/stroke'
import tableLayout from './plugins/tableLayout'
import textAlign from './plugins/textAlign'
import textColor from './plugins/textColor'
import fontSize from './plugins/fontSize'
import fontStyle from './plugins/fontStyle'
import textTransform from './plugins/textTransform'
import textDecoration from './plugins/textDecoration'
import fontSmoothing from './plugins/fontSmoothing'
import letterSpacing from './plugins/letterSpacing'
import userSelect from './plugins/userSelect'
import verticalAlign from './plugins/verticalAlign'
import visibility from './plugins/visibility'
import whitespace from './plugins/whitespace'
import width from './plugins/width'
import zIndex from './plugins/zIndex'

import _ from 'lodash'
import configurePlugins from './util/configurePlugins'

function loadPlugins({ theme, variants, corePlugins }, plugins) {
  const defaultCorePluginConfig = _.fromPairs(
    Object.keys(plugins).map(plugin => [
      plugin,
      {
        values: theme[plugin],
        variants: variants[plugin],
      },
    ])
  )

  return configurePlugins(plugins, corePlugins, defaultCorePluginConfig)
}

export default function(config) {
  return loadPlugins(config, {
    preflight,
    listStyle,
    appearance,
    backgroundAttachment,
    backgroundColor,
    backgroundPosition,
    backgroundRepeat,
    backgroundSize,
    borderCollapse,
    borderColor,
    borderRadius,
    borderStyle,
    borderWidth,
    cursor,
    display,
    flexDirection,
    flexWrap,
    alignItems,
    alignSelf,
    justifyContent,
    alignContent,
    flex,
    flexGrow,
    flexShrink,
    float,
    fontFamily,
    fontWeight,
    height,
    lineHeight,
    margin,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    negativeMargin,
    objectFit,
    objectPosition,
    opacity,
    outline,
    overflow,
    padding,
    pointerEvents,
    position,
    resize,
    boxShadow,
    fill,
    stroke,
    tableLayout,
    textAlign,
    textColor,
    fontSize,
    fontStyle,
    textTransform,
    textDecoration,
    fontSmoothing,
    letterSpacing,
    userSelect,
    verticalAlign,
    visibility,
    whitespace,
    width,
    zIndex,
  })
}
