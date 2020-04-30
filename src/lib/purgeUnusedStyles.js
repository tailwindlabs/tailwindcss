import _ from 'lodash'
import postcss from 'postcss'
import purgecss from '@fullhuman/postcss-purgecss'

function removeTailwindComments(css) {
  css.walkComments(comment => {
    switch (comment.text.trim()) {
      case 'tailwind start components':
      case 'tailwind start utilities':
      case 'tailwind start screens':
      case 'tailwind end components':
      case 'tailwind end utilities':
      case 'tailwind end screens':
        comment.remove()
        break
      default:
        break
    }
  })
}

export default function purgeUnusedUtilities(config) {
  const purgeEnabled =
    _.get(config, 'purge.enabled', false) === true ||
    (config.purge !== undefined && process.env.NODE_ENV === 'production')

  if (!purgeEnabled) {
    return removeTailwindComments
  }

  // Skip if `purge: []` since that's part of the default config
  if (Array.isArray(config.purge) && config.purge.length === 0) {
    console.log('Skipping purge because no template paths provided...')
    return removeTailwindComments
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
            case 'tailwind start screens':
              comment.text = 'purgecss end ignore'
              break
            case 'tailwind end utilities':
            case 'tailwind end screens':
              comment.text = 'purgecss start ignore'
              break
            default:
              break
          }
        })
      } else if (mode === 'all') {
        removeTailwindComments(css)
      }
    },
    purgecss({
      content: Array.isArray(config.purge) ? config.purge : config.purge.content,
      defaultExtractor: content => {
        // Capture as liberally as possible, including things like `h-(screen-1.5)`
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

        // Capture classes within other delimiters like .block(class="w-1/2") in Pug
        const innerMatches = content.match(/[^<>"'`\s.(){}\[\]#=%]*[^<>"'`\s.(){}\[\]#=%:]/g) || []

        return broadMatches.concat(innerMatches)
      },
      ...config.purge.options,
    }),
  ])
}
