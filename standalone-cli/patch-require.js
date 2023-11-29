const Module = require('node:module')

/**
 * @param {Record<string, any>} mods
 */
module.exports.patchRequire = function patchRequire(mods, parentCache) {
  function wrapRequire(origRequire) {
    return Object.assign(
      function (id) {
        // Patch require(…) to return the cached module
        if (mods.hasOwnProperty(id)) {
          return mods[id]
        }

        return origRequire.apply(this, arguments)
      },

      // Make sure we carry over other properties of the original require(…)
      origRequire,

      {
        resolve(id) {
          // Defer to the "parent" require cache when resolving the module
          // This also requires that the module be provided as a "native module" to JITI

          // The path returned here is VERY important as it ensures that the `isNativeRe` in JITI
          // passes which is required for the module to be loaded via the native require(…) function
          // Thankfully, the regex just means that it needs to be in a node_modules folder which is true
          // even when bundled using Vercel's `pkg`
          if (parentCache.hasOwnProperty(id)) {
            return parentCache[id].filename
          }

          return origRequire.resolve.apply(this, arguments)
        },
      }
    )
  }

  let origRequire = Module.prototype.require
  let origCreateRequire = Module.createRequire

  // We have to augment the default "require" in every module
  Module.prototype.require = wrapRequire(origRequire)

  // And any "require" created by the "createRequire" method
  Module.createRequire = function () {
    return wrapRequire(origCreateRequire.apply(this, arguments))
  }
}
