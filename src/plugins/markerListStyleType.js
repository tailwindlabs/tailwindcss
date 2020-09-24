import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const element = _.fromPairs(
      _.map(theme('markerListStyleType'), (value, modifier) => {
        return [
          `.${e(`marker-${modifier}`)} > :not(template)`,
          {
            display: 'block',
            'list-style-position': 'inside',
            position: 'relative'
          }
        ]
      })
    )

    const marker = _.fromPairs(
      _.map(theme('markerListStyleType'), (value, modifier) => {
        return [
          `.${e(`marker-${modifier}`)} > :not(template)::before`,
          {
            content: '""',
            'list-style-type': value,
            display: 'list-item',
            position: 'absolute',
            left: '0'
          }
        ]
      })
    )

    addUtilities(_.merge(element, marker), variants('markerListStyleType'))
  }
}
