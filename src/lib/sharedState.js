import pkg from '../../package.json'
let OXIDE_DEFAULT_ENABLED = pkg.tailwindcss.engine === 'oxide'

export const env =
  typeof process !== 'undefined'
    ? {
        NODE_ENV: process.env.NODE_ENV,
        DEBUG: resolveDebug(process.env.DEBUG),
        ENGINE: pkg.tailwindcss.engine,
        OXIDE: resolveBoolean(process.env.OXIDE, OXIDE_DEFAULT_ENABLED),
      }
    : {
        NODE_ENV: 'production',
        DEBUG: false,
        ENGINE: pkg.tailwindcss.engine,
        OXIDE: OXIDE_DEFAULT_ENABLED,
      }

export const contextMap = new Map()
export const configContextMap = new Map()
export const contextSourcesMap = new Map()
export const sourceHashMap = new Map()
export const NOT_ON_DEMAND = new String('*')

export const NONE = Symbol('__NONE__')

function resolveBoolean(value, defaultValue) {
  if (value === undefined) {
    return defaultValue
  }

  if (value === '0' || value === 'false') {
    return false
  }

  return true
}

export function resolveDebug(debug) {
  if (debug === undefined) {
    return false
  }

  // Environment variables are strings, so convert to boolean
  if (debug === 'true' || debug === '1') {
    return true
  }

  if (debug === 'false' || debug === '0') {
    return false
  }

  // Keep the debug convention into account:
  // DEBUG=* -> This enables all debug modes
  // DEBUG=projectA,projectB,projectC -> This enables debug for projectA, projectB and projectC
  // DEBUG=projectA:* -> This enables all debug modes for projectA (if you have sub-types)
  // DEBUG=projectA,-projectB -> This enables debug for projectA and explicitly disables it for projectB

  if (debug === '*') {
    return true
  }

  let debuggers = debug.split(',').map((d) => d.split(':')[0])

  // Ignoring tailwindcss
  if (debuggers.includes('-tailwindcss')) {
    return false
  }

  // Including tailwindcss
  if (debuggers.includes('tailwindcss')) {
    return true
  }

  return false
}
