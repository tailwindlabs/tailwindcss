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

    if (sm?.addEventListener) {
      sm.addEventListener('change', onChange)
      md.addEventListener('change', onChange)
      lg.addEventListener('change', onChange)
    } else {
      sm.addListener(onChange)
      md.addListener(onChange)
      lg.addListener(onChange)
    }

    let darkModeObserver = new MutationObserver(([mutation]) => {
      if (mutation.target.classList.contains('dark')) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    })
    darkModeObserver.observe(window.parent.document.documentElement, {
      attributeFilter: ['class'],
    })

    return () => {
      if (sm?.addEventListener) {
        sm.removeEventListener('change', onChange)
        md.removeEventListener('change', onChange)
        lg.removeEventListener('change', onChange)
      } else {
        sm.removeListener(onChange)
        md.removeListener(onChange)
        lg.removeListener(onChange)
      }

      darkModeObserver.disconnect()
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
