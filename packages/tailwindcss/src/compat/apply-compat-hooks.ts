import { Features } from '..'
import { styleRule, toCss, walk, WalkAction, type AstNode } from '../ast'
import type { DesignSystem } from '../design-system'
import { segment } from '../utils/segment'
import { applyConfigToTheme } from './apply-config-to-theme'
import { applyKeyframesToTheme } from './apply-keyframes-to-theme'
import { createCompatConfig } from './config/create-compat-config'
import { resolveConfig } from './config/resolve-config'
import type { UserConfig } from './config/types'
import { registerContainerCompat } from './container'
import { darkModePlugin } from './dark-mode'
import { registerLegacyUtilities } from './legacy-utilities'
import { buildPluginApi, type CssPluginOptions, type Plugin } from './plugin-api'
import { registerScreensConfig } from './screens-config'
import { registerThemeVariantOverrides } from './theme-variants'

const IS_VALID_PREFIX = /^[a-z]+$/

export async function applyCompatibilityHooks({
  designSystem,
  base,
  ast,
  loadModule,
  sources,
}: {
  designSystem: DesignSystem
  base: string
  ast: AstNode[]
  loadModule: (
    path: string,
    base: string,
    resourceHint: 'plugin' | 'config',
  ) => Promise<{ module: any; base: string }>
  sources: { base: string; pattern: string; negated: boolean }[]
}) {
  let features = Features.None
  let pluginPaths: [{ id: string; base: string; reference: boolean }, CssPluginOptions | null][] =
    []
  let configPaths: { id: string; base: string; reference: boolean }[] = []

  walk(ast, (node, { parent, replaceWith, context }) => {
    if (node.kind !== 'at-rule') return

    // Collect paths from `@plugin` at-rules
    if (node.name === '@plugin') {
      if (parent !== null) {
        throw new Error('`@plugin` cannot be nested.')
      }

      let pluginPath = node.params.slice(1, -1)
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

      pluginPaths.push([
        { id: pluginPath, base: context.base as string, reference: !!context.reference },
        Object.keys(options).length > 0 ? options : null,
      ])

      replaceWith([])
      features |= Features.JsPluginCompat
      return
    }

    // Collect paths from `@config` at-rules
    if (node.name === '@config') {
      if (node.nodes.length > 0) {
        throw new Error('`@config` cannot have a body.')
      }

      if (parent !== null) {
        throw new Error('`@config` cannot be nested.')
      }

      configPaths.push({
        id: node.params.slice(1, -1),
        base: context.base as string,
        reference: !!context.reference,
      })
      replaceWith([])
      features |= Features.JsPluginCompat
      return
    }
  })

  registerLegacyUtilities(designSystem)

  // Override `resolveThemeValue` with a version that is backwards compatible
  // with dot notation paths like `colors.red.500`. We could do this by default
  // in `resolveThemeValue` but handling it here keeps all backwards
  // compatibility concerns localized to our compatibility layer.
  let resolveThemeVariableValue = designSystem.resolveThemeValue

  designSystem.resolveThemeValue = function resolveThemeValue(path: string, forceInline?: boolean) {
    if (path.startsWith('--')) {
      return resolveThemeVariableValue(path, forceInline)
    }

    // If the theme value is not found in the simple resolver, we upgrade to the full backward
    // compatibility support implementation of the `resolveThemeValue` function.
    features |= upgradeToFullPluginSupport({
      designSystem,
      base,
      ast,
      sources,
      configs: [],
      pluginDetails: [],
    })
    return designSystem.resolveThemeValue(path, forceInline)
  }

  // If there are no plugins or configs registered, we don't need to register
  // any additional backwards compatibility hooks.
  if (!pluginPaths.length && !configPaths.length) return Features.None

  let [configs, pluginDetails] = await Promise.all([
    Promise.all(
      configPaths.map(async ({ id, base, reference }) => {
        let loaded = await loadModule(id, base, 'config')
        return {
          path: id,
          base: loaded.base,
          config: loaded.module as UserConfig,
          reference,
        }
      }),
    ),
    Promise.all(
      pluginPaths.map(async ([{ id, base, reference }, pluginOptions]) => {
        let loaded = await loadModule(id, base, 'plugin')
        return {
          path: id,
          base: loaded.base,
          plugin: loaded.module as Plugin,
          options: pluginOptions,
          reference,
        }
      }),
    ),
  ])

  features |= upgradeToFullPluginSupport({
    designSystem,
    base,
    ast,
    sources,
    configs,
    pluginDetails,
  })

  return features
}

function upgradeToFullPluginSupport({
  designSystem,
  base,
  ast,
  sources,
  configs,
  pluginDetails,
}: {
  designSystem: DesignSystem
  base: string
  ast: AstNode[]
  sources: { base: string; pattern: string; negated: boolean }[]
  configs: {
    path: string
    base: string
    config: UserConfig
    reference: boolean
  }[]
  pluginDetails: {
    path: string
    base: string
    plugin: Plugin
    options: CssPluginOptions | null
    reference: boolean
  }[]
}) {
  let features = Features.None
  let pluginConfigs = pluginDetails.map((detail) => {
    if (!detail.options) {
      return {
        config: { plugins: [detail.plugin] },
        base: detail.base,
        reference: detail.reference,
      }
    }

    if ('__isOptionsFunction' in detail.plugin) {
      return {
        config: { plugins: [detail.plugin(detail.options)] },
        base: detail.base,
        reference: detail.reference,
      }
    }

    throw new Error(`The plugin "${detail.path}" does not accept options`)
  })

  let userConfig = [...pluginConfigs, ...configs]

  let { resolvedConfig } = resolveConfig(designSystem, [
    { config: createCompatConfig(designSystem.theme), base, reference: true },
    ...userConfig,
    { config: { plugins: [darkModePlugin] }, base, reference: true },
  ])
  let { resolvedConfig: resolvedUserConfig, replacedThemeKeys } = resolveConfig(
    designSystem,
    userConfig,
  )

  // Replace `resolveThemeValue` with a version that is backwards compatible
  // with dot-notation but also aware of any JS theme configurations registered
  // by plugins or JS config files. This is significantly slower than just
  // upgrading dot-notation keys so we only use this version if plugins or
  // config files are actually being used. In the future we may want to optimize
  // this further by only doing this if plugins or config files _actually_
  // registered JS config objects.
  let defaultResolveThemeValue = designSystem.resolveThemeValue
  designSystem.resolveThemeValue = function resolveThemeValue(path: string, forceInline?: boolean) {
    if (path[0] === '-' && path[1] === '-') {
      return defaultResolveThemeValue(path, forceInline)
    }

    let resolvedValue = pluginApi.theme(path, undefined)

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

  let pluginApiConfig = {
    designSystem,
    ast,
    resolvedConfig,
    featuresRef: {
      set current(value: number) {
        features |= value
      },
    },
  }

  let pluginApi = buildPluginApi({ ...pluginApiConfig, referenceMode: false })
  let referenceModePluginApi = undefined

  for (let { handler, reference } of resolvedConfig.plugins) {
    if (reference) {
      referenceModePluginApi ||= buildPluginApi({ ...pluginApiConfig, referenceMode: true })
      handler(referenceModePluginApi)
    } else {
      handler(pluginApi)
    }
  }

  // Merge the user-configured theme keys into the design system. The compat
  // config would otherwise expand into namespaces like `background-color` which
  // core utilities already read from.
  applyConfigToTheme(designSystem, resolvedUserConfig, replacedThemeKeys)
  applyKeyframesToTheme(designSystem, resolvedUserConfig, replacedThemeKeys)

  registerThemeVariantOverrides(resolvedUserConfig, designSystem)
  registerScreensConfig(resolvedUserConfig, designSystem)
  registerContainerCompat(resolvedUserConfig, designSystem)

  // If a prefix has already been set in CSS don't override it
  if (!designSystem.theme.prefix && resolvedConfig.prefix) {
    if (resolvedConfig.prefix.endsWith('-')) {
      resolvedConfig.prefix = resolvedConfig.prefix.slice(0, -1)

      console.warn(
        `The prefix "${resolvedConfig.prefix}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only and is written as a variant before all utilities. We have fixed up the prefix for you. Remove the trailing \`-\` to silence this warning.`,
      )
    }

    if (!IS_VALID_PREFIX.test(resolvedConfig.prefix)) {
      throw new Error(
        `The prefix "${resolvedConfig.prefix}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.`,
      )
    }

    designSystem.theme.prefix = resolvedConfig.prefix
  }

  // If an important strategy has already been set in CSS don't override it
  if (!designSystem.important && resolvedConfig.important === true) {
    designSystem.important = true
  }

  if (typeof resolvedConfig.important === 'string') {
    let wrappingSelector = resolvedConfig.important

    walk(ast, (node, { replaceWith, parent }) => {
      if (node.kind !== 'at-rule') return
      if (node.name !== '@tailwind' || node.params !== 'utilities') return

      // The AST node was already manually wrapped so there's nothing to do
      if (parent?.kind === 'rule' && parent.selector === wrappingSelector) {
        return WalkAction.Stop
      }

      replaceWith(styleRule(wrappingSelector, [node]))

      return WalkAction.Stop
    })
  }

  for (let candidate of resolvedConfig.blocklist) {
    designSystem.invalidCandidates.add(candidate)
  }

  for (let file of resolvedConfig.content.files) {
    if ('raw' in file) {
      throw new Error(
        `Error in the config file/plugin/preset. The \`content\` key contains a \`raw\` entry:\n\n${JSON.stringify(file, null, 2)}\n\nThis feature is not currently supported.`,
      )
    }

    let negated = false
    if (file.pattern[0] == '!') {
      negated = true
      file.pattern = file.pattern.slice(1)
    }
    sources.push({ ...file, negated })
  }
  return features
}
