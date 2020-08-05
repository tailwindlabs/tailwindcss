import { SidebarLayout } from '@/layouts/SidebarLayout'
import twitterCardScreencasts from '@/img/twitter-card-screencasts.png'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Title } from '@/components/Title'
import { createPageList } from '@/utils/createPageList'

const pages = createPageList(
  require.context('../pages/screencasts/?meta=title,shortTitle,published', true, /\.mdx$/),
  'screencasts'
)

const nav = {
  'Getting Up and Running': [
    pages['setting-up-tailwind-and-postcss'],
    pages['the-utility-first-workflow'],
  ],
}

export function ScreencastsLayout(props) {
  const router = useRouter()

  return (
    <>
      <Title
        suffix={router.pathname === '/screencasts' ? undefined : 'Designing with Tailwind CSS'}
      >
        {props.layoutProps.meta.metaTitle || props.layoutProps.meta.title}
      </Title>
      <Head>
        <meta
          key="twitter:image"
          name="twitter:image"
          content={`https://tailwindcss.com${twitterCardScreencasts}`}
        />
        <meta
          key="og:image"
          property="og:image"
          content={`https://tailwindcss.com${twitterCardScreencasts}`}
        />
      </Head>
      <SidebarLayout nav={nav} fallbackHref="/screencasts/coming-soon" {...props} />
    </>
  )
}
