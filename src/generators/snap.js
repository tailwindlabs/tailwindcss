import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'snap-x': { 'scroll-snap-type': 'x mandatory' },
    'snap-y': { 'scroll-snap-type': 'y mandatory' },
    'snap-xy': { 'scroll-snap-type': 'both mandatory' },
    'snap-start': { 'scroll-snap-align': 'start' },
    'snap-end': { 'scroll-snap-align': 'end' },
    'snap-center': { 'scroll-snap-align': 'center' },
  })
}
