// @ts-ignore
import twIndex from 'tailwindcss/index.css' with { type: 'file' }

// @ts-ignore
import twPreflight from 'tailwindcss/preflight.css' with { type: 'file' }

// @ts-ignore
import twTheme from 'tailwindcss/theme.css' with { type: 'file' }

// @ts-ignore
import twUtilities from 'tailwindcss/utilities.css' with { type: 'file' }

// @ts-ignore
// import twPkg from 'tailwindcss/package.json' with { type: 'file' }

import { createRequire } from 'node:module'

const localResolve = createRequire(import.meta.url).resolve

export function resolve(id: string) {
  if (id === 'tailwindcss/index.css') {
    return twIndex
  } else if (id === 'tailwindcss/preflight.css') {
    return twPreflight
  } else if (id === 'tailwindcss/theme.css') {
    return twTheme
  } else if (id === 'tailwindcss/utilities.css') {
    return twUtilities
  } else if (id === 'tailwindcss/package.json') {
    return twPkg
  } else {
    return localResolve(id)
  }
}
