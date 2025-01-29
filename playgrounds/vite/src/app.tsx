import { twMerge } from 'tailwind-merge'

export function App() {
  return (
    <div className="m-3 p-3 border">
      <h1 className={twMerge('text-red-500', 'text-blue-500')}>Hello World</h1>
      <div className="-inset-x-full -inset-y-full -space-x-full -space-y-full -inset-full"></div>
    </div>
  )
}
