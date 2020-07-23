import { importAll } from '@/utils/importAll'
import { kebabToTitleCase } from '@/utils/kebabToTitleCase'
import { removeOrderPrefix } from '@/utils/removeOrderPrefix'
import { SidebarLayout } from '@/layouts/SidebarLayout'

const pages = {}
importAll(require.context('../pages/docs/?meta=title', true, /\.mdx$/)).forEach(
  ({ fileName, module: { meta } }) => {
    const { groups } = fileName.match(/^\.\/(?<category>[^/]+)\/(?<slug>.*?)\.mdx$/)
    const category = groups.category
    const slug = removeOrderPrefix(groups.slug)
    const title = meta.title || kebabToTitleCase(slug)
    if (pages[category]) {
      pages[category].push({ title, slug })
    } else {
      pages[category] = [{ title, slug }]
    }
  }
)

export function DocumentationLayout(props) {
  return <SidebarLayout pages={pages} {...props} />
}
