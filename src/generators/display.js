import defineClasses from '../util/defineClasses'

export default function({ naming: { display: ns } }) {
  return defineClasses({
    [ns.block]: {
      display: 'block',
    },
    [ns.inlineBlock]: {
      display: 'inline-block',
    },
    [ns.inline]: {
      display: 'inline',
    },
    [ns.table]: {
      display: 'table',
    },
    [ns.tableRow]: {
      display: 'table-row',
    },
    [ns.tableCell]: {
      display: 'table-cell',
    },
    [ns.hidden]: {
      display: 'none',
    },
  })
}
