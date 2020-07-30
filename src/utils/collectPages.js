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
    const item = {
      title,
      slug: match.groups.slug,
      published: meta.published !== false,
    }
    if (pages.categorised[category]) {
      pages.categorised[category].push(item)
    } else {
      pages.categorised[category] = [item]
    }
    pages.flat.push({
      ...item,
      category,
    })
  })

  return pages
}
