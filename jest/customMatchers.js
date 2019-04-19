expect.extend({
  // Compare two CSS strings with all whitespace removed
  // This is probably naive but it's fast and works well enough.
  toMatchCss(received, argument) {
    const stripped = str => str.replace(/\s/g, '')

    if (stripped(received) === stripped(argument)) {
      return {
        message: () => `expected ${received} not to match CSS ${argument}`,
        pass: true,
      }
    }

    return {
      message: () => `expected ${received} to match CSS ${argument}`,
      pass: false,
    }
  },
})
