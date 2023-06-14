// @ts-check

// config[plugin] = null // Remomve from base config
// config[plugin][key] = null // not supported
// config[plugin] = "anything" // not supported
// config[plugin][key] = "foo" // not supported

export class CssBasedConfig {
  /** @type {*} */
  config = {};

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
        if (decl.prop.startsWith('--')) {
          this.parseVariable(decl)
        } else {
          throw decl.error('Only CSS variables are allowed in `:theme`')
        }
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
    let rules = []

    root.each(node => {
      if (node.type === 'rule' && node.selector === ':theme') {
        rules.push(node)
      }
    })

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

    // We couldn't find a plugin for this variable, so we can't do anything with it
    if (plugin === null) return

    if (keypath === null && value === 'unset') {
      // when using `--some-plugin: unset` we want to reset whatever the default value is
      config[plugin] = {}

      // This also means there is no reason to keep the variable in the CSS
      decl.remove()

      return
    } else if (keypath !== null && value === 'unset') {
      // when using `--plugin-key: unset` we want to remove that from the config
      throw new Error("Not implemented yet")
    }

    // When using `--some-plugin: initial` it should reset to the default value for that key
    // This effectively means removing it
    if (keypath === null && value === 'initial') {
      delete config[plugin]
      delete config.extend[plugin]

      // This also means there is no reason to keep the variable in the CSS
      decl.remove()

      return
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
   * @returns {[plugin: string|null, keypath: string[]|null, option: string|null]}
   */
  parseVariableName(name) {
    // Unescape the name if needed
    // This is needed for CSS variables that contain special characters
    name = name.replace(/\\/g, '')

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
    return {
      'colors': 'colors',
      'spacing': 'spacing',
      'font-family': 'fontFamily',
      'font-size': 'fontSize',
      'shadow': 'boxShadow',
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
