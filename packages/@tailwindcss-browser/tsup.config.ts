import fs from 'node:fs/promises'
import { defineConfig, type Options } from 'tsup'
import type { AstNode } from '../tailwindcss/src/ast'
import { parse } from '../tailwindcss/src/css-parser'

type Plugin = NonNullable<Options['esbuildPlugins']>[number]
type PluginBuild = Parameters<Plugin['setup']>[0]
type OnResolveArgs = Parameters<Parameters<PluginBuild['onResolve']>[1]>[0]

export default defineConfig({
  format: ['iife'],
  clean: true,
  minify: true,
  entry: ['src/index.ts'],
  noExternal: [/.*/],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.FEATURES_ENV': '"stable"',

    // The browser build only ships what is needed to generate CSS at runtime.
    // These switches are documented in `packages/tailwindcss/src/node.d.ts`.
    'process.env.TAILWIND_INTELLISENSE': '"false"',
    'process.env.TAILWIND_JS_PLUGINS': '"false"',
  },
  esbuildPlugins: [minifiedStylesheets(), sideEffectFreeModules()],
})

/**
 * Resolve an import the way esbuild would without any of our plugins.
 */
const RESOLVING = Symbol()
async function resolve(build: PluginBuild, args: OnResolveArgs) {
  if (args.kind === 'entry-point' || args.pluginData === RESOLVING) return null

  return build.resolve(args.path, {
    kind: args.kind,
    importer: args.importer,
    resolveDir: args.resolveDir,
    pluginData: RESOLVING,
  })
}

/**
 * Tell esbuild that none of the bundled modules have side effects when they
 * are imported.
 *
 * Code that is turned off by a build-time switch is removed from the bundle,
 * but the modules that are only used by that code would be kept around when
 * esbuild can't prove that importing them does nothing. For example, the v3
 * default theme uses object spreads at the top level, which can run getters.
 */
function sideEffectFreeModules(): Plugin {
  return {
    name: 'side-effect-free-modules',
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        let result = await resolve(build, args)
        if (!result || result.errors.length > 0) return result

        return { ...result, sideEffects: false }
      })
    },
  }
}

/**
 * Embed the stylesheets that ship with Tailwind CSS as minified strings.
 *
 * Comments and whitespace in these files are never part of the generated CSS,
 * they would only be downloaded and parsed on every page load.
 */
function minifiedStylesheets(): Plugin {
  // tsup handles every path that ends in `.css` before our plugins get to see
  // it, so stylesheets are loaded from a namespace with a different path.
  let namespace = 'minified-stylesheet'
  let suffix = '?minified'

  return {
    name: 'minified-stylesheets',
    setup(build) {
      build.onResolve({ filter: /\.css$/ }, async (args) => {
        let result = await resolve(build, args)
        if (!result || result.errors.length > 0) return result

        return { path: result.path + suffix, namespace, sideEffects: false }
      })

      build.onLoad({ filter: /.*/, namespace }, async (args) => {
        let path = args.path.slice(0, -suffix.length)
        let ast = parse(await fs.readFile(path, 'utf8'))
        let minified = toMinifiedCss(ast)

        // Minifying must not change what the stylesheet means. Runs of spaces
        // are ignored, the parser keeps the spaces around a removed comment.
        let normalize = (ast: AstNode[]) => JSON.stringify(ast).replace(/ +/g, ' ')
        if (normalize(parse(minified)) !== normalize(ast)) {
          throw new Error(`Minifying \`${path}\` changed its contents.`)
        }

        return { contents: minified, loader: 'text', watchFiles: [path] }
      })
    },
  }
}

function toMinifiedCss(ast: AstNode[]): string {
  let css = ''

  for (let node of ast) {
    if (node.kind === 'declaration') {
      css += `${node.property}:${node.value}${node.important ? '!important' : ''};`
    } else if (node.kind === 'rule') {
      css += `${node.selector}{${toMinifiedCss(node.nodes)}}`
    } else if (node.kind === 'at-rule') {
      let prelude = node.params ? `${node.name} ${node.params}` : node.name
      css += node.nodes.length > 0 ? `${prelude}{${toMinifiedCss(node.nodes)}}` : `${prelude};`
    } else {
      throw new Error(`Unexpected \`${node.kind}\` node in an embedded stylesheet.`)
    }
  }

  return css
}
