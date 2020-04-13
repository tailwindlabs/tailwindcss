import _ from 'lodash'

export default function() {
  return function({ addUtilities, variants }) {
    // these are the individual values available with the `place-items` property
    const singleValues = [
      'auto',
      'baseline',
      'center',
      'end',
      'first baseline',
      'flex-end',
      'flex-start',
      'last baseline',
      'left',
      'normal',
      'right',
      'self-end',
      'self-start',
      'start',
      'stretch',
    ]

    const getValues = () => {
      // get all possible pairs from singleValues array
      const pairs = singleValues.reduce(
        (acc, v, i) => acc.concat(singleValues.slice(i + 1).map(w => `${v} ${w}`)),
        []
      )

      // get the inverse of all possible pairs from singleValues array
      const inversePairs = singleValues.reduce(
        (acc, v, i) => acc.concat(singleValues.slice(i + 1).map(w => `${w} ${v}`)),
        []
      )

      // merge pairs and inversePairs array
      const pairsArray = inversePairs.concat(pairs).sort()

      // merge new pairsArray with singleValues array
      const valuesArray = singleValues.concat(pairsArray)

      // return an object from valuesArray
      return Object.assign({}, valuesArray)
    }

    const values = getValues()

    const utilities = _.fromPairs(
      _.map(values, value => {
        const className = `place-${value.replace(/\s+/g, '-')}`

        return [
          `.${className}`,
          {
            'place-items': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('placeItems'))
  }
}
