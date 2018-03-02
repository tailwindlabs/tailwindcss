export default function(prefix, selector) {
  const getPrefix = typeof prefix === 'function' ? prefix : () => prefix

  return `.${getPrefix(selector)}${selector.slice(1)}`
}
