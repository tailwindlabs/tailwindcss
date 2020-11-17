import clsx from 'clsx'
import { motion, AnimateSharedLayout } from 'framer-motion'

export function Tabs({
  tabs,
  selected = Array.isArray(tabs) ? tabs[0] : Object.keys(tabs)[0],
  onChange = () => {},
  className = '',
  grid = false,
  spacing = 'normal',
}) {
  return (
    <AnimateSharedLayout>
      <ul
        className={clsx('whitespace-nowrap', className, {
          flex: !grid,
          'space-x-2 sm:space-x-6': spacing === 'normal' && !grid,
          'space-x-2 sm:space-x-12': spacing === 'loose' && !grid,
          grid: grid,
          'gap-2 sm:gap-6': spacing === 'normal' && grid,
          'gap-2 sm:gap-12': spacing === 'loose' && grid,
        })}
        style={
          grid
            ? {
                gridTemplateColumns: `repeat(${
                  Array.isArray(tabs) ? tabs.length : Object.keys(tabs).length
                }, minmax(0, 1fr))`,
              }
            : undefined
        }
      >
        {(Array.isArray(tabs) ? tabs : Object.keys(tabs)).map((tab) => (
          <Item
            key={tab}
            tab={Array.isArray(tabs) ? tab : tabs[tab]}
            isSelected={selected === tab}
            onClick={() => onChange(tab)}
          />
        ))}
      </ul>
    </AnimateSharedLayout>
  )
}

function Item({ tab, isSelected, onClick }) {
  return (
    <li className="relative">
      {isSelected && (
        <motion.div
          layoutId="highlight"
          style={{ borderRadius: typeof tab === 'string' ? 18 : 12 }}
          className="absolute inset-0 bg-gray-100"
        />
      )}
      <button
        type="button"
        onClick={onClick}
        className={clsx(
          'block w-full relative z-10 px-4 py-1 leading-6 sm:text-xl font-semibold focus:outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-white focus-visible:ring-gray-300 hover:text-gray-900',
          typeof tab === 'string' ? 'rounded-full' : 'rounded-xl',
          { 'text-gray-900': isSelected, 'text-gray-400': !isSelected }
        )}
      >
        {tab}
      </button>
    </li>
  )
}
