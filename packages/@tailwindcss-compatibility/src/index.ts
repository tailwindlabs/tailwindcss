// import postcssCascadeLayers from '@csstools/postcss-cascade-layers'
import postcssColorMixFunction from '@csstools/postcss-color-mix-function'
import postcssOklabFunction from '@csstools/postcss-oklab-function'
import autoprefixer from 'autoprefixer'
import type { AcceptedPlugin, PluginCreator } from 'postcss'
// @ts-ignore
import postcssMediaMinmax from 'postcss-media-minmax'
import postcssNesting from 'postcss-nesting'
import atPropertyPolyfill from './at-property-polyfill'

// TODO:
//  - [ ] Replace `calc(infinity)` stuff
//  - tbd

function compatibility(): AcceptedPlugin {
  return {
    postcssPlugin: '@tailwindcss/compatibility',
    plugins: [
      // postcssCascadeLayers(),
      atPropertyPolyfill(),
      postcssMediaMinmax(),
      postcssOklabFunction(),
      postcssColorMixFunction(),
      postcssNesting(),
      autoprefixer(),
    ],
  }
}

export default Object.assign(compatibility, { postcss: true }) as PluginCreator<{}>
