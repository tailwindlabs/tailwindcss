import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'overflow-auto': { overflow: 'auto' },
    'overflow-hidden': { overflow: 'hidden' },
    'overflow-visible': { overflow: 'visible' },
    'overflow-scroll': { overflow: 'scroll' },
    'overflow-x-auto': { 'overflow-x': 'auto' },
    'overflow-y-auto': { 'overflow-y': 'auto' },
    'overflow-x-scroll': { 'overflow-x': 'scroll' },
    'overflow-y-scroll': { 'overflow-y': 'scroll' },
    'scrolling-touch': { '-webkit-overflow-scrolling': 'touch' },
    'scrolling-auto': { '-webkit-overflow-scrolling': 'auto' },
  })
}
