/**
 * @param {string} value
 * @returns {[string, string]}
 */
export function splitVariantPrefix(value) {
  if (typeof value !== 'string') return ['', value]
  let parts = value.split(':')
  return ['', ...parts].slice(-2)
}
