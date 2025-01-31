// Inlined version of code from Vite <https://github.com/vitejs/vite>
// Copyright (c) 2019-present, VoidZero Inc. and Vite contributors
// Released under the MIT License.
//
// Minor modifications have been made to work with the Tailwind CSS codebase

import * as path from 'node:path'
import { toCss, walk } from '../../tailwindcss/src/ast'
import { parse } from '../../tailwindcss/src/css-parser'
import { normalizePath } from './normalize-path'

const cssUrlRE =
  /(?<!@import\s+)(?<=^|[^\w\-\u0080-\uffff])url\((\s*('[^']+'|"[^"]+")\s*|[^'")]+)\)/
const cssImageSetRE = /(?<=image-set\()((?:[\w-]{1,256}\([^)]*\)|[^)])*)(?=\))/
const cssNotProcessedRE = /(?:gradient|element|cross-fade|image)\(/

const dataUrlRE = /^\s*data:/i
const externalRE = /^([a-z]+:)?\/\//
const functionCallRE = /^[A-Z_][.\w-]*\(/i

const imageCandidateRE =
  /(?:^|\s)(?<url>[\w-]+\([^)]*\)|"[^"]*"|'[^']*'|[^,]\S*[^,])\s*(?:\s(?<descriptor>\w[^,]+))?(?:,|$)/g
const nonEscapedDoubleQuoteRE = /(?<!\\)"/g
const escapedSpaceCharactersRE = /(?: |\\t|\\n|\\f|\\r)+/g

const isDataUrl = (url: string): boolean => dataUrlRE.test(url)
const isExternalUrl = (url: string): boolean => externalRE.test(url)

type CssUrlReplacer = (url: string, importer?: string) => string | Promise<string>

interface ImageCandidate {
  url: string
  descriptor: string
}

export async function rewriteUrls({
  css,
  base,
  root,
}: {
  css: string
  base: string
  root: string
}) {
  if (!css.includes('url(') && !css.includes('image-set(')) {
    return css
  }

  let ast = parse(css)

  let promises: Promise<void>[] = []

  function replacerForDeclaration(url: string) {
    if (url[0] === '/') return url

    let absoluteUrl = path.posix.join(normalizePath(base), url)
    let relativeUrl = path.posix.relative(normalizePath(root), absoluteUrl)

    // If the path points to a file in the same directory, `path.relative` will
    // remove the leading `./` and we need to add it back in order to still
    // consider the path relative
    if (!relativeUrl.startsWith('.')) {
      relativeUrl = './' + relativeUrl
    }

    return relativeUrl
  }

  walk(ast, (node) => {
    if (node.kind !== 'declaration') return
    if (!node.value) return

    let isCssUrl = cssUrlRE.test(node.value)
    let isCssImageSet = cssImageSetRE.test(node.value)

    if (isCssUrl || isCssImageSet) {
      let rewriterToUse = isCssImageSet ? rewriteCssImageSet : rewriteCssUrls

      promises.push(
        rewriterToUse(node.value, replacerForDeclaration).then((url) => {
          node.value = url
        }),
      )
    }
  })

  if (promises.length) {
    await Promise.all(promises)
  }

  return toCss(ast)
}

function rewriteCssUrls(css: string, replacer: CssUrlReplacer): Promise<string> {
  return asyncReplace(css, cssUrlRE, async (match) => {
    const [matched, rawUrl] = match
    return await doUrlReplace(rawUrl.trim(), matched, replacer)
  })
}

async function rewriteCssImageSet(css: string, replacer: CssUrlReplacer): Promise<string> {
  return await asyncReplace(css, cssImageSetRE, async (match) => {
    const [, rawUrl] = match
    const url = await processSrcSet(rawUrl, async ({ url }) => {
      // the url maybe url(...)
      if (cssUrlRE.test(url)) {
        return await rewriteCssUrls(url, replacer)
      }
      if (!cssNotProcessedRE.test(url)) {
        return await doUrlReplace(url, url, replacer)
      }
      return url
    })
    return url
  })
}

async function doUrlReplace(
  rawUrl: string,
  matched: string,
  replacer: CssUrlReplacer,
  funcName: string = 'url',
) {
  let wrap = ''
  const first = rawUrl[0]
  if (first === `"` || first === `'`) {
    wrap = first
    rawUrl = rawUrl.slice(1, -1)
  }

  if (skipUrlReplacer(rawUrl)) {
    return matched
  }

  let newUrl = await replacer(rawUrl)
  // The new url might need wrapping even if the original did not have it, e.g. if a space was added during replacement
  if (wrap === '' && newUrl !== encodeURI(newUrl)) {
    wrap = '"'
  }
  // If wrapping in single quotes and newUrl also contains single quotes, switch to double quotes.
  // Give preference to double quotes since SVG inlining converts double quotes to single quotes.
  if (wrap === "'" && newUrl.includes("'")) {
    wrap = '"'
  }
  // Escape double quotes if they exist (they also tend to be rarer than single quotes)
  if (wrap === '"' && newUrl.includes('"')) {
    newUrl = newUrl.replace(nonEscapedDoubleQuoteRE, '\\"')
  }
  return `${funcName}(${wrap}${newUrl}${wrap})`
}

function skipUrlReplacer(rawUrl: string, aliases?: string[]) {
  return (
    isExternalUrl(rawUrl) ||
    isDataUrl(rawUrl) ||
    !rawUrl[0].match(/[\.a-zA-Z0-9_]/) ||
    functionCallRE.test(rawUrl)
  )
}

function processSrcSet(
  srcs: string,
  replacer: (arg: ImageCandidate) => Promise<string>,
): Promise<string> {
  return Promise.all(
    parseSrcset(srcs).map(async ({ url, descriptor }) => ({
      url: await replacer({ url, descriptor }),
      descriptor,
    })),
  ).then(joinSrcset)
}

function parseSrcset(string: string): ImageCandidate[] {
  const matches = string
    .trim()
    .replace(escapedSpaceCharactersRE, ' ')
    .replace(/\r?\n/, '')
    .replace(/,\s+/, ', ')
    .replaceAll(/\s+/g, ' ')
    .matchAll(imageCandidateRE)
  return Array.from(matches, ({ groups }) => ({
    url: groups?.url?.trim() ?? '',
    descriptor: groups?.descriptor?.trim() ?? '',
  })).filter(({ url }) => !!url)
}

function joinSrcset(ret: ImageCandidate[]) {
  return ret.map(({ url, descriptor }) => url + (descriptor ? ` ${descriptor}` : '')).join(', ')
}

async function asyncReplace(
  input: string,
  re: RegExp,
  replacer: (match: RegExpExecArray) => string | Promise<string>,
): Promise<string> {
  let match: RegExpExecArray | null
  let remaining = input
  let rewritten = ''
  while ((match = re.exec(remaining))) {
    rewritten += remaining.slice(0, match.index)
    rewritten += await replacer(match)
    remaining = remaining.slice(match.index + match[0].length)
  }
  rewritten += remaining
  return rewritten
}
