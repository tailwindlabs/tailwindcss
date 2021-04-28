import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('ringOpacity', [['ring-opacity', ['--tw-ring-opacity']]], {
    filterDefault: true,
  })
}
