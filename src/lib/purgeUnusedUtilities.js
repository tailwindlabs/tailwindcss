import _ from 'lodash'
import postcss from 'postcss'
import purgecss from '@fullhuman/postcss-purgecss'

export default function purgeUnusedUtilities(config) {
  const purgeEnabled =
    _.get(config, 'purge.enabled', false) === true ||
    (config.purge !== undefined && process.env.NODE_ENV === 'production')

  if (!purgeEnabled) {
    return function(css) {
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
  }

  return postcss([
    function(css) {
      css.prepend(postcss.comment({ text: 'purgecss start ignore' }))
      css.append(postcss.comment({ text: 'purgecss end ignore' }))

      css.walkComments(comment => {
        switch (comment.text.trim()) {
          case 'tailwind start components':
          case 'tailwind start utilities':
          case 'tailwind start screens':
            comment.text = 'purgecss end ignore'
            break
          case 'tailwind end components':
          case 'tailwind end utilities':
          case 'tailwind end screens':
            comment.text = 'purgecss start ignore'
            break
          default:
            break
        }
      })
    },
    purgecss({
      content: Array.isArray(config.purge) ? config.purge : config.purge.paths,
      defaultExtractor: content => {
        return (
          content
            .match(/[^<>"'`\s]*[^<>"'`\s:]/g)
            .concat(content.match(/[^<>"'`\s.]*[^<>"'`\s:.]/g)) || []
        )
      },
    }),
  ])
}
