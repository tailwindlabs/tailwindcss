import { kebabToTitleCase } from '@/utils/kebabToTitleCase'
import { removeOrderPrefix } from '@/utils/removeOrderPrefix'

export function collectPages(imported) {
  const pages = {
    categorised: {},
    flat: [],
  }

  imported.forEach(({ fileName, module: { meta } }) => {
    const match = fileName.match(/^\.\/(?<category>[^/]+)\/(?<slug>.*?)\.mdx$/)
    if (match === null) return
    const category = match.groups.category
    const title = meta.title || kebabToTitleCase(removeOrderPrefix(match.groups.slug))
    if (pages.categorised[category]) {
      pages.categorised[category].push({ title, slug: match.groups.slug })
    } else {
      pages.categorised[category] = [{ title, slug: match.groups.slug }]
    }
    pages.flat.push({ title, slug: match.groups.slug, category })
  })

  return pages
}
