import preflight from './plugins/preflight'
import container from './plugins/container'
import space from './plugins/space'
import divideWidth from './plugins/divideWidth'
import divideColor from './plugins/divideColor'
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
import boxSizing from './plugins/boxSizing'
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
import clear from './plugins/clear'
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
import strokeWidth from './plugins/strokeWidth'
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
import gap from './plugins/gap'
import gridAutoFlow from './plugins/gridAutoFlow'
import gridTemplateColumns from './plugins/gridTemplateColumns'
import gridColumn from './plugins/gridColumn'
import gridColumnStart from './plugins/gridColumnStart'
import gridColumnEnd from './plugins/gridColumnEnd'
import gridTemplateRows from './plugins/gridTemplateRows'
import gridRow from './plugins/gridRow'
import gridRowStart from './plugins/gridRowStart'
import gridRowEnd from './plugins/gridRowEnd'
import transform from './plugins/transform'
import transformOrigin from './plugins/transformOrigin'
import scale from './plugins/scale'
import rotate from './plugins/rotate'
import translate from './plugins/translate'
import skew from './plugins/skew'
import transitionProperty from './plugins/transitionProperty'
import transitionTimingFunction from './plugins/transitionTimingFunction'
import transitionDuration from './plugins/transitionDuration'
import transitionDelay from './plugins/transitionDelay'
import divideOpacity from './plugins/divideOpacity'
import backgroundOpacity from './plugins/backgroundOpacity'
import borderOpacity from './plugins/borderOpacity'
import textOpacity from './plugins/textOpacity'
import placeholderOpacity from './plugins/placeholderOpacity'

import configurePlugins from './util/configurePlugins'

export default function({ corePlugins: corePluginConfig }) {
  return configurePlugins(corePluginConfig, {
    preflight,
    container,
    space,
    divideWidth,
    divideColor,
    divideOpacity,
    accessibility,
    appearance,
    backgroundAttachment,
    backgroundColor,
    backgroundOpacity,
    backgroundPosition,
    backgroundRepeat,
    backgroundSize,
    borderCollapse,
    borderColor,
    borderOpacity,
    borderRadius,
    borderStyle,
    borderWidth,
    boxSizing,
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
    clear,
    fontFamily,
    fontWeight,
    height,
    fontSize,
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
    placeholderOpacity,
    pointerEvents,
    position,
    inset,
    resize,
    boxShadow,
    fill,
    stroke,
    strokeWidth,
    tableLayout,
    textAlign,
    textColor,
    textOpacity,
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
    gap,
    gridAutoFlow,
    gridTemplateColumns,
    gridColumn,
    gridColumnStart,
    gridColumnEnd,
    gridTemplateRows,
    gridRow,
    gridRowStart,
    gridRowEnd,
    transform,
    transformOrigin,
    scale,
    rotate,
    translate,
    skew,
    transitionProperty,
    transitionTimingFunction,
    transitionDuration,
    transitionDelay,
  })
}
