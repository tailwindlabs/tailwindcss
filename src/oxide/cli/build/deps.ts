import packageJson from '../../../../package.json'
import browserslist from 'browserslist'
import { Result } from 'postcss'

import {
  // @ts-ignore
  lazyPostcss,

  // @ts-ignore
  lazyPostcssImport,

  // @ts-ignore
  lazyCssnano,

  // @ts-ignore
} from '../../../../peers/index'

export function lazyLightningCss() {
  // TODO: Make this lazy/bundled
  return require('lightningcss')
}

let lightningCss

function loadLightningCss() {
  if (lightningCss) {
    return lightningCss
  }

  // Try to load a local version first
  try {
    return (lightningCss = require('lightningcss'))
  } catch {}

  return (lightningCss = lazyLightningCss())
}

export async function lightningcss(shouldMinify: boolean, result: Result) {
  let css = loadLightningCss()

  try {
    let transformed = css.transform({
      filename: result.opts.from || 'input.css',
      code: Buffer.from(result.css, 'utf-8'),
      minify: shouldMinify,
      sourceMap: !!result.map,
      inputSourceMap: result.map ? result.map.toString() : undefined,
      targets: css.browserslistToTargets(browserslist(packageJson.browserslist)),
      drafts: {
        nesting: true,
      },
    })

    return Object.assign(result, {
      css: transformed.code.toString('utf8'),
      map: result.map
        ? Object.assign(result.map, {
            toString() {
              return transformed.map.toString()
            },
          })
        : result.map,
    })
  } catch (err) {
    console.error('Unable to use Lightning CSS. Using raw version instead.')
    console.error(err)

    return result
  }
}

/**
 * @returns {import('postcss')}
 */
export function loadPostcss() {
  // Try to load a local `postcss` version first
  try {
    return require('postcss')
  } catch {}

  return lazyPostcss()
}

export function loadPostcssImport() {
  // Try to load a local `postcss-import` version first
  try {
    return require('postcss-import')
  } catch {}

  return lazyPostcssImport()
}
