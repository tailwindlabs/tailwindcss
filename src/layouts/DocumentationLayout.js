import { SidebarLayout } from '@/layouts/SidebarLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import socialSquare from '@/img/social-square.jpg'
import { Title } from '@/components/Title'
import { documentationNav } from '@/navs/documentation'

export function DocumentationLayout(props) {
  let router = useRouter()

  return (
    <>
      <Title suffix={router.pathname === '/' ? undefined : 'Tailwind CSS'}>
        {props.layoutProps.meta.metaTitle || props.layoutProps.meta.title}
      </Title>
      <Head>
        <meta key="twitter:card" name="twitter:card" content="summary" />
        <meta
          key="twitter:image"
          name="twitter:image"
          content={`https://tailwindcss.com${socialSquare}`}
        />
      </Head>
      <SidebarLayout nav={documentationNav} {...props} />
    </>
  )
}

DocumentationLayout.nav = documentationNav
