import { useEffect } from 'react'
import { code as html, lines } from '../../samples/mobile-first.html?highlight'

let images = {
  '/kevin-francis.jpg': require('@/img/kevin-francis.jpg').default,
  '/beach-house.jpg': require('@/img/beach-house.jpg').default,
  '/beach-house-interior-1.jpg': require('@/img/beach-house-interior-1.jpg').default,
  '/beach-house-interior-2.jpg': require('@/img/beach-house-interior-2.jpg').default,
}

export default function MobileFirstDemo() {
  useEffect(() => {
    let sm = window.matchMedia('(min-width: 640px)')
    let md = window.matchMedia('(min-width: 768px)')
    let lg = window.matchMedia('(min-width: 1024px)')

    function onChange() {
      let breakpoint
      if (sm.matches) breakpoint = 'sm'
      if (md.matches) breakpoint = 'md'
      if (lg.matches) breakpoint = 'lg'
      window.parent.postMessage(breakpoint, '*')
    }

    sm.addEventListener('change', onChange)
    md.addEventListener('change', onChange)
    lg.addEventListener('change', onChange)

    return () => {
      sm.removeEventListener('change', onChange)
      md.removeEventListener('change', onChange)
      lg.removeEventListener('change', onChange)
    }
  }, [])

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html.replace(/src="([^"]+)"/g, (_, src) => `src="${images[src]}"`),
      }}
    />
  )
}

export { lines }
