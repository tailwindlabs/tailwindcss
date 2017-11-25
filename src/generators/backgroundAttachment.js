import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'bg-scroll': { 'background-attachment': 'scroll' },
    'bg-fixed': { 'background-attachment': 'fixed' },
    'bg-local': { 'background-attachment': 'local' },
  })
}
