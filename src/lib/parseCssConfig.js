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

  let theme = root.nodes.find(node => node.type === 'rule' && node.selector === ':theme')
  if (!theme) return config

  theme.walkDecls((decl) => {
    if (decl.prop.startsWith('--')) {
      parseVariable(config, decl.prop.slice(2), decl.value)
    } else {
      // Only CSS variables are allowed in the theme rule
      // TODO: Maybe turn this into an error?
      decl.remove()
    }
  })

  // Allow the variables to be used with var() anywhere in CSS
  theme.selector = ':root'

  return config
}

let prefixPluginMap = {
  'colors': 'colors',
  'spacing': 'spacing',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'shadow': 'boxShadow',
}

/**
 * Parse a key into one or more actions that modify the config and/or CSS
 *
 * @param {*} config
 * @param {string} name
 * @param {string} value
 */
function parseVariable(config, name, value) {
  // Parse the variable name into a config plugin and keypath
  let [plugin, keypath] = parseVariableName(name, value)

  console.log({ name, plugin, keypath, value })

  // We couldn't find a plugin for this variable, so we can't do anything with it
  if (plugin === null) return

  if (keypath === null && value === 'unset') {
    // when using `--some-plugin: unset` we want to reset whatever the default value is
    config[plugin] = {}

    // This also means there is no reason to keep the variable in the CSS
    decl.remove()

    return
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

  // All other cases are config keys in a plugin
  config.extend[plugin] ??= {}
  config.extend[plugin][keypath] = value
}

/**
 * Parse a key into one or more actions that modify the config and/or CSS
 *
 * @param {string} name
 * @param {string} value
 * @returns {[plugin: string|null, keypath: string|null]}
 */
function parseVariableName(name, value) {
  for (const [prefix, plugin] of Object.entries(prefixPluginMap)) {
    if (!name.startsWith(prefix)) continue

    // The keypath is the part of the variable name after the prefix
    let keypath = name.slice(prefix.length)
    if (keypath.startsWith('-')) keypath = keypath.slice(1)
    if (keypath === '') keypath = null

    return [plugin, keypath]
  }

  return [null, null]
}
