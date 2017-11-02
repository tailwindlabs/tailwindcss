import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'overflow-auto': { overflow: 'auto' },
    'overflow-hidden': { overflow: 'hidden' },
    'overflow-visible': { overflow: 'visible' },
    'overflow-scroll': { overflow: 'scroll' },
    'overflow-x-scroll': { 'overflow-x': 'auto', '-ms-overflow-style': '-ms-autohiding-scrollbar' },
    'overflow-y-scroll': { 'overflow-y': 'auto', '-ms-overflow-style': '-ms-autohiding-scrollbar' },
    'scrolling-touch': { '-webkit-overflow-scrolling': 'touch' },
    'scrolling-auto': { '-webkit-overflow-scrolling': 'auto' },
  })
}
