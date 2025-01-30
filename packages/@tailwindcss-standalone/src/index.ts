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

// We use a plugin to make sure that the JS APIs are bundled with the standalone
// CLI and can be imported inside configs and plugins
Bun.plugin({
  name: 'bundle-tailwindcss-apis',
  target: 'bun',
  async setup(build) {
    // These imports must be static strings otherwise they won't be bundled
    let bundled = {
      tailwindcss: await import('tailwindcss'),
      'tailwindcss/colors': await import('tailwindcss/colors'),
      'tailwindcss/colors.js': await import('tailwindcss/colors'),
      'tailwindcss/plugin': await import('tailwindcss/plugin'),
      'tailwindcss/plugin.js': await import('tailwindcss/plugin'),
      'tailwindcss/package.json': await import('tailwindcss/package.json'),
      'tailwindcss/lib/util/flattenColorPalette': await import(
        'tailwindcss/lib/util/flattenColorPalette'
      ),
      'tailwindcss/lib/util/flattenColorPalette.js': await import(
        'tailwindcss/lib/util/flattenColorPalette'
      ),
      'tailwindcss/defaultTheme': await import('tailwindcss/defaultTheme'),
      'tailwindcss/defaultTheme.js': await import('tailwindcss/defaultTheme'),
    }

    for (let [id, exports] of Object.entries(bundled)) {
      build.module(id, () => ({
        loader: 'object',
        exports: {
          ...exports,
          __esModule: true,
        },
      }))
    }
  },
})

await import('../../@tailwindcss-cli/src/index.ts')
