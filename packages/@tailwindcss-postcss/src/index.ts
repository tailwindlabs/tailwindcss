import { scanDir } from '@tailwindcss/oxide'
import fs from 'fs'
import postcss, { type AcceptedPlugin, type PluginCreator } from 'postcss'
import postcssImport from 'postcss-import'
import { compile, optimizeCss } from 'tailwindcss'

/**
 * A Map that can generate default values for keys that don't exist.
 * Generated default values are added to the map to avoid recomputation.
 */
class DefaultMap<T = string, V = any> extends Map<T, V> {
  constructor(private factory: (key: T, self: DefaultMap<T, V>) => V) {
    super()
  }

  get(key: T): V {
    let value = super.get(key)

    if (value === undefined) {
      value = this.factory(key, this)
      this.set(key, value)
    }

    return value
  }
}

type PluginOptions = {
  // The base directory to scan for class candidates.
  base?: string

  // Optimize and minify the output CSS.
  optimize?: boolean | { minify?: boolean }
}

function tailwindcss(opts: PluginOptions = {}): AcceptedPlugin {
  let base = opts.base ?? process.cwd()
  let optimize = opts.optimize ?? process.env.NODE_ENV === 'production'

  let cache = new DefaultMap(() => {
    return {
      mtimes: new Map<string, number>(),
      build: null as null | ReturnType<typeof compile>['build'],
      previousCss: '',
      previousOptimizedCss: '',
    }
  })

  return {
    postcssPlugin: '@tailwindcss/postcss',
    plugins: [
      // We need to run `postcss-import` first to handle `@import` rules.
      postcssImport(),

      (root, result) => {
        let from = result.opts.from ?? ''
        let context = cache.get(from)

        let rebuildStrategy: 'full' | 'incremental' = 'incremental'

        // Track file modification times to CSS files
        {
          let changedTime = fs.statSync(from, { throwIfNoEntry: false })?.mtimeMs ?? null
          if (changedTime !== null) {
            let prevTime = context.mtimes.get(from)
            if (prevTime !== changedTime) {
              rebuildStrategy = 'full'
              context.mtimes.set(from, changedTime)
            }
          } else {
            rebuildStrategy = 'full'
          }
          for (let message of result.messages) {
            if (message.type === 'dependency') {
              let file = message.file as string
              let changedTime = fs.statSync(file, { throwIfNoEntry: false })?.mtimeMs ?? null
              if (changedTime !== null) {
                let prevTime = context.mtimes.get(file)
                if (prevTime !== changedTime) {
                  rebuildStrategy = 'full'
                  context.mtimes.set(file, changedTime)
                }
              }
            }
          }
        }

        let hasApply = false
        let hasTailwind = false

        root.walkAtRules((rule) => {
          if (rule.name === 'apply') {
            hasApply = true
          } else if (rule.name === 'tailwind') {
            hasApply = true
            hasTailwind = true
            // If we've found `@tailwind` then we already
            // know we have to run a "full" build
            return false
          }
        })

        // Do nothing if neither `@tailwind` nor `@apply` is used
        if (!hasTailwind && !hasApply) return

        let css = ''

        // Look for candidates used to generate the CSS
        let { candidates, files, globs } = scanDir({ base, globs: true })

        // Add all found files as direct dependencies
        for (let file of files) {
          result.messages.push({
            type: 'dependency',
            plugin: '@tailwindcss/postcss',
            file,
            parent: result.opts.from,
          })
        }

        // Register dependencies so changes in `base` cause a rebuild while
        // giving tools like Vite or Parcel a glob that can be used to limit
        // the files that cause a rebuild to only those that match it.
        for (let { base, glob } of globs) {
          result.messages.push({
            type: 'dir-dependency',
            plugin: '@tailwindcss/postcss',
            dir: base,
            glob,
            parent: result.opts.from,
          })
        }

        if (rebuildStrategy === 'full') {
          if (hasTailwind) {
            let { build } = compile(root.toString())
            css = build(candidates)
            context.build = build
          } else {
            css = compile(root.toString()).build([])
          }
        } else if (rebuildStrategy === 'incremental') {
          css = context.build!(candidates)
        }

        function replaceCss(css: string) {
          root.removeAll()
          root.append(postcss.parse(css, result.opts))
        }

        // Replace CSS
        if (css === context.previousCss) {
          if (optimize) {
            replaceCss(context.previousOptimizedCss)
          } else {
            replaceCss(css)
          }
        } else {
          if (optimize) {
            let optimizedCss = optimizeCss(css, {
              minify: typeof optimize === 'object' ? optimize.minify : true,
            })
            replaceCss(optimizedCss)
            context.previousOptimizedCss = optimizedCss
          } else {
            replaceCss(css)
          }
          context.previousCss = css
        }
      },
    ],
  }
}

export default Object.assign(tailwindcss, { postcss: true }) as PluginCreator<PluginOptions>
