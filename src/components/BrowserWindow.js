export function BrowserWindow({ height = 385 }) {
  return (
    <div className="shadow-lg rounded-t-xl border border-black border-opacity-5">
      <div className="bg-white rounded-t-xl overflow-hidden">
        <div
          className="py-2 grid items-center px-4 bg-gradient-to-b from-gray-50 to-gray-100"
          style={{ gridTemplateColumns: '1fr minmax(min-content, 640px) 1fr' }}
        >
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
          <div className="border border-black border-opacity-5 rounded-md overflow-hidden shadow-sm">
            <div className="bg-gradient-to-b from-white to-gray-50 text-sm leading-5 py-1.5 text-center">
              workcation.com
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 overflow-auto" style={{ height }} />
      </div>
    </div>
  )
}
