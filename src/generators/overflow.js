import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'overflow-auto': { overflow: 'auto' },
    'overflow-hidden': { overflow: 'hidden' },
    'mask': { overflow: 'hidden' },
    'overflow-visible': { overflow: 'visible' },
    'overflow-scroll': { overflow: 'scroll' },
    'overflow-scroll-x': { 'overflow-x': 'auto', '-ms-overflow-style': '-ms-autohiding-scrollbar' },
    'overflow-scroll-y': { 'overflow-y': 'auto', '-ms-overflow-style': '-ms-autohiding-scrollbar' },
  })
}
