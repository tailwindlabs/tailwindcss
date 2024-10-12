export type PluginFn = (api: PluginAPI) => void
export type PluginWithConfig = { handler: PluginFn }
export type PluginWithOptions<T> = {
  (options?: T): PluginWithConfig
  __isOptionsFunction: true
}

export type Plugin = PluginFn | PluginWithConfig | PluginWithOptions<any>
export type CssInJs = { [key: string]: string | CssInJs | CssInJs[] }

export type NamedUtilityValue = {
  kind: 'named'

  /**
   * bg-red-500
   *    ^^^^^^^
   *
   * w-1/2
   *   ^
   */
  value: string

  /**
   * w-1/2
   *   ^^^
   */
  fraction: string | null
}

export type PluginAPI = {
  addBase(base: CssInJs): void
  addVariant(name: string, variant: string | string[] | CssInJs): void

  addUtilities(
    utilities: Record<string, CssInJs | CssInJs[]> | Record<string, CssInJs | CssInJs[]>[],
    options?: {},
  ): void

  matchUtilities(
    utilities: Record<
      string,
      (value: string, extra: { modifier: string | null }) => CssInJs | CssInJs[]
    >,
    options?: Partial<{
      type: string | string[]
      supportsNegativeValues: boolean
      values: Record<string, string> & {
        __BARE_VALUE__?: (value: NamedUtilityValue) => string | undefined
      }
      modifiers: 'any' | Record<string, string>
    }>,
  ): void

  // addComponents(utilities: Record<string, CssInJs> | Record<string, CssInJs>[], options?: {}): void
  // matchComponents(
  //   utilities: Record<string, (value: string, extra: { modifier: string | null }) => CssInJs>,
  //   options?: Partial<{
  //     type: string | string[]
  //     supportsNegativeValues: boolean
  //     values: Record<string, string> & {
  //       __BARE_VALUE__?: (value: NamedUtilityValue) => string | undefined
  //     }
  //     modifiers: 'any' | Record<string, string>
  //   }>,
  // ): void

  // theme(path: string, defaultValue?: any): any
  // prefix(className: string): string
}

import * as rpc from 'vscode-jsonrpc/node'

export function buildPluginController(server: rpc.MessageConnection) {
  let utilityMap = new Map<
    string,
    (value: string, extra: { modifier: string | null }) => CssInJs | CssInJs[]
  >()

  let api = buildPluginApi(server, utilityMap)

  return {
    api,

    matchUtility(id: string, value: string, modifier: string | null) {
      let fn = utilityMap.get(id)
      if (!fn) return

      return fn(value, { modifier })
    },
  }
}

function buildPluginApi(
  server: rpc.MessageConnection,
  utilityMap: Map<
    string,
    (value: string, extra: { modifier: string | null }) => CssInJs | CssInJs[]
  >,
): PluginAPI {
  return {
    addBase(base) {
      server.sendNotification('@/plugin/add-base', { ast: base })
    },

    addVariant(name, variant) {
      server.sendNotification('@/plugin/add-variant', { name, format: variant })
    },

    addUtilities(utilities, options) {
      server.sendNotification('@/plugin/add-utilities', { ast: utilities, options })
    },

    matchUtilities(utilities, options) {
      let namesToIds: Record<string, string> = {}

      for (let [name, fn] of Object.entries(utilities)) {
        let id = Math.random().toString(36).slice(2)
        namesToIds[name] = id
        utilityMap.set(id, fn)
      }

      server.sendNotification('@/plugin/match-utility', {
        utilities: namesToIds,
      })
    },
  }
}
