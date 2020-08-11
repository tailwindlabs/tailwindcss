import { SidebarLayout } from '@/layouts/SidebarLayout'
import twitterCardScreencasts from '@/img/twitter-card-screencasts.png'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Title } from '@/components/Title'
import { createPageList } from '@/utils/createPageList'

const pages = createPageList(
  require.context('../pages/course/?meta=title,shortTitle,published', true, /\.mdx$/),
  'course'
)

const nav = {
  'Getting Up and Running': [
    pages['setting-up-tailwind-and-postcss'],
    pages['the-utility-first-workflow'],
    pages['responsive-design'],
    pages['hover-focus-and-active-styles'],
    pages['composing-utilities-with-apply'],
    pages['extracting-reusable-components'],
    pages['customizing-your-design-system'],
    pages['optimizing-for-production'],
  ],
  'Designing an Image Card': [
    pages['structuring-a-basic-card'],
    pages['making-text-content-feel-designed'],
    pages['working-with-svg-icons'],
    pages['designing-a-badge'],
    pages['cropping-and-positioning-images'],
    pages['locking-images-to-a-fixed-aspect-ratio'],
    pages['creating-depth-with-shadows-and-layers'],
  ],
  'Building a Responsive Navbar': [
    pages['building-a-navbar-layout-with-flexbox'],
    pages['toggling-the-navbar-links-on-mobile'],
    pages['making-the-navbar-responsive'],
  ],
  'Building a Dropdown Menu': [
    pages['styling-the-basic-dropdown-elements'],
    pages['positioning-the-dropdown-area'],
    pages['making-the-dropdown-interactive'],
    pages['adapting-the-dropdown-for-mobile'],
  ],
  'Styling Form Elements': [
    {
      title: 'Styling basic text inputs',
      published: false,
    },
    { title: 'Using positioning to build a search input group', published: false },
    { title: 'Using focus-within to change the search icon color', published: false },
    { title: 'Styling custom select menus', published: false },
    { title: 'Styling custom checkboxes and radio buttons', published: false },
    { title: 'Using the custom forms plugin', published: false },
  ],
  'Working with CMS Content': [
    { title: "Targeting elements when you can't add classes", published: false },
    { title: 'Styling headings', published: false },
    { title: 'Styling paragraph text', published: false },
    { title: 'Styling lists', published: false },
  ],
  'Layout Patterns': [
    { title: 'Building a responsive sidebar layout with flexbox', published: false },
    { title: 'Building responsive grids', published: false },
    { title: 'Building a sticky footer', published: false },
    { title: 'Building a side-scrolling card layout', published: false },
  ],
  'Extending Tailwind': [
    { title: 'Using custom fonts', published: false },
    { title: 'Using a custom color palette', published: false },
    { title: 'Adding custom utilities', published: false },
    { title: 'Working with third-party plugins', published: false },
    { title: 'Writing your own simple plugin', published: false },
  ],
}

export function CourseLayout(props) {
  const router = useRouter()

  return (
    <>
      <Title suffix={router.pathname === '/course' ? undefined : 'Designing with Tailwind CSS'}>
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
      <SidebarLayout nav={nav} fallbackHref="/course/coming-soon" {...props} />
    </>
  )
}
