import _ from 'lodash'

export default function extractGridLineNames(gridTemplate) {
  return _.uniq(
    _.flatMap(gridTemplate, value => {
      if (!value.match(/\[([^\]]*)\]/g)) {
        return []
      }

      // extract grid line names from the gridTemplate
      const matches = _.flatMap(value.match(/\[([^\]]*)\]/g), match => {
        return match.substring(1, match.length - 1).split(/\s+/)
      })

      // create a unique list of names, including counts of how many times that name is used
      const counts = _.fromPairs(
        matches
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(match => {
            return [
              match,
              {
                count: 1,
                total: matches.reduce((count, m) => {
                  return match === m ? ++count : count
                }, 0),
              },
            ]
          })
      )

      // create a list of grid line names for this template, indexing repeated names
      return matches.map(match => {
        if (counts[match].total === 1) {
          return match
        }

        return `${match}-${counts[match].count++}`
      })
    })
  )
}
