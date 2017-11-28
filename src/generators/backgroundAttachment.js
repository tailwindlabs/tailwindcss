import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'bg-fixed': { 'background-attachment': 'fixed' },
    'bg-local': { 'background-attachment': 'local' },
    'bg-scroll': { 'background-attachment': 'scroll' },
  })
}
