import _ from 'lodash'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import postcssJs from 'postcss-js'

const parseObjectStyles = styles => {
  if (!Array.isArray(styles)) {
    return parseObjectStyles([styles])
  }

  return _.flatMap(
    styles,
    style => postcss([postcssNested]).process(style, { parser: postcssJs }).root.nodes
  )
}

export default parseObjectStyles
