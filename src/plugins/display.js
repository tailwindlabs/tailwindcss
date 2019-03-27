export default function() {
  return function({ addUtilities, config }) {
    const display = config('classesNames').display

    addUtilities(
      {
        [`.${display}block`]: {
          display: 'block',
        },
        [`.${display}inline-block`]: {
          display: 'inline-block',
        },
        [`.${display}inline`]: {
          display: 'inline',
        },
        [`.${display}flex`]: {
          display: 'flex',
        },
        [`.${display}inline-flex`]: {
          display: 'inline-flex',
        },
        [`.${display}table`]: {
          display: 'table',
        },
        [`.${display}table-row`]: {
          display: 'table-row',
        },
        [`.${display}table-cell`]: {
          display: 'table-cell',
        },
        [`.${display}hidden`]: {
          display: 'none',
        },
      },
      config('variants.display')
    )
  }
}
