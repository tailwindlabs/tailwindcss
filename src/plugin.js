import postcss from 'postcss'
import postcssImport from 'postcss-import'
import setupTrackingContext from './lib/setupTrackingContext'
import processTailwindFeatures from './processTailwindFeatures'
import { env } from './lib/sharedState'
import { findAtConfigPath } from './lib/findAtConfigPath'

const TAILWIND = Symbol()

function handleImportAtRules() {
  let RESTORE_ATRULE_COMMENT = '__TAILWIND_RESTORE__'
  let atRulesToRestore = ['tailwind', 'config']

  return [
    (root) => {
      root.walkAtRules((rule) => {
        if (!atRulesToRestore.includes(rule.name)) return rule

        rule.after(
          postcss.comment({
            text: RESTORE_ATRULE_COMMENT,
            raws: { [TAILWIND]: { rule } },
          })
        )
        rule.remove()
      })
    },
    postcssImport(),
    (root) => {
      root.walkComments((rule) => {
        if (rule.text.startsWith(RESTORE_ATRULE_COMMENT)) {
          rule.after(rule.raws[TAILWIND].rule)
          rule.remove()
        }
      })
    },
  ]
}

module.exports = function tailwindcss(configOrPath) {
  return {
    postcssPlugin: 'tailwindcss',
    plugins: [
      env.DEBUG &&
        function (root) {
          console.log('\n')
          console.time('JIT TOTAL')
          return root
        },
      ...(__OXIDE__ ? handleImportAtRules() : []),
      function (root, result) {
        // Use the path for the `@config` directive if it exists, otherwise use the
        // path for the file being processed
        configOrPath = findAtConfigPath(root, result) ?? configOrPath

        let context = setupTrackingContext(configOrPath)

        if (root.type === 'document') {
          let roots = root.nodes.filter((node) => node.type === 'root')

          for (const root of roots) {
            if (root.type === 'root') {
              processTailwindFeatures(context)(root, result)
            }
          }

          return
        }

        processTailwindFeatures(context)(root, result)
      },
      __OXIDE__ &&
        function lightningCssPlugin(_root, result) {
          let postcss = require('postcss')
          let lightningcss = require('lightningcss')
          let browserslist = require('browserslist')

          try {
            let transformed = lightningcss.transform({
              filename: result.opts.from,
              code: Buffer.from(result.root.toString()),
              minify: false,
              sourceMap: !!result.map,
              inputSourceMap: result.map ? result.map.toString() : undefined,
              targets:
                typeof process !== 'undefined' && process.env.JEST_WORKER_ID
                  ? { chrome: 106 << 16 }
                  : lightningcss.browserslistToTargets(
                      browserslist(require('../package.json').browserslist)
                    ),

              drafts: {
                nesting: true,
                customMedia: true,
              },
            })

            result.map = Object.assign(result.map ?? {}, {
              toJSON() {
                return transformed.map.toJSON()
              },
              toString() {
                return transformed.map.toString()
              },
            })

            result.root = postcss.parse(transformed.code.toString('utf8'))
          } catch (err) {
            if (typeof process !== 'undefined' && process.env.JEST_WORKER_ID) {
              let lines = err.source.split('\n')
              err = new Error(
                [
                  'Error formatting using Lightning CSS:',
                  '',
                  ...[
                    '```css',
                    ...lines.slice(Math.max(err.loc.line - 3, 0), err.loc.line),
                    ' '.repeat(err.loc.column - 1) + '^-- ' + err.toString(),
                    ...lines.slice(err.loc.line, err.loc.line + 2),
                    '```',
                  ],
                ].join('\n')
              )
            }

            if (Error.captureStackTrace) {
              Error.captureStackTrace(err, lightningCssPlugin)
            }
            throw err
          }
        },
      env.DEBUG &&
        function (root) {
          console.timeEnd('JIT TOTAL')
          console.log('\n')
          return root
        },
    ].filter(Boolean),
  }
}

module.exports.postcss = true
