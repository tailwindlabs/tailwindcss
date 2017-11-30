import escapeClassName from './escapeClassName'

export default function buildClassVariant(className, variantName, separator) {
  return `.${variantName}${escapeClassName(separator)}${className.slice(1)}`
}
