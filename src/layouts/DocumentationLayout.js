import { importAll } from '@/utils/importAll'
import { collectPages } from '@/utils/collectPages'
import { SidebarLayout } from '@/layouts/SidebarLayout'

const pages = collectPages(importAll(require.context('../pages/docs/?meta=title', true, /\.mdx$/)))

export function DocumentationLayout(props) {
  return <SidebarLayout base="docs" pages={pages} {...props} />
}
