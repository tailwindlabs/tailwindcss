// This file exists so that `plugin.ts` can be written one time but be compatible with both CJS and
// ESM. Without it we get a `.default` export when using `require` in CJS.

// @ts-ignore
module.exports = require('./plugin.ts').default
