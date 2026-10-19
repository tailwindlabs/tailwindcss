export default function ({ matchUtilities }) {
  console.log('hello from a plugin')

  matchUtilities(
    {
      'plugin-color': (value) => {
        console.log(`compiling plugin-color-${value}`)
        return { color: value }
      },
    },
    { values: { red: 'red' } },
  )
}
