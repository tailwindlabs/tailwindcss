import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    let utilities = Object.fromEntries(
      Object.entries(theme('dropShadow') ?? {}).map(([modifier, value]) => {
        return [
          nameClass('drop-shadow', modifier),
          {
            '--tw-drop-shadow': Array.isArray(value)
              ? value.map((v) => `drop-shadow(${v})`).join(' ')
              : `drop-shadow(${value})`,
            '@defaults filter': {},
            filter: 'var(--tw-filter)',
          },
        ]
      })
    )

    addUtilities(utilities, variants('dropShadow'))
  }
}
