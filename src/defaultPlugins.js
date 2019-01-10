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

export default function (config) {
  return [
    config.modules.cursor === false ? () => {} : cursor(),
    config.modules.display === false ? () => {} : display(),
    config.modules.flexbox === false ? () => {} : flexbox(),
    config.modules.float === false ? () => {} : float(),
    config.modules.fonts === false ? () => {} : fonts(),
    config.modules.fontWeights === false ? () => {} : fontWeights(),
    config.modules.height === false ? () => {} : height(),
    config.modules.leading === false ? () => {} : leading(),
    config.modules.margin === false ? () => {} : margin(),
    config.modules.maxHeight === false ? () => {} : maxHeight(),
    config.modules.maxWidth === false ? () => {} : maxWidth(),
    config.modules.minHeight === false ? () => {} : minHeight(),
    config.modules.minWidth === false ? () => {} : minWidth(),
    config.modules.negativeMargin === false ? () => {} : negativeMargin(),
    config.modules.objectFit === false ? () => {} : objectFit(),
    config.modules.objectPosition === false ? () => {} : objectPosition(),
    config.modules.opacity === false ? () => {} : opacity(),
    config.modules.outline === false ? () => {} : outline(),
    config.modules.overflow === false ? () => {} : overflow(),
    config.modules.padding === false ? () => {} : padding(),
    config.modules.pointerEvents === false ? () => {} : pointerEvents(),
    config.modules.position === false ? () => {} : position(),
    config.modules.resize === false ? () => {} : resize(),
    config.modules.shadows === false ? () => {} : shadows(),
    config.modules.svgFill === false ? () => {} : svgFill(),
    config.modules.svgStroke === false ? () => {} : svgStroke(),
    config.modules.tableLayout === false ? () => {} : tableLayout(),
    config.modules.textAlign === false ? () => {} : textAlign(),
    config.modules.textColors === false ? () => {} : textColors(),
    config.modules.textSizes === false ? () => {} : textSizes(),
    config.modules.textStyle === false ? () => {} : textStyle(),
    config.modules.tracking === false ? () => {} : tracking(),
    config.modules.userSelect === false ? () => {} : userSelect(),
    config.modules.verticalAlign === false ? () => {} : verticalAlign(),
    config.modules.visibility === false ? () => {} : visibility(),
    config.modules.whitespace === false ? () => {} : whitespace(),
    config.modules.width === false ? () => {} : width(),
    config.modules.zIndex === false ? () => {} : zIndex(),
  ]
}
