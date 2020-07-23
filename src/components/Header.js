import { HeaderInner } from '@/components/HeaderInner'

export function Header({ navIsOpen, onNavToggle }) {
  return (
    <div>
      <div id="header">
        <div className="flex bg-white border-b border-gray-200 fixed top-0 inset-x-0 z-100 h-16 items-center">
          <div className="w-full max-w-screen-xl relative mx-auto px-6">
            <HeaderInner navIsOpen={navIsOpen} onNavToggle={onNavToggle} />
          </div>
        </div>
      </div>
    </div>
  )
}
