import '../css/main.css'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import Router from 'next/router'

export default function App({ Component, pageProps }) {
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

  return (
    <>
      <Header navIsOpen={navIsOpen} onNavToggle={(isOpen) => setNavIsOpen(isOpen)} />
      <DocumentationLayout navIsOpen={navIsOpen}>
        <Component {...pageProps} />
      </DocumentationLayout>
    </>
  )
}
