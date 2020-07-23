import '../css/main.css'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { HeaderHome } from '@/components/HeaderHome'
import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import Router from 'next/router'

export default function App({ Component, pageProps, router }) {
  let [navIsOpen, setNavIsOpen] = useState(false)

  useEffect(() => {
    if (!navIsOpen) return
    function handleRouteChange() {
      setNavIsOpen(false)
    }
    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [navIsOpen])

  const isHome = router.pathname === '/'
  const PageHeader = isHome ? HeaderHome : Header

  return (
    <>
      <PageHeader navIsOpen={navIsOpen} onNavToggle={(isOpen) => setNavIsOpen(isOpen)} />
      <DocumentationLayout navIsOpen={navIsOpen} variant={isHome ? 'home' : 'default'}>
        <Component {...pageProps} />
      </DocumentationLayout>
    </>
  )
}
