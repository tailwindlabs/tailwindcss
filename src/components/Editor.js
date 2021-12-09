import { TabBar } from '@/components/TabBar'

export function Editor({ filename, children }) {
  return (
    <div className="mt-5 mb-8 first:mt-0 last:mb-0 pt-2 bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <TabBar primary={{ name: filename }} showTabMarkers={false} />
      <div className="children:my-0">{children}</div>
    </div>
  )
}
