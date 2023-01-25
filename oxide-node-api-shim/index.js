let log = require('../lib/util/log').default

// This should be a temporary file.
//
// Right now we require `@tailwindcss/oxide` as one of the packages in package.json. This contains
// all the necessary Rust bindings. However, we won't ship those bindings by default yet, and
// therefore you need to install the explicit oxide-insiders version where the Rust bindings are
// available.
//
// To ensure that this doesn't break existing builds of the insiders release, we will use this shim
// to implement all the APIs and show a warning in case you are trying to run `OXIDE=1 npx
// tailwindcs ...` without having installed the oxide-insiders version.
module.exports.parseCandidateStringsFromFiles = function parseCandidateStringsFromFiles(
  _changedContent
) {
  log.warn('oxide-required', [
    'It looks like you are trying to run Tailwind CSS with the OXIDE=1 environment variable.',
    'This version does not have the necessary Rust bindings, so please install the `tailwindcss@insiders-oxide` version instead.',
  ])
  return []
}
