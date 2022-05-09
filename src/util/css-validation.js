import postcss from 'postcss'

const IS_VALID_PROPERTY_NAME = /^[a-z_-]/

export function isValidPropName(name) {
  return IS_VALID_PROPERTY_NAME.test(name)
}

/**
 * @param {string} declaration
 * @returns {boolean}
 */
export function looksLikeUri(declaration) {
  // Quick bailout for obvious non-urls
  // This doesn't support schemes that don't use a leading // but that's unlikely to be a problem
  if (!declaration.includes('://')) {
    return false
  }

  try {
    const url = new URL(declaration)
    return url.scheme !== '' && url.host !== ''
  } catch (err) {
    // Definitely not a valid url
    return false
  }
}

export function isParsableNode(node) {
  let isParsable = true

  node.walkDecls((decl) => {
    if (!isParsableCssValue(decl.name, decl.value)) {
      isParsable = false
      return false
    }
  })

  return isParsable
}

export function isParsableCssValue(property, value) {
  // We don't want to to treat [https://example.com] as a custom property
  // Even though, according to the CSS grammar, it's a totally valid CSS declaration
  // So we short-circuit here by checking if the custom property looks like a url
  if (looksLikeUri(`${property}:${value}`)) {
    return false
  }

  try {
    postcss.parse(`a{${property}:${value}}`).toResult()
    return true
  } catch (err) {
    return false
  }
}
