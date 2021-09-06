import buildMediaQuery from '../util/buildMediaQuery'

export default function ({ tailwindConfig: { theme } }) {
  return function (css) {
    css.walkAtRules('screen', (atRule) => {
      const screen = atRule.params

      if (!theme.screens?.hasOwnProperty?.(screen)) {
        throw atRule.error(`No \`${screen}\` screen found.`)
      }

      atRule.name = 'media'
      atRule.params = buildMediaQuery(theme.screens[screen])
    })
  }
}
