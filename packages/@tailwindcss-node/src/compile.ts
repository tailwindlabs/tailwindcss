import EnhancedResolve from 'enhanced-resolve'
import { createJiti, type Jiti } from 'jiti'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  __unstable__loadDesignSystem as ___unstable__loadDesignSystem,
  compile as _compile,
  compileAst as _compileAst,
  Features,
  Polyfills,
} from 'tailwindcss'
import type { AstNode } from '../../tailwindcss/src/ast'
import { getModuleDependencies } from './get-module-dependencies'
import { rewriteUrls } from './urls'

export { Features, Polyfills }

export type Resolver = (id: string, base: string) => Promise<string | false | undefined>

export interface CompileOptions {
  base: string
  onDependency: (path: string) => void
  shouldRewriteUrls?: boolean
  polyfills?: Polyfills

  customCssResolver?: Resolver
  customJsResolver?: Resolver
}

function createCompileOptions({
  base,
  polyfills,
  onDependency,
  shouldRewriteUrls,

  customCssResolver,
  customJsResolver,
}: CompileOptions) {
  return {
    base,
    polyfills,
    async loadModule(id: string, base: string) {
      return loadModule(id, base, onDependency, customJsResolver)
    },
    async loadStylesheet(id: string, sheetBase: string) {
      let sheet = await loadStylesheet(id, sheetBase, onDependency, customCssResolver)

      if (shouldRewriteUrls) {
        sheet.content = await rewriteUrls({
          css: sheet.content,
          root: base,
          base: sheet.base,
        })
      }

      return sheet
    },
  }
}

async function ensureSourceDetectionRootExists(
  compiler: { root: Awaited<ReturnType<typeof compile>>['root'] },
  base: string,
) {
  // Verify if the `source(…)` path exists (until the glob pattern starts)
  if (compiler.root && compiler.root !== 'none') {
    let globSymbols = /[*{]/
    let basePath = []
    for (let segment of compiler.root.pattern.split('/')) {
      if (globSymbols.test(segment)) {
        break
      }

      basePath.push(segment)
    }

    let exists = await fsPromises
      .stat(path.resolve(base, basePath.join('/')))
      .then((stat) => stat.isDirectory())
      .catch(() => false)

    if (!exists) {
      throw new Error(`The \`source(${compiler.root.pattern})\` does not exist`)
    }
  }
}

export async function compileAst(ast: AstNode[], options: CompileOptions) {
  let compiler = await _compileAst(ast, createCompileOptions(options))
  await ensureSourceDetectionRootExists(compiler, options.base)
  return compiler
}

export async function compile(css: string, options: CompileOptions) {
  let compiler = await _compile(css, createCompileOptions(options))
  await ensureSourceDetectionRootExists(compiler, options.base)
  return compiler
}

export async function __unstable__loadDesignSystem(css: string, { base }: { base: string }) {
  return ___unstable__loadDesignSystem(css, {
    base,
    async loadModule(id, base) {
      return loadModule(id, base, () => {})
    },
    async loadStylesheet(id, base) {
      return loadStylesheet(id, base, () => {})
    },
  })
}

export async function loadModule(
  id: string,
  base: string,
  onDependency: (path: string) => void,
  customJsResolver?: Resolver,
) {
  if (id[0] !== '.') {
    let resolvedPath = await resolveJsId(id, base, customJsResolver)
    if (!resolvedPath) {
      throw new Error(`Could not resolve '${id}' from '${base}'`)
    }

    let module = await importModule(pathToFileURL(resolvedPath).href)
    return {
      base: dirname(resolvedPath),
      module: module.default ?? module,
    }
  }

  let resolvedPath = await resolveJsId(id, base, customJsResolver)
  if (!resolvedPath) {
    throw new Error(`Could not resolve '${id}' from '${base}'`)
  }

  let [module, moduleDependencies] = await Promise.all([
    importModule(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
    getModuleDependencies(resolvedPath),
  ])

  for (let file of moduleDependencies) {
    onDependency(file)
  }
  return {
    base: dirname(resolvedPath),
    module: module.default ?? module,
  }
}

async function loadStylesheet(
  id: string,
  base: string,
  onDependency: (path: string) => void,
  cssResolver?: Resolver,
) {
  let resolvedPath = await resolveCssId(id, base, cssResolver)
  if (!resolvedPath) throw new Error(`Could not resolve '${id}' from '${base}'`)

  onDependency(resolvedPath)

  if (typeof globalThis.__tw_readFile === 'function') {
    let file = await globalThis.__tw_readFile(resolvedPath, 'utf-8')
    if (file) {
      return {
        base: path.dirname(resolvedPath),
        content: file,
      }
    }
  }

  let file = await fsPromises.readFile(resolvedPath, 'utf-8')
  return {
    base: path.dirname(resolvedPath),
    content: file,
  }
}

// Attempts to import the module using the native `import()` function. If this
// fails, it sets up `jiti` and attempts to import this way so that `.ts` files
// can be resolved properly.
let jiti: null | Jiti = null
async function importModule(path: string): Promise<any> {
  if (typeof globalThis.__tw_load === 'function') {
    let module = await globalThis.__tw_load(path)
    if (module) {
      return module
    }
  }

  try {
    return await import(path)
  } catch (error) {
    jiti ??= createJiti(import.meta.url, { moduleCache: false, fsCache: false })
    return await jiti.import(path)
  }
}

const modules = ['node_modules', ...(process.env.NODE_PATH ? [process.env.NODE_PATH] : [])]

const cssResolver = EnhancedResolve.ResolverFactory.createResolver({
  fileSystem: new EnhancedResolve.CachedInputFileSystem(fs, 4000),
  useSyncFileSystemCalls: true,
  extensions: ['.css'],
  mainFields: ['style'],
  conditionNames: ['style'],
  modules,
})
async function resolveCssId(
  id: string,
  base: string,
  customCssResolver?: Resolver,
): Promise<string | false | undefined> {
  if (typeof globalThis.__tw_resolve === 'function') {
    let resolved = globalThis.__tw_resolve(id, base)
    if (resolved) {
      return Promise.resolve(resolved)
    }
  }

  if (customCssResolver) {
    let customResolution = await customCssResolver(id, base)
    if (customResolution) {
      return customResolution
    }
  }

  return runResolver(cssResolver, id, base)
}

const esmResolver = EnhancedResolve.ResolverFactory.createResolver({
  fileSystem: new EnhancedResolve.CachedInputFileSystem(fs, 4000),
  useSyncFileSystemCalls: true,
  extensions: ['.js', '.json', '.node', '.ts'],
  conditionNames: ['node', 'import'],
  modules,
})

const cjsResolver = EnhancedResolve.ResolverFactory.createResolver({
  fileSystem: new EnhancedResolve.CachedInputFileSystem(fs, 4000),
  useSyncFileSystemCalls: true,
  extensions: ['.js', '.json', '.node', '.ts'],
  conditionNames: ['node', 'require'],
  modules,
})

async function resolveJsId(
  id: string,
  base: string,
  customJsResolver?: Resolver,
): Promise<string | false | undefined> {
  if (typeof globalThis.__tw_resolve === 'function') {
    let resolved = globalThis.__tw_resolve(id, base)
    if (resolved) {
      return Promise.resolve(resolved)
    }
  }

  if (customJsResolver) {
    let customResolution = await customJsResolver(id, base)
    if (customResolution) {
      return customResolution
    }
  }

  return runResolver(esmResolver, id, base).catch(() => runResolver(cjsResolver, id, base))
}

function runResolver(
  resolver: EnhancedResolve.Resolver,
  id: string,
  base: string,
): Promise<string | false | undefined> {
  return new Promise((resolve, reject) =>
    resolver.resolve({}, base, id, {}, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    }),
  )
}
