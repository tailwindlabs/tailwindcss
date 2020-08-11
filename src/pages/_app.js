import '../css/main.css'
import 'focus-visible'
import { useState, useEffect, Fragment } from 'react'
import { Header } from '@/components/Header'
import { TuiBanner } from '@/components/TuiBanner'
import { Title } from '@/components/Title'
import Router from 'next/router'
import ProgressBar from '@badrap/bar-of-progress'
import Head from 'next/head'
import twitterLargeCard from '@/img/twitter-large-card.png'

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
  const layoutProps = Component.layoutProps?.Layout
    ? { layoutProps: Component.layoutProps, navIsOpen, setNavIsOpen }
    : {}
  const meta = Component.layoutProps?.meta || {}
  const description =
    meta.metaDescription || meta.description || 'Documentation for the Tailwind CSS framework.'

  return (
    <>
      <Title suffix="Tailwind CSS">{meta.metaTitle || meta.title}</Title>
      <Head>
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content="@tailwindcss" />
        <meta key="twitter:description" name="twitter:description" content={description} />
        <meta
          key="twitter:image"
          name="twitter:image"
          content={`https://tailwindcss.com${twitterLargeCard}`}
        />
        <meta key="twitter:creator" name="twitter:creator" content="@tailwindcss" />
        <meta
          key="og:url"
          property="og:url"
          content={`https://tailwindcss.com${router.pathname}`}
        />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content={description} />
        <meta
          key="og:image"
          property="og:image"
          content={`https://tailwindcss.com${twitterLargeCard}`}
        />
      </Head>
      <Header navIsOpen={navIsOpen} onNavToggle={(isOpen) => setNavIsOpen(isOpen)} />
      <Layout {...layoutProps}>
        <Component {...pageProps} />
      </Layout>
      <TuiBanner />
    </>
  )
}
