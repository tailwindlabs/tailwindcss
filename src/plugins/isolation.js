export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.isolate': {
          isolation: 'isolate',
        },
        '.isolation-auto': {
          isolation: 'auto',
        },
      },
      variants('isolation')
    )
  }
}
