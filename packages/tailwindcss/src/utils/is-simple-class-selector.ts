/**
 * Check if a selector is a simple class selector.
 *
 * A simple class selector is a class selector that doesn't contain any other
 * selector types, such as ID selectors, element selectors, attribute selectors,
 * pseudo-classes, combinators, or selector lists.
 */
export function isSimpleClassSelector(selector: string): boolean {
  // The selector must start with a dot, otherwise it's not a class selector.
  if (selector[0] !== '.') return false

  for (let i = 1; i < selector.length; i++) {
    switch (selector[i]) {
      // The character is escaped, skip the next character
      case '\\':
        i += 1
        continue

      case ' ': // Descendat combinator
      case '.': // Class selector
      case '#': // ID selector
      case '[': // Attribute selector
      case ':': // Pseudo-classes and pseudo-elements
      case '>': // Child combinator
      case '+': // Next-sibling combinator
      case '~': // Subsequent-sibling combinator
      case ',': // Selector list
        return false
    }
  }

  return true
}
