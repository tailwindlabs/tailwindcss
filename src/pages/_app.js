import '../css/main.css'
import { useState, useEffect, Fragment } from 'react'
import { Header } from '@/components/Header'
import { TuiBanner } from '@/components/TuiBanner'
import Router from 'next/router'
import ProgressBar from '@badrap/bar-of-progress'

const progress = new ProgressBar({
  size: 2,
  color: '#4fd1c5',
  className: 'bar-of-progress',
  delay: 100,
})

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

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

  const Layout = Component.layoutProps?.Layout || Fragment
  const layoutProps = Component.layoutProps?.Layout ? { navIsOpen } : {}

  return (
    <>
      <Header navIsOpen={navIsOpen} onNavToggle={(isOpen) => setNavIsOpen(isOpen)} />
      <Layout {...layoutProps}>
        <Component {...pageProps} />
      </Layout>
      <TuiBanner />
    </>
  )
}
