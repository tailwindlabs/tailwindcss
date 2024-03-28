import { scanDir } from '@tailwindcss/oxide'
import fs from 'fs'
import { Features, transform } from 'lightningcss'
import postcss, { type AcceptedPlugin, type PluginCreator } from 'postcss'
import postcssImport from 'postcss-import'
import { compile } from 'tailwindcss'

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
      css: '',
      optimizedCss: '',
    }
  })

  return {
    postcssPlugin: '@tailwindcss/postcss',
    plugins: [
      // We need to run `postcss-import` first to handle `@import` rules.
      postcssImport(),

      (root, result) => {
        let inputFile = result.opts.from ?? ''
        let context = cache.get(inputFile)

        let rebuildStrategy: 'full' | 'incremental' = 'incremental'

        // Track file modification times to CSS files
        {
          let files = result.messages.flatMap((message) => {
            if (message.type !== 'dependency') return []
            return message.file
          })
          files.push(inputFile)
          for (let file of files) {
            let changedTime = fs.statSync(file, { throwIfNoEntry: false })?.mtimeMs ?? null
            if (changedTime === null) {
              if (file === inputFile) {
                rebuildStrategy = 'full'
              }
              continue
            }

            let prevTime = context.mtimes.get(file)
            if (prevTime === changedTime) continue

            rebuildStrategy = 'full'
            context.mtimes.set(file, changedTime)
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
          let { build } = compile(root.toString())
          context.build = build
          css = build(hasTailwind ? candidates : [])
        } else if (rebuildStrategy === 'incremental') {
          css = context.build!(candidates)
        }

        // Replace CSS
        if (css !== context.css && optimize) {
          context.optimizedCss = optimizeCss(css, {
            minify: typeof optimize === 'object' ? optimize.minify : true,
          })
        }
        context.css = css
        root.removeAll()
        root.append(postcss.parse(optimize ? context.optimizedCss : context.css, result.opts))
      },
    ],
  }
}

function optimizeCss(
  input: string,
  { file = 'input.css', minify = false }: { file?: string; minify?: boolean } = {},
) {
  return transform({
    filename: file,
    code: Buffer.from(input),
    minify,
    sourceMap: false,
    drafts: {
      customMedia: true,
    },
    nonStandard: {
      deepSelectorCombinator: true,
    },
    include: Features.Nesting,
    exclude: Features.LogicalProperties,
    targets: {
      safari: (16 << 16) | (4 << 8),
    },
    errorRecovery: true,
  }).code.toString()
}

export default Object.assign(tailwindcss, { postcss: true }) as PluginCreator<PluginOptions>
