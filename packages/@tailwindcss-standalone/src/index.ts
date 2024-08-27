import { createRequire } from 'node:module'
import packageJson from 'tailwindcss/package.json'

import indexCss from 'tailwindcss/index.css' with { type: 'file' }
import preflightCss from 'tailwindcss/preflight.css' with { type: 'file' }
import themeCss from 'tailwindcss/theme.css' with { type: 'file' }
import utilitiesCss from 'tailwindcss/utilities.css' with { type: 'file' }

const localResolve = createRequire(import.meta.url).resolve

globalThis.__tw_resolve = (id, baseDir) => {
  let isEmbeddedFileBase = baseDir === '/$bunfs/root'
  const likelyEmbeddedFile =
    id === 'tailwindcss' || id.startsWith('tailwindcss/') || isEmbeddedFileBase

  if (!likelyEmbeddedFile) {
    return localResolve(id, baseDir ? { paths: [baseDir] } : undefined)
  }

  id = id.startsWith('tailwindcss/')
    ? id.slice(12)
    : isEmbeddedFileBase && id.startsWith('./')
      ? id.slice(2)
      : id

  switch (id) {
    case '':
    case 'index.css':
      return localResolve(indexCss)
    case 'theme.css':
      return localResolve(themeCss)
    case 'preflight.css':
      return localResolve(preflightCss)
    case 'utilities.css':
      return localResolve(utilitiesCss)
    default:
      return localResolve(id, baseDir ? { paths: [baseDir] } : undefined)
  }
}
globalThis.__tw_version = packageJson.version

await import('../../@tailwindcss-cli/src/index.ts')
