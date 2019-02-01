import lists from './plugins/lists'
import appearance from './plugins/appearance'
import backgroundAttachment from './plugins/backgroundAttachment'
import backgroundColors from './plugins/backgroundColors'
import backgroundPosition from './plugins/backgroundPosition'
import backgroundRepeat from './plugins/backgroundRepeat'
import backgroundSize from './plugins/backgroundSize'
import borderCollapse from './plugins/borderCollapse'
import borderColors from './plugins/borderColors'
import borderRadius from './plugins/borderRadius'
import borderStyle from './plugins/borderStyle'
import borderWidths from './plugins/borderWidths'
import cursor from './plugins/cursor'
import display from './plugins/display'
import flexbox from './plugins/flexbox'
import float from './plugins/float'
import fonts from './plugins/fonts'
import fontWeights from './plugins/fontWeights'
import height from './plugins/height'
import leading from './plugins/leading'
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
import shadows from './plugins/shadows'
import svgFill from './plugins/svgFill'
import svgStroke from './plugins/svgStroke'
import tableLayout from './plugins/tableLayout'
import textAlign from './plugins/textAlign'
import textColors from './plugins/textColors'
import textSizes from './plugins/textSizes'
import textStyle from './plugins/textStyle'
import tracking from './plugins/tracking'
import userSelect from './plugins/userSelect'
import verticalAlign from './plugins/verticalAlign'
import visibility from './plugins/visibility'
import whitespace from './plugins/whitespace'
import width from './plugins/width'
import zIndex from './plugins/zIndex'

function loadPlugins({ styles, variants, corePlugins }, plugins) {
  return Object.keys(plugins)
    .filter(plugin => corePlugins[plugin] !== false)
    .map(plugin => plugins[plugin]({
      values: styles[plugin],
      variants: variants[plugin],
    }))
}

export default function(config) {
  return loadPlugins(config, {
    lists,
    appearance,
    backgroundAttachment,
    backgroundColors,
    backgroundPosition,
    backgroundRepeat,
    backgroundSize,
    borderCollapse,
    borderColors,
    borderRadius,
    borderStyle,
    borderWidths,
    cursor,
    display,
    flexbox,
    float,
    fonts,
    fontWeights,
    height,
    leading,
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
    shadows,
    svgFill,
    svgStroke,
    tableLayout,
    textAlign,
    textColors,
    textSizes,
    textStyle,
    tracking,
    userSelect,
    verticalAlign,
    visibility,
    whitespace,
    width,
    zIndex,
  })
}
