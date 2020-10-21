import { motion, AnimateSharedLayout } from 'framer-motion'

export function Tabs({
  tabs,
  selected = Array.isArray(tabs) ? tabs[0] : Object.keys(tabs)[0],
  onChange = () => {},
  className = '',
}) {
  return (
    <AnimateSharedLayout>
      <ul className={`flex space-x-2 sm:space-x-6 ${className}`}>
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
        className={`relative z-10 px-4 py-1 leading-6 sm:text-xl sm:leading-7 font-semibold focus:outline-none transition-colors duration-300 ${
          isSelected ? 'text-black' : 'text-gray-400'
        }`}
      >
        {tab}
      </button>
    </li>
  )
}
