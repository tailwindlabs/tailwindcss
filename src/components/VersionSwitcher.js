import { tailwindVersion } from '@/utils/tailwindVersion'

export function VersionSwitcher() {
  return (
    <select
      className="appearance-none block bg-transparent pl-2 pr-8 py-1 text-gray-500 font-medium text-base focus:outline-none focus:text-gray-800"
      onChange={(e) => {
        if (e.target.value === 'v0') {
          window.location = 'https://v0.tailwindcss.com'
        }
      }}
    >
      <option value="v1">v{tailwindVersion}</option>
      <option value="v0">v0.7.4</option>
    </select>
  )
}
