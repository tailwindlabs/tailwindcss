import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'table-auto': { 'table-layout': 'auto' },
    'table-fixed': { 'table-layout': 'fixed' },
  })
}
