import { scanDir } from '@tailwindcss/oxide'
import postcss, { type AcceptedPlugin, type PluginCreator } from 'postcss'
import postcssImport from 'postcss-import'
import { compile, optimizeCss } from 'tailwindcss'

type PluginOptions = {
  // The base directory to scan for class candidates.
  base?: string

  // Optimize the output CSS.
  optimize?: boolean | { minify?: boolean }
}

function tailwindcss(opts: PluginOptions = {}): AcceptedPlugin {
  let base = opts.base ?? process.cwd()
  let optimize = opts.optimize ?? process.env.NODE_ENV === 'production'

  return {
    postcssPlugin: 'tailwindcss-v4',
    plugins: [
      // We need to run `postcss-import` first to handle `@import` rules.
      postcssImport(),

      (root, result) => {
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

        function replaceCss(css: string) {
          root.removeAll()
          let output = css
          if (optimize) {
            output = optimizeCss(output, {
              minify: typeof optimize === 'object' ? optimize.minify : false,
            })
          }
          root.append(postcss.parse(output, result.opts))
        }

        // No `@tailwind` means we don't have to look for candidates
        if (!hasTailwind) {
          replaceCss(compile(root.toString(), []))
          return
        }

        // Look for candidates used to generate the CSS
        let { candidates, files, globs } = scanDir({ base, globs: true })

        // Add all found files as direct dependencies
        for (let file of files) {
          result.messages.push({
            type: 'dependency',
            plugin: 'tailwindcss-v4',
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
            plugin: 'tailwindcss-v4',
            dir: base,
            glob,
            parent: result.opts.from,
          })
        }

        replaceCss(compile(root.toString(), candidates))
      },
    ],
  }
}

export default Object.assign(tailwindcss, { postcss: true }) as PluginCreator<PluginOptions>
