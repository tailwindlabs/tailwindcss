const defineClasses = require('../util/defineClasses')

module.exports = function () {
  return defineClasses({
    bgCover: {
      backgroundSize: 'cover',
    },
    bgContain: {
      backgroundSize: 'contain',
    },
  })
}
