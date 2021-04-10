const { Namer, CONFIG } = require('@parcel/plugin')
const DefaultNamer = require('@parcel/namer-default').default

module.exports = new Namer({
  name({ bundle, bundleGraph, options }) {
    const name = DefaultNamer[CONFIG].name({ bundle, bundleGraph, options })
    const nameWithoutHash = name.replace('.' + bundle.hashReference, '')

    return nameWithoutHash
  },
})
