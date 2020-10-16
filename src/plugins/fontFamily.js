import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('fontFamily', [
    [
      'font',
      ['fontFamily'],
      value => {
        return Array.isArray(value) ? value.join(', ') : value
      },
    ],
  ])
}
