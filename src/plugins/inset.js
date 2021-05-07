export default function () {
  return function ({ matchUtilities, theme, variants }) {
    let options = {
      values: theme('inset'),
      variants: variants('inset'),
      type: 'any',
    }

    matchUtilities(
      {
        inset: (value) => {
          return { top: value, right: value, bottom: value, left: value }
        },
      },
      options
    )

    matchUtilities(
      {
        'inset-x': (value) => {
          return { left: value, right: value }
        },
        'inset-y': (value) => {
          return { top: value, bottom: value }
        },
      },
      options
    )

    matchUtilities(
      {
        top: (value) => {
          return { top: value }
        },
        right: (value) => {
          return { right: value }
        },
        bottom: (value) => {
          return { bottom: value }
        },
        left: (value) => {
          return { left: value }
        },
      },
      options
    )
  }
}
