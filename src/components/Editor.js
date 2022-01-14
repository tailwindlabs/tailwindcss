import { TabBar } from '@/components/TabBar'

export function Editor({ filename, children }) {
  return (
    <div className="mt-5 mb-8 first:mt-0 last:mb-0 pt-2 bg-slate-800 rounded-xl shadow-lg overflow-hidden dark:ring-1 dark:ring-white/10 dark:ring-inset">
      <TabBar primary={{ name: filename }} showTabMarkers={false} />
      <div className="children:my-0 children:!shadow-none children:bg-transparent">{children}</div>
    </div>
  )
}
