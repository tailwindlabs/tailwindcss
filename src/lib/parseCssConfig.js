// @ts-check

/**
 * Find and convert the `:theme` rule to a configuration object
 * This is merged with the user's JS config
 * It should take precedence over the JS config
 *
 * @param {import('postcss').Root} root
 */
export function parseCssConfig(root) {
  let config = { extend: { colors: {} } }

  root.each(node => {
    if (node.type !== 'rule' || node.selector !== ':theme') return

    node.walkDecls((decl) => {
      if (decl.prop.startsWith('--')) {
        parseVariable(config, decl)
      } else {
        // Only CSS variables are allowed in the theme rule
        // TODO: Maybe turn this into an error?
        decl.remove()
      }
    })

    // Allow the variables to be used with var() anywhere in CSS
    node.selector = ':root'
  })

  return config
}

/**
 * Parse a key into one or more actions that modify the config and/or CSS
 *
 * @param {*} config
 * @param {import('postcss').Declaration} decl
 */
function parseVariable(config, decl) {
  // Parse the variable name into a config plugin and keypath
  let [name, value] = [decl.prop.slice(2), decl.value]
  let [plugin, keypath, option] = parseVariableName(name)

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

  if (!option) {
    config.extend[plugin][keypath] = value
    return
  }

  if (!Array.isArray(config.extend[plugin][keypath])) {
    config.extend[plugin][keypath] = [
      config.extend[plugin][keypath],
      {}
    ]
  }

  config.extend[plugin][keypath][1][option] = value
}

/**
 * Parse a key into one or more actions that modify the config and/or CSS
 *
 * @param {string} name
 * @returns {[plugin: string|null, keypath: string|null, option: string|null]}
 */
function parseVariableName(name) {
  const prefixPluginMap = {
    'colors': 'colors',
    'spacing': 'spacing',
    'font-family': 'fontFamily',
    'font-size': 'fontSize',
    'shadow': 'boxShadow',
    'blur': 'blur',
  }

  // Unescape the name if needed
  // This is needed for CSS variables that contain special characters
  name = name.replace(/\\/g, '')

  for (const [prefix, plugin] of Object.entries(prefixPluginMap)) {
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

    return [plugin, keypath, option === null ? null : camelize(option)]
  }

  return [null, null, null]
}

/**
 * @param {string} str
 * @returns {string}
 */
function camelize(str) {
  return str.replace(/-([a-zA-Z])/g, (v) => v.slice(1).toUpperCase())
}
