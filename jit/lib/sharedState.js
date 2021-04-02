const LRU = require('quick-lru')

module.exports = {
  env: {
    TAILWIND_MODE: process.env.TAILWIND_MODE,
    NODE_ENV: process.env.NODE_ENV,
    DEBUG: process.env.DEBUG !== undefined,
    TAILWIND_DISABLE_TOUCH: process.env.TAILWIND_DISABLE_TOUCH !== undefined,
    TAILWIND_TOUCH_DIR: process.env.TAILWIND_TOUCH_DIR,
  },
  contextMap: new Map(),
  configContextMap: new Map(),
  contextSourcesMap: new Map(),
  contentMatchCache: new LRU({ maxSize: 25000 }),
}
