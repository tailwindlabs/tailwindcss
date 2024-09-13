import { toCss, walk, type AstNode } from '../ast'
import type { DesignSystem } from '../design-system'
import type { Theme, ThemeKey } from '../theme'
import { withAlpha } from '../utilities'
import { segment } from '../utils/segment'
import { toKeyPath } from '../utils/to-key-path'
import { applyConfigToTheme } from './apply-config-to-theme'
import { createCompatConfig } from './config/create-compat-config'
import { resolveConfig } from './config/resolve-config'
import type { UserConfig } from './config/types'
import { darkModePlugin } from './dark-mode'
import { buildPluginApi, type CssPluginOptions, type Plugin } from './plugin-api'

export async function applyCompatibilityHooks({
  designSystem,
  ast,
  loadPlugin,
  loadConfig,
  globs,
}: {
  designSystem: DesignSystem
  ast: AstNode[]
  loadPlugin: (path: string) => Promise<Plugin>
  loadConfig: (path: string) => Promise<UserConfig>
  globs: { origin?: string; pattern: string }[]
}) {
  let pluginPaths: [string, CssPluginOptions | null][] = []
  let configPaths: string[] = []

  walk(ast, (node, { parent, replaceWith }) => {
    if (node.kind !== 'rule' || node.selector[0] !== '@') return

    // Collect paths from `@plugin` at-rules
    if (node.selector === '@plugin' || node.selector.startsWith('@plugin ')) {
      if (parent !== null) {
        throw new Error('`@plugin` cannot be nested.')
      }

      let pluginPath = node.selector.slice(9, -1)
      if (pluginPath.length === 0) {
        throw new Error('`@plugin` must have a path.')
      }

      let options: CssPluginOptions = {}

      for (let decl of node.nodes ?? []) {
        if (decl.kind !== 'declaration') {
          throw new Error(
            `Unexpected \`@plugin\` option:\n\n${toCss([decl])}\n\n\`@plugin\` options must be a flat list of declarations.`,
          )
        }

        if (decl.value === undefined) continue

        // Parse the declaration value as a primitive type
        // These are the same primitive values supported by JSON
        let value: CssPluginOptions[keyof CssPluginOptions] = decl.value

        let parts = segment(value, ',').map((part) => {
          part = part.trim()

          if (part === 'null') {
            return null
          } else if (part === 'true') {
            return true
          } else if (part === 'false') {
            return false
          } else if (!Number.isNaN(Number(part))) {
            return Number(part)
          } else if (
            (part[0] === '"' && part[part.length - 1] === '"') ||
            (part[0] === "'" && part[part.length - 1] === "'")
          ) {
            return part.slice(1, -1)
          } else if (part[0] === '{' && part[part.length - 1] === '}') {
            throw new Error(
              `Unexpected \`@plugin\` option: Value of declaration \`${toCss([decl]).trim()}\` is not supported.\n\nUsing an object as a plugin option is currently only supported in JavaScript configuration files.`,
            )
          }

          return part
        })

        options[decl.property] = parts.length === 1 ? parts[0] : parts
      }

      pluginPaths.push([pluginPath, Object.keys(options).length > 0 ? options : null])

      replaceWith([])
      return
    }

    // Collect paths from `@config` at-rules
    if (node.selector === '@config' || node.selector.startsWith('@config ')) {
      if (node.nodes.length > 0) {
        throw new Error('`@config` cannot have a body.')
      }

      if (parent !== null) {
        throw new Error('`@config` cannot be nested.')
      }

      configPaths.push(node.selector.slice(9, -1))
      replaceWith([])
      return
    }
  })

  // Override `resolveThemeValue` with a version that is backwards compatible
  // with dot notation paths like `colors.red.500`. We could do this by default
  // in `resolveThemeValue` but handling it here keeps all backwards
  // compatibility concerns localized to our compatibility layer.
  let resolveThemeVariableValue = designSystem.resolveThemeValue

  designSystem.resolveThemeValue = function resolveThemeValue(path: string) {
    if (path.startsWith('--')) {
      return resolveThemeVariableValue(path)
    }

    // Extract an eventual modifier from the path. e.g.:
    // - "colors.red.500 / 50%" -> "50%"
    let lastSlash = path.lastIndexOf('/')
    let modifier: string | null = null
    if (lastSlash !== -1) {
      modifier = path.slice(lastSlash + 1).trim()
      path = path.slice(0, lastSlash).trim() as ThemeKey
    }

    let themeValue = lookupThemeValue(designSystem.theme, path)

    // Apply the opacity modifier if present
    if (modifier && themeValue) {
      return withAlpha(themeValue, modifier)
    }

    return themeValue
  }

  // If there are no plugins or configs registered, we don't need to register
  // any additional backwards compatibility hooks.
  if (!pluginPaths.length && !configPaths.length) return

  let configs = await Promise.all(
    configPaths.map(async (configPath) => ({
      path: configPath,
      config: await loadConfig(configPath),
    })),
  )
  let pluginDetails = await Promise.all(
    pluginPaths.map(async ([pluginPath, pluginOptions]) => ({
      path: pluginPath,
      plugin: await loadPlugin(pluginPath),
      options: pluginOptions,
    })),
  )

  let plugins = pluginDetails.map((detail) => {
    if (!detail.options) {
      return detail.plugin
    }

    if ('__isOptionsFunction' in detail.plugin) {
      return detail.plugin(detail.options)
    }

    throw new Error(`The plugin "${detail.path}" does not accept options`)
  })

  let userConfig = [{ config: { plugins } }, ...configs]

  let resolvedConfig = resolveConfig(designSystem, [
    { config: createCompatConfig(designSystem.theme) },
    ...userConfig,
    { config: { plugins: [darkModePlugin] } },
  ])

  let pluginApi = buildPluginApi(designSystem, ast, resolvedConfig)

  for (let { handler } of resolvedConfig.plugins) {
    handler(pluginApi)
  }

  // Merge the user-configured theme keys into the design system. The compat
  // config would otherwise expand into namespaces like `background-color` which
  // core utilities already read from.
  applyConfigToTheme(designSystem, userConfig)

  // Replace `resolveThemeValue` with a version that is backwards compatible
  // with dot-notation but also aware of any JS theme configurations registered
  // by plugins or JS config files. This is significantly slower than just
  // upgrading dot-notation keys so we only use this version if plugins or
  // config files are actually being used. In the future we may want to optimize
  // this further by only doing this if plugins or config files _actually_
  // registered JS config objects.
  designSystem.resolveThemeValue = function resolveThemeValue(path: string, defaultValue?: string) {
    let resolvedValue = pluginApi.theme(path, defaultValue)

    if (Array.isArray(resolvedValue) && resolvedValue.length === 2) {
      // When a tuple is returned, return the first element
      return resolvedValue[0]
    } else if (Array.isArray(resolvedValue)) {
      // Arrays get serialized into a comma-separated lists
      return resolvedValue.join(', ')
    } else if (typeof resolvedValue === 'string') {
      // Otherwise only allow string values here, objects (and namespace maps)
      // are treated as non-resolved values for the CSS `theme()` function.
      return resolvedValue
    }
  }

  for (let file of resolvedConfig.content.files) {
    if ('raw' in file) {
      throw new Error(
        `Error in the config file/plugin/preset. The \`content\` key contains a \`raw\` entry:\n\n${JSON.stringify(file, null, 2)}\n\nThis feature is not currently supported.`,
      )
    }

    globs.push({ origin: file.base, pattern: file.pattern })
  }
}

function toThemeKey(keypath: string[]) {
  return (
    keypath
      // [1] should move into the nested object tuple. To create the CSS variable
      // name for this, we replace it with an empty string that will result in two
      // subsequent dashes when joined.
      .map((path) => (path === '1' ? '' : path))

      // Resolve the key path to a CSS variable segment
      .map((part) =>
        part
          .replaceAll('.', '_')
          .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`),
      )

      // Remove the `DEFAULT` key at the end of a path
      // We're reading from CSS anyway so it'll be a string
      .filter((part, index) => part !== 'DEFAULT' || index !== keypath.length - 1)
      .join('-')
  )
}

function lookupThemeValue(theme: Theme, path: string) {
  let baseThemeKey = '--' + toThemeKey(toKeyPath(path))

  let resolvedValue = theme.get([baseThemeKey as ThemeKey])

  if (resolvedValue !== null) {
    return resolvedValue
  }

  for (let [givenKey, upgradeKey] of Object.entries(themeUpgradeKeys)) {
    if (!baseThemeKey.startsWith(givenKey)) continue

    let upgradedKey = upgradeKey + baseThemeKey.slice(givenKey.length)
    let resolvedValue = theme.get([upgradedKey as ThemeKey])

    if (resolvedValue !== null) {
      return resolvedValue
    }
  }
}

let themeUpgradeKeys = {
  '--colors': '--color',
  '--accent-color': '--color',
  '--backdrop-blur': '--blur',
  '--backdrop-brightness': '--brightness',
  '--backdrop-contrast': '--contrast',
  '--backdrop-grayscale': '--grayscale',
  '--backdrop-hue-rotate': '--hueRotate',
  '--backdrop-invert': '--invert',
  '--backdrop-opacity': '--opacity',
  '--backdrop-saturate': '--saturate',
  '--backdrop-sepia': '--sepia',
  '--background-color': '--color',
  '--background-opacity': '--opacity',
  '--border-color': '--color',
  '--border-opacity': '--opacity',
  '--border-spacing': '--spacing',
  '--box-shadow-color': '--color',
  '--caret-color': '--color',
  '--divide-color': '--borderColor',
  '--divide-opacity': '--borderOpacity',
  '--divide-width': '--borderWidth',
  '--fill': '--color',
  '--flex-basis': '--spacing',
  '--gap': '--spacing',
  '--gradient-color-stops': '--color',
  '--height': '--spacing',
  '--inset': '--spacing',
  '--margin': '--spacing',
  '--max-height': '--spacing',
  '--max-width': '--spacing',
  '--min-height': '--spacing',
  '--min-width': '--spacing',
  '--outline-color': '--color',
  '--padding': '--spacing',
  '--placeholder-color': '--color',
  '--placeholder-opacity': '--opacity',
  '--ring-color': '--color',
  '--ring-offset-color': '--color',
  '--ring-opacity': '--opacity',
  '--scroll-margin': '--spacing',
  '--scroll-padding': '--spacing',
  '--space': '--spacing',
  '--stroke': '--color',
  '--text-color': '--color',
  '--text-decoration-color': '--color',
  '--text-indent': '--spacing',
  '--text-opacity': '--opacity',
  '--translate': '--spacing',
  '--size': '--spacing',
  '--width': '--spacing',
}
