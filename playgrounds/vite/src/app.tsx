import { Analytics } from '@vercel/analytics/react'

export function App() {
  return (
    <div className="m-3 p-3 border">
      <h1 className="text-blue-500">Hello World</h1>
      <Analytics />
    </div>
  )
}
