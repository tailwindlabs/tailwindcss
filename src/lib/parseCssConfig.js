// @ts-check

/**
 * @typedef {[plugin: string|null, key: string[]|null, option: string|null]} ConfigPath
 */

export class CssBasedConfig {
  constructor() {
    this.config = {}
  }

  /**
   * Find and convert the `:theme` rule to a configuration object
   * This is merged with the user's JS config
   * It should take precedence over the JS config
   *
   * @param {import('postcss').Root} root
   * @returns {*}
   */
  parse(root) {
    this.config = { extend: {} }

    let rules = this.getThemeRules(root)

    rules.forEach(rule => {
      rule.walkDecls((decl) => {
        if (!decl.prop.startsWith('--')) {
          throw decl.error('Only CSS variables are allowed in `:theme`')
        }

        this.parseVariable(decl)
      })

      // Allow the variables to be used with var() anywhere in CSS
      rule.selector = ':root'
    })

    return this.config
  }

  /**
   * Walk the tree and find all `:theme` rules
   *
   * @param {import('postcss').Root} root
   * @returns {import('postcss').Rule[]}
   */
  getThemeRules(root) {
    /** @type {any[]} */
    let rules = root.nodes.filter(node => node.type === 'rule' && node.selector === ':theme')

    return rules
  }

  /**
   * Parse a variable declaration and modify the config
   *
   * @param {import('postcss').Declaration} decl
   */
  parseVariable(decl) {
    let config = this.config

    // Parse the variable name into a config plugin and keypath
    let [name, value] = [decl.prop.slice(2), decl.value]
    let [plugin, keypath, option] = this.parseVariableName(name)

    if (plugin === null) {
      // We couldn't find a plugin for this variable, so we can't do anything with it
      // This also means there is no reason to keep the variable in the CSS
      decl.remove()
      return
    }

    if (keypath === null && value === 'unset') {
      // when using `--some-plugin: unset` we want to reset whatever the default value is
      config[plugin] = {}

      // This also means there is no reason to keep the variable in the CSS
      decl.remove()

      return
    }

    if (keypath !== null && value === 'unset') {
      // when using `--plugin-key: unset` we want to remove that from the config
      throw decl.error("Not implemented yet");
    }

    // TODO: Can this happen
    if (keypath === null) {
      return
    }

    // All other cases are config keys in a plugin
    config.extend[plugin] ??= {}

    let [path, key] = [
      keypath.slice(0, -1),
      keypath[keypath.length-1],
    ]

    let obj = config.extend[plugin]
    let segment
    while (segment = path.shift()) {
      obj[segment] ??= {}
      obj = obj[segment]
    }

    if (option) {
      // TODO: This is weird
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key], {}]
      }

      obj[key][1][option] = value
    } else {
      obj[key] = value
    }
  }

  /**
   * Convert a variable name into:
   * - The associated plugin
   * - A keypath to modify inside plugin's config (if available)
   * - An "option" which is a key into the "options" object when a Tuple-like value is used
   *
   * @param {string} name
   * @returns {ConfigPath}
   */
  parseVariableName(name) {
    // Unescape the name if needed
    // This is needed for CSS variables that contain special characters
    name = unescape(name)

    for (const [prefix, plugin] of Object.entries(this.prefixPluginMap)) {
      if (!name.startsWith(prefix)) continue

      // The keypath is the part of the variable name after the prefix
      let keypath = name.slice(prefix.length)
      let option = null

      let optionStart = keypath.indexOf('--')
      if (optionStart !== -1) {
        option = keypath.slice(optionStart+2)
        keypath = keypath.slice(0, optionStart)
      }

      if (keypath == '' && option === 'default') {
        keypath = 'DEFAULT'
        option = null
      } else if (keypath.startsWith('-')) {
        keypath = keypath.slice(1)
      }

      if (keypath === '') {
        return [plugin, null, null]
      }

      option = option === null ? null : camelize(option);

      if (plugin === 'colors') {
        return [plugin, keypath.split('-'), option]
      }

      return [plugin, [keypath], option]
    }

    return [null, null, null]
  }

  get prefixPluginMap() {
    // TODO: Maybe build this based on a list of registered plugins
    // Or maybe a plugin can register namespaces themselves?
    return {
      'animation': 'animation',
      'colors': 'colors',
      'spacing': 'spacing',
      'font-family': 'fontFamily',
      'font-size': 'fontSize',
      // 'shadow': 'boxShadow',
      'blur': 'blur',
    }
  }
}

/**
 * @param {string} str
 * @returns {string}
 */
function camelize(str) {
  return str.replace(/-([a-zA-Z])/g, (v) => v.slice(1).toUpperCase())
}

/**
 * @param {string} str
 * @returns {string}
 */
function unescape(str) {
  let pattern = /\\([0-9a-fA-F]{1,6}[\t\n\f\r ]?|[\S\s])/g

  return str.replace(pattern, (match) =>
    match.length > 2
      ? String.fromCodePoint(parseInt(match.slice(1).trimEnd(), 16))
      : match[1]
  )
}
