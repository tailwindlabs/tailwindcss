import { splitVariantPrefix } from './splitVariantPrefix'

/**
 * @param {string} value
 * @returns {[string, string]}
 */
export function splitDimensionPrefix(value) {
  const [prefix, extractedValue] = splitVariantPrefix(value)
  const dimension = prefix === 'h' ? 'height' : 'width'
  return [dimension, extractedValue]
}
