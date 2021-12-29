export const env = {
  TAILWIND_MODE: process.env.TAILWIND_MODE,
  NODE_ENV: process.env.NODE_ENV,
  DEBUG: resolveDebug(process.env.DEBUG),
  TAILWIND_DISABLE_TOUCH: process.env.TAILWIND_DISABLE_TOUCH !== undefined,
  TAILWIND_TOUCH_DIR: process.env.TAILWIND_TOUCH_DIR,
}
export const contextMap = new Map()
export const configContextMap = new Map()
export const contextSourcesMap = new Map()

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

  // Ignoring tailwind / tailwindcss
  if (debuggers.includes('-tailwindcss') || debuggers.includes('-tailwind')) {
    return false
  }

  // Definitely including tailwind / tailwindcss
  if (debuggers.includes('tailwindcss') || debuggers.includes('tailwind')) {
    return true
  }

  return false
}
