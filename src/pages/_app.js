import '../css/main.css'
import { useState, useEffect, Fragment } from 'react'
import { Header } from '@/components/Header'
import { HeaderHome } from '@/components/HeaderHome'
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

  const Layout = Component.Layout || Fragment
  const layoutProps = Component.Layout ? { navIsOpen } : {}

  return (
    <>
      <PageHeader navIsOpen={navIsOpen} onNavToggle={(isOpen) => setNavIsOpen(isOpen)} />
      <Layout {...layoutProps}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
