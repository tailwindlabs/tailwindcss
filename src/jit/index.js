import postcss from 'postcss'
import fs from 'fs'
import path from 'path'
import fastGlob from 'fast-glob'
import parseGlob from 'parse-glob'

import evaluateTailwindFunctions from '../lib/evaluateTailwindFunctions'
import substituteScreenAtRules from '../lib/substituteScreenAtRules'

import normalizeTailwindDirectives from './lib/normalizeTailwindDirectives'
import setupContext from './lib/setupContext'
import removeLayerAtRules from './lib/removeLayerAtRules'
import expandTailwindAtRules from './lib/expandTailwindAtRules'
import expandApplyAtRules from './lib/expandApplyAtRules'
import collapseAdjacentRules from './lib/collapseAdjacentRules'
import * as sharedState from './lib/sharedState'
import { env } from './lib/sharedState'
import purgeUnusedUtilities from '../lib/purgeUnusedStyles'

export default function (configOrPath = {}) {
  return [
    env.DEBUG &&
      function (root) {
        console.log('\n')
        console.time('JIT TOTAL')
        return root
      },
    function (root, result) {
      function registerDependency(fileName, type = 'dependency') {
        result.messages.push({
          type,
          plugin: 'tailwindcss-jit',
          parent: result.opts.from,
          [type === 'dir-dependency' ? 'dir' : 'file']: fileName,
        })
      }

      let tailwindDirectives = normalizeTailwindDirectives(root)

      let context = setupContext(configOrPath, tailwindDirectives)(result, root)

      function detectChangedTemplates() {
        if (sharedState.env.TAILWIND_DISABLE_TOUCH) {
          for (let maybeGlob of context.candidateFiles) {
            let {
              is: { glob: isGlob },
              base,
            } = parseGlob(maybeGlob)

            if (isGlob) {
              // rollup-plugin-postcss does not support dir-dependency messages
              // but directories can be watched in the same way as files
              registerDependency(
                path.resolve(base),
                process.env.ROLLUP_WATCH === 'true' ? 'dependency' : 'dir-dependency'
              )
            } else {
              registerDependency(path.resolve(maybeGlob))
            }
          }

          env.DEBUG && console.time('Finding changed files')
          let files = fastGlob.sync(context.candidateFiles)
          for (let file of files) {
            let prevModified = context.fileModifiedMap.has(file)
              ? context.fileModifiedMap.get(file)
              : -Infinity
            let modified = fs.statSync(file).mtimeMs

            if (!context.scannedContent || modified > prevModified) {
              context.changedFiles.add(file)
              context.fileModifiedMap.set(file, modified)
            }
          }
          context.scannedContent = true
          env.DEBUG && console.timeEnd('Finding changed files')
        } else {
          // Register our temp file as a dependency — we write to this file
          // to trigger rebuilds.
          if (context.touchFile) {
            registerDependency(context.touchFile)
          }

          // If we're not set up and watching files ourselves, we need to do
          // the work of grabbing all of the template files for candidate
          // detection.
          if (!context.scannedContent) {
            let files = fastGlob.sync(context.candidateFiles)
            for (let file of files) {
              context.changedFiles.add(file)
            }
            context.scannedContent = true
          }
        }
      }

      if (!env.TAILWIND_DISABLE_TOUCH) {
        if (context.configPath !== null) {
          registerDependency(context.configPath)
        }
      }

      if (tailwindDirectives.size > 0) {
        detectChangedTemplates()
      }

      return postcss(
        [
          removeLayerAtRules(context, tailwindDirectives),
          tailwindDirectives.size > 0 && expandTailwindAtRules(context, tailwindDirectives),
          expandApplyAtRules(context),
          evaluateTailwindFunctions(context.tailwindConfig),
          substituteScreenAtRules(context.tailwindConfig),
          collapseAdjacentRules(context),
        ].filter(Boolean)
      ).process(root, { from: undefined })
    },
    env.DEBUG &&
      function (root) {
        console.timeEnd('JIT TOTAL')
        console.log('\n')
        return root
      },
  ].filter(Boolean)
}
