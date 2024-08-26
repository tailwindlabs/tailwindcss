import { createRequire } from 'node:module'

const localResolve = createRequire(import.meta.url).resolve

export function resolve(id: string) {
  if (id.startsWith('tailwindcss/')) {
    try {
      return localResolve(id)
    } catch (err) {
      try {
        return localResolve('./' + id.slice(12))
      } catch {}

      throw err
    }
  }

  return localResolve(id)
}
