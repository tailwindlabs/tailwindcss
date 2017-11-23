expect.extend({
  // Compare two CSS strings with all whitespace removed
  // This is probably naive but it's fast and works well enough.
  toMatchCss(received, argument) {
    function stripped(str) {
      return str.replace(/\s/g, '')
    }

    if (stripped(received) === stripped(argument)) {
      return {
        message: () => `expected ${received} not to match CSS ${argument}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to match CSS ${argument}`,
        pass: false,
      }
    }
  },
})
