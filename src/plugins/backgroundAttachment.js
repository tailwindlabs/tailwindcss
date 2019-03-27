export default function() {
  return function({ addUtilities, config }) {
    const backgroundAttachment = config('classesNames').backgroundAttachment

    addUtilities(
      {
        [`.${backgroundAttachment}-fixed`]: {
          'background-attachment': 'fixed',
        },
        [`.${backgroundAttachment}-local`]: {
          'background-attachment': 'local',
        },
        [`.${backgroundAttachment}-scroll`]: {
          'background-attachment': 'scroll',
        },
      },
      config('variants.backgroundAttachment')
    )
  }
}
