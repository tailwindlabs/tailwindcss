import escapeClassName from './escapeClassName'

export default function buildClassVariant(className, variantName, variantsAsSuffix, separator) {
  if (variantsAsSuffix) {
    return `${className}${escapeClassName(separator)}${variantName}`
  }
  return `.${variantName}${escapeClassName(separator)}${className.slice(1)}`
}
