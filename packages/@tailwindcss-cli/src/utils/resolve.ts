import { createRequire } from 'node:module'
import resolver from 'resolve'

const localResolve = createRequire(import.meta.url).resolve

export function resolve(id: string) {
  if (typeof globalThis.__tw_resolve === 'function') {
    return globalThis.__tw_resolve(id)
  }
  return localResolve(id)
}

export function resolveCssId(id: string, baseDir?: string) {
  if (typeof globalThis.__tw_resolve === 'function') {
    return globalThis.__tw_resolve(id, baseDir)
  }
  return localResolveCssId(id, baseDir)
}

// c.f. https://github.com/postcss/postcss-import/blob/master/lib/resolve-id.js
function resolveModule(id: string, opts: {}): Promise<string> {
  return new Promise((res, rej) => {
    resolver(id, opts, (err, path) => (err ? rej(err) : path ? res(path) : rej(path)))
  })
}
function localResolveCssId(id: string, base?: string): Promise<string> {
  const resolveOpts = {
    basedir: base,
    moduleDirectory: ['web_modules', 'node_modules'],
    extensions: ['.css'],
    packageFilter: function processPackage(pkg: any) {
      if (pkg.style) pkg.main = pkg.style
      else if (!pkg.main || !/\.css$/.test(pkg.main)) pkg.main = 'index.css'
      return pkg
    },
    preserveSymlinks: false,
  }

  return resolveModule(`./${id}`, resolveOpts)
    .catch(() => resolveModule(id, resolveOpts))
    .catch(() => {
      throw new Error(`Failed to find '${id}'`)
    })
}
