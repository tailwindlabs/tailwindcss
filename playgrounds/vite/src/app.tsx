import React from 'react'
import { Foo } from './foo'

export function App() {
  return (
    <div className="m-3 p-3 border">
      <button popovertarget="my-popover" class="trigger-btn">
        Open Popover
      </button>
      <div id="my-popover" popover="auto" className="open:bg-red-500">
        <p>I am a popover with more information.</p>
      </div>
    </div>
  )
}
