export function visitorSpyPlugin() {
  let Once = jest.fn()
  let OnceExit = jest.fn()
  let Root = jest.fn()
  let AtRule = jest.fn()
  let Rule = jest.fn()
  let Comment = jest.fn()
  let Declaration = jest.fn()

  let plugin = Object.assign(
    function () {
      return {
        postcssPlugin: 'visitor-test',

        // These work fine
        Once,
        OnceExit,

        // These break
        Root,
        Rule,
        AtRule,
        Declaration,
        Comment,
      }
    },
    { postcss: true }
  )

  return {
    plugin,
    spies: {
      Once,
      OnceExit,
      Root,
      AtRule,
      Rule,
      Comment,
      Declaration,
    },
  }
}
