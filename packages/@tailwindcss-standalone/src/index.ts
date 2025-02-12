import fs from 'node:fs'
import { createRequire } from 'node:module'
import packageJson from 'tailwindcss/package.json'

import indexCss from 'tailwindcss/index.css' with { type: 'file' }
import preflightCss from 'tailwindcss/preflight.css' with { type: 'file' }
import themeCss from 'tailwindcss/theme.css' with { type: 'file' }
import utilitiesCss from 'tailwindcss/utilities.css' with { type: 'file' }

const localResolve = createRequire(import.meta.url).resolve

globalThis.__tw_resolve = (id, baseDir) => {
  let isEmbeddedFileBase = baseDir === '/$bunfs/root' || baseDir?.includes(':/~BUN/root')
  const likelyEmbeddedFile =
    id === 'tailwindcss' ||
    id.startsWith('tailwindcss/') ||
    id.startsWith('@tailwindcss/') ||
    isEmbeddedFileBase

  if (!likelyEmbeddedFile) {
    return false
  }

  id = id.startsWith('tailwindcss/')
    ? id.slice(12)
    : isEmbeddedFileBase && id.startsWith('./')
      ? id.slice(2)
      : id

  switch (id) {
    case 'index':
    case 'index.css':
    case 'tailwindcss':
      return localResolve(indexCss)
    case 'theme':
    case 'theme.css':
      return localResolve(themeCss)
    case 'preflight':
    case 'preflight.css':
      return localResolve(preflightCss)
    case 'utilities':
    case 'utilities.css':
      return localResolve(utilitiesCss)
    case '@tailwindcss/forms':
    case '@tailwindcss/typography':
    case '@tailwindcss/aspect-ratio':
      return id
    default:
      return false
  }
}
globalThis.__tw_load = async (id) => {
  if (id.endsWith('@tailwindcss/forms')) {
    return require('@tailwindcss/forms')
  } else if (id.endsWith('@tailwindcss/typography')) {
    return require('@tailwindcss/typography')
  } else if (id.endsWith('@tailwindcss/aspect-ratio')) {
    return require('@tailwindcss/aspect-ratio')
  } else {
    return undefined
  }
}
globalThis.__tw_version = packageJson.version
globalThis.__tw_readFile = async (path, encoding) => {
  // When reading a file from the `$bunfs`, we need to use the synchronous
  // `readFileSync` API
  let isEmbeddedFileBase = path.includes('/$bunfs/root') || path.includes(':/~BUN/root')
  if (!isEmbeddedFileBase) {
    return
  }
  return fs.readFileSync(path, encoding)
}

await import('../../@tailwindcss-cli/src/index.ts')
