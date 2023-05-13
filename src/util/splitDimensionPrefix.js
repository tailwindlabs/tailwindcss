import { splitVariantPrefix } from './splitVariantPrefix'

/**
 * @param {string} value
 * @returns {['height' | 'width', string]}
 */
export function splitDimensionPrefix(value) {
  const [prefix, extractedValue] = splitVariantPrefix(value)
  const dimension = prefix === 'h' ? 'height' : 'width'
  return [dimension, extractedValue]
}
