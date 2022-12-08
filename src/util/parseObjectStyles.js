import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import postcssJs from 'postcss-js'

import { env } from '../lib/sharedState'

export default function parseObjectStyles(styles) {
  if (!Array.isArray(styles)) {
    return parseObjectStyles([styles])
  }

  return styles.flatMap((style) => {
    return postcss(
      [env.OXIDE ? null : postcssNested({ bubble: ['screen'] })].filter(Boolean)
    ).process(style, {
      parser: postcssJs,
    }).root.nodes
  })
}
