import '../css/main.css'
import { Header } from '@/components/Header'
import { DocumentationLayout } from '@/layouts/DocumentationLayout'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <DocumentationLayout>
        <Component {...pageProps} />
      </DocumentationLayout>
    </>
  )
}
