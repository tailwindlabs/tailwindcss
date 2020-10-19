import tokenize from '../macros/tokenize.macro'
import { Code } from './Code'

const { tokens: defaultTokens } = tokenize.html(`<div class="flex pa-2 bg-white rounded-lg shadow">
  <div class="w-32 rounded-md overflow-hidden">
    <img src="avatar.jpg" class="h-full object-fit">
  </div>
  <div class="flex flex-col">
    <p class="font-bold text-lg">"If I had to recommend a way of
      getting into programming today, it would be HTML + CSS
      with @tailwindcss."
    </p>
    <div class="flex space-between">
      <div>
        <h2 class="font-semibold">Guillermo Rauch</h2>
        <small class="text-sm text-gray-500">CEO Vercel</small>
      </div>
      <a href="https://twitter.com/rauchg" class="text-blue-500
        rounded-md p-1">View Tweet</a>
    </div>
  </div>
</div>`)

export function CodeWindow({ children, className = '', height = 576 }) {
  return (
    <div
      className={`relative overflow-hidden md:rounded-xl shadow-2xl flex ${className}`}
      style={{ height }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-75" />
      <div className="relative w-full flex flex-col">
        <div className="flex-none h-11 flex items-center px-4">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 border-2 rounded-full border-red-500" />
            <div className="w-3 h-3 border-2 rounded-full border-amber-400" />
            <div className="w-3 h-3 border-2 rounded-full border-green-400" />
          </div>
        </div>
        <div className="border-t border-white border-opacity-10 min-h-0 flex-auto flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

CodeWindow.Code = ({ tokens = defaultTokens, ...props }) => (
  <pre className="w-full relative overflow-auto flex-auto flex flex-col">
    <code
      className="flex-auto relative block text-sm text-white pt-4 pb-4 pr-4"
      style={{ lineHeight: 18 / 14, paddingLeft: '4.125rem' }}
    >
      <Code tokens={tokens} {...props} />
      <div
        className="absolute top-0 bottom-0 left-0 bg-black bg-opacity-25"
        style={{ width: 50 }}
      />
    </code>
  </pre>
)
