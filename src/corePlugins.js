import preflight from './plugins/preflight'
import container from './plugins/container'
import accessibility from './plugins/accessibility'
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
import order from './plugins/order'
import float from './plugins/float'
import fontFamily from './plugins/fontFamily'
import fontWeight from './plugins/fontWeight'
import height from './plugins/height'
import lineHeight from './plugins/lineHeight'
import listStylePosition from './plugins/listStylePosition'
import listStyleType from './plugins/listStyleType'
import margin from './plugins/margin'
import maxHeight from './plugins/maxHeight'
import maxWidth from './plugins/maxWidth'
import minHeight from './plugins/minHeight'
import minWidth from './plugins/minWidth'
import objectFit from './plugins/objectFit'
import objectPosition from './plugins/objectPosition'
import opacity from './plugins/opacity'
import outline from './plugins/outline'
import overflow from './plugins/overflow'
import padding from './plugins/padding'
import placeholderColor from './plugins/placeholderColor'
import pointerEvents from './plugins/pointerEvents'
import position from './plugins/position'
import inset from './plugins/inset'
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
import wordBreak from './plugins/wordBreak'
import width from './plugins/width'
import zIndex from './plugins/zIndex'
import transform from './plugins/transform'
import transformOrigin from './plugins/transformOrigin'
import scale from './plugins/scale'
import rotate from './plugins/rotate'
import translate from './plugins/translate'

import configurePlugins from './util/configurePlugins'

export default function({ corePlugins: corePluginConfig }) {
  return configurePlugins(corePluginConfig, {
    preflight,
    container,
    accessibility,
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
    order,
    float,
    fontFamily,
    fontWeight,
    height,
    lineHeight,
    listStylePosition,
    listStyleType,
    margin,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    objectFit,
    objectPosition,
    opacity,
    outline,
    overflow,
    padding,
    placeholderColor,
    pointerEvents,
    position,
    inset,
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
    wordBreak,
    width,
    zIndex,
    transform,
    transformOrigin,
    scale,
    rotate,
    translate,
  })
}
