import _ from 'lodash'
import postcss from 'postcss'
import purgecss from '@fullhuman/postcss-purgecss'
import chalk from 'chalk'
import { log } from '../cli/utils'
import * as emoji from '../cli/emoji'

function removeTailwindMarkers(css) {
  css.walkAtRules('tailwind', rule => rule.remove())
  css.walkComments(comment => {
    switch (comment.text.trim()) {
      case 'tailwind start components':
      case 'tailwind start utilities':
      case 'tailwind end components':
      case 'tailwind end utilities':
        comment.remove()
        break
      default:
        break
    }
  })
}

export default function purgeUnusedUtilities(config) {
  const purgeEnabled = _.get(
    config,
    'purge.enabled',
    config.purge !== false && config.purge !== undefined && process.env.NODE_ENV === 'production'
  )

  if (!purgeEnabled) {
    return removeTailwindMarkers
  }

  // Skip if `purge: []` since that's part of the default config
  if (Array.isArray(config.purge) && config.purge.length === 0) {
    log()
    log(
      emoji.warning,
      chalk.yellow(
        ' Tailwind is not purging unused styles because no template paths have been provided.'
      )
    )
    log(
      chalk.white(
        '   If you have manually configured PurgeCSS outside of Tailwind or are deliberately not\n      removing unused styles, set `purge: false` in your Tailwind config file to silence\n      this warning.'
      )
    )
    log(
      chalk.white('\n      https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css')
    )
    return removeTailwindMarkers
  }

  return postcss([
    function(css) {
      const mode = _.get(config, 'purge.mode', 'conservative')

      if (mode === 'conservative') {
        css.prepend(postcss.comment({ text: 'purgecss start ignore' }))
        css.append(postcss.comment({ text: 'purgecss end ignore' }))

        css.walkComments(comment => {
          switch (comment.text.trim()) {
            case 'tailwind start utilities':
              comment.text = 'purgecss end ignore'
              break
            case 'tailwind end utilities':
              comment.text = 'purgecss start ignore'
              break
            default:
              break
          }
        })
      }
    },
    removeTailwindMarkers,
    purgecss({
      content: Array.isArray(config.purge) ? config.purge : config.purge.content,
      defaultExtractor: content => {
        // Capture as liberally as possible, including things like `h-(screen-1.5)`
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

        // Capture classes within other delimiters like .block(class="w-1/2") in Pug
        const innerMatches = content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) || []

        return broadMatches.concat(innerMatches)
      },
      ...config.purge.options,
    }),
  ])
}
