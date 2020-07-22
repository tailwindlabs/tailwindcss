import '../css/main.css'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { DocumentationLayout } from '@/layouts/DocumentationLayout'

export default function App({ Component, pageProps }) {
  let [navIsOpen, setNavIsOpen] = useState(false)

  return (
    <>
      <Header navIsOpen={navIsOpen} onNavToggle={(isOpen) => setNavIsOpen(isOpen)} />
      <DocumentationLayout navIsOpen={navIsOpen}>
        <Component {...pageProps} />
      </DocumentationLayout>
    </>
  )
}
