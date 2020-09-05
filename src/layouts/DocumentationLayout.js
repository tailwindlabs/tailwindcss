import { SidebarLayout } from '@/layouts/SidebarLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import twitterSquare from '@/img/twitter-square.png'
import { Title } from '@/components/Title'
import { createPageList } from '@/utils/createPageList'

const pages = createPageList(
  require.context(`../pages/docs/?meta=title,shortTitle,published`, false, /\.mdx$/),
  'docs'
)

const nav = {
  'Getting started': [
    pages['installation'],
    pages['release-notes'],
    pages['upcoming-changes'],
    pages['upgrading-to-v1'],
    pages['using-with-preprocessors'],
    pages['controlling-file-size'],
    pages['browser-support'],
    pages['intellisense'],
  ],
  'Core Concepts': [
    pages['utility-first'],
    pages['responsive-design'],
    pages['pseudo-class-variants'],
    pages['adding-base-styles'],
    pages['extracting-components'],
    pages['adding-new-utilities'],
    pages['functions-and-directives'],
  ],
  Customization: [
    pages['configuration'],
    pages['theme'],
    pages['breakpoints'],
    pages['customizing-colors'],
    pages['customizing-spacing'],
    pages['configuring-variants'],
    pages['plugins'],
  ],
  'Base Styles': [pages['preflight']],
  Layout: [
    pages['container'],
    pages['box-sizing'],
    pages['display'],
    pages['float'],
    pages['clear'],
    pages['object-fit'],
    pages['object-position'],
    pages['overflow'],
    pages['overscroll-behavior'],
    pages['position'],
    pages['top-right-bottom-left'],
    pages['visibility'],
    pages['z-index'],
  ],
  Flexbox: [
    pages['flex-direction'],
    pages['flex-wrap'],
    pages['align-items'],
    pages['align-content'],
    pages['align-self'],
    pages['justify-content'],
    pages['flex'],
    pages['flex-grow'],
    pages['flex-shrink'],
    pages['order'],
  ],
  Grid: [
    pages['grid-template-columns'],
    pages['grid-column'],
    pages['grid-template-rows'],
    pages['grid-row'],
    pages['gap'],
    pages['grid-auto-flow'],
    pages['justify-items'],
    pages['justify-self'],
    pages['place-content'],
    pages['place-items'],
    pages['place-self'],
  ],
  Spacing: [pages['padding'], pages['margin'], pages['space']],
  Sizing: [
    pages['width'],
    pages['min-width'],
    pages['max-width'],
    pages['height'],
    pages['min-height'],
    pages['max-height'],
  ],
  Typography: [
    pages['font-family'],
    pages['font-size'],
    pages['font-smoothing'],
    pages['font-style'],
    pages['font-weight'],
    pages['font-variant-numeric'],
    pages['letter-spacing'],
    pages['line-height'],
    pages['list-style-type'],
    pages['list-style-position'],
    pages['placeholder-color'],
    pages['placeholder-opacity'],
    pages['text-align'],
    pages['text-color'],
    pages['text-opacity'],
    pages['text-decoration'],
    pages['text-transform'],
    pages['vertical-align'],
    pages['whitespace'],
    pages['word-break'],
  ],
  Backgrounds: [
    pages['background-attachment'],
    pages['background-clip'],
    pages['background-color'],
    pages['background-opacity'],
    pages['background-position'],
    pages['background-repeat'],
    pages['background-size'],
    pages['background-image'],
    pages['gradient-color-stops'],
  ],
  Borders: [
    pages['border-radius'],
    pages['border-width'],
    pages['border-color'],
    pages['border-opacity'],
    pages['border-style'],
    pages['divide-width'],
    pages['divide-color'],
    pages['divide-opacity'],
    pages['divide-style'],
  ],
  Tables: [pages['border-collapse'], pages['table-layout']],
  Effects: [pages['box-shadow'], pages['opacity']],
  'Transitions and Animation': [
    pages['transition-property'],
    pages['transition-duration'],
    pages['transition-timing-function'],
    pages['transition-delay'],
    pages['animation'],
  ],
  Transforms: [
    pages['scale'],
    pages['rotate'],
    pages['translate'],
    pages['skew'],
    pages['transform-origin'],
  ],
  Interactivity: [
    pages['appearance'],
    pages['cursor'],
    pages['outline'],
    pages['pointer-events'],
    pages['resize'],
    pages['user-select'],
  ],
  SVG: [pages['fill'], pages['stroke'], pages['stroke-width']],
  Accessibility: [pages['screen-readers']],
  'Official Plugins': [pages['typography-plugin']],
}

export function DocumentationLayout(props) {
  const router = useRouter()

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
          content={`https://tailwindcss.com${twitterSquare}`}
        />
      </Head>
      <SidebarLayout nav={nav} {...props} />
    </>
  )
}
