import LRU from 'quick-lru'

export const env = {
  TAILWIND_MODE: process.env.TAILWIND_MODE,
  NODE_ENV: process.env.NODE_ENV,
  DEBUG: process.env.DEBUG !== undefined,
  TAILWIND_DISABLE_TOUCH: process.env.TAILWIND_DISABLE_TOUCH !== undefined,
  TAILWIND_TOUCH_DIR: process.env.TAILWIND_TOUCH_DIR,
}
export const contextMap = new Map()
export const configContextMap = new Map()
export const contextSourcesMap = new Map()
export const contentMatchCache = new LRU({ maxSize: 25000 })
