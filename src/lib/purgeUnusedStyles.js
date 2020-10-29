import _ from 'lodash'
import postcss from 'postcss'
import purgecss from '@fullhuman/postcss-purgecss'
import log from '../util/log'
import htmlTags from 'html-tags'

function removeTailwindMarkers(css) {
  css.walkAtRules('tailwind', (rule) => rule.remove())
  css.walkComments((comment) => {
    switch (comment.text.trim()) {
      case 'tailwind start base':
      case 'tailwind end base':
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

export function tailwindExtractor(content) {
  // Capture as liberally as possible, including things like `h-(screen-1.5)`
  const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
  const broadMatchesWithoutTrailingSlash = broadMatches.map((match) => _.trimEnd(match, '\\'))

  // Capture classes within other delimiters like .block(class="w-1/2") in Pug
  const innerMatches = content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) || []

  return broadMatches.concat(broadMatchesWithoutTrailingSlash).concat(innerMatches)
}

export default function purgeUnusedUtilities(config, configChanged) {
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
    if (configChanged) {
      log.warn([
        'Tailwind is not purging unused styles because no template paths have been provided.',
        'If you have manually configured PurgeCSS outside of Tailwind or are deliberately not removing unused styles, set `purge: false` in your Tailwind config file to silence this warning.',
        'https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css',
      ])
    }

    return removeTailwindMarkers
  }

  const { defaultExtractor, ...purgeOptions } = config.purge.options || {}

  return postcss([
    function (css) {
      const mode = _.get(config, 'purge.mode', 'layers')

      if (!['all', 'layers'].includes(mode)) {
        throw new Error('Purge `mode` must be one of `layers` or `all`.')
      }

      if (mode === 'all') {
        return
      }

      const layers = _.get(config, 'purge.layers', ['base', 'components', 'utilities'])

      css.walkComments((comment) => {
        switch (comment.text.trim()) {
          case `purgecss start ignore`:
            comment.before(postcss.comment({ text: 'purgecss end ignore' }))
            break
          case `purgecss end ignore`:
            comment.before(postcss.comment({ text: 'purgecss end ignore' }))
            comment.text = 'purgecss start ignore'
            break
          default:
            break
        }
        layers.forEach((layer) => {
          switch (comment.text.trim()) {
            case `tailwind start ${layer}`:
              comment.text = 'purgecss end ignore'
              break
            case `tailwind end ${layer}`:
              comment.text = 'purgecss start ignore'
              break
            default:
              break
          }
        })
      })

      css.prepend(postcss.comment({ text: 'purgecss start ignore' }))
      css.append(postcss.comment({ text: 'purgecss end ignore' }))
    },
    removeTailwindMarkers,
    purgecss({
      content: Array.isArray(config.purge) ? config.purge : config.purge.content,
      defaultExtractor: (content) => {
        const extractor = defaultExtractor || tailwindExtractor
        const preserved = [...extractor(content)]

        if (_.get(config, 'purge.preserveHtmlElements', true)) {
          preserved.push(...htmlTags)
        }

        return preserved
      },
      ...purgeOptions,
    }),
  ])
}
