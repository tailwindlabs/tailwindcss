/**
 * @typedef {object} ScreenValue
 * @property {number|undefined} min
 * @property {number|undefined} max
 * @property {string|undefined} raw
 */

/**
 * @typedef {object} Screen
 * @property {string} name
 * @property {boolean} not
 * @property {ScreenValue[]} values
 */

/**
 * A function that normalizes the various forms that the screens object can be
 * provided in.
 *
 * Input(s):
 *   - ['100px', '200px'] // Raw strings
 *   - { sm: '100px', md: '200px' } // Object with string values
 *   - { sm: { min: '100px' }, md: { max: '100px' } } // Object with object values
 *   - { sm: [{ min: '100px' }, { max: '200px' }] } // Object with object array (multiple values)
 *
 * Output(s):
 *   - [{ name: 'sm', values: [{ min: '100px', max: '200px' }] }] // List of objects, that contains multiple values
 *
 * @returns {Screen[]}
 */
export function normalizeScreens(screens, root = true) {
  if (Array.isArray(screens)) {
    return screens.map((screen) => {
      if (root && Array.isArray(screen)) {
        throw new Error('The tuple syntax is not supported for `screens`.')
      }

      if (typeof screen === 'string') {
        return { name: screen.toString(), not: false, values: [{ min: screen, max: undefined }] }
      }

      let [name, options] = screen
      name = name.toString()

      if (typeof options === 'string') {
        return { name, not: false, values: [{ min: options, max: undefined }] }
      }

      if (Array.isArray(options)) {
        return { name, not: false, values: options.map((option) => resolveValue(option)) }
      }

      return { name, not: false, values: [resolveValue(options)] }
    })
  }

  return normalizeScreens(Object.entries(screens ?? {}), false)
}

function resolveValue({ 'min-width': _minWidth, min = _minWidth, max, raw } = {}) {
  return { min, max, raw }
}
