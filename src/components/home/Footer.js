import Link from 'next/link'
import { documentationNav } from '@/navs/documentation'
import { Logo } from '@/components/Logo'

const footerNav = [
  {
    'Getting Started': documentationNav['Getting Started'],
    'Core Concepts': documentationNav['Core Concepts'],
  },
  {
    Customization: documentationNav['Customization'],
    Community: [
      { title: 'GitHub', href: 'https://github.com/tailwindlabs/tailwindcss' },
      { title: 'Discord', href: '/discord' },
      { title: 'Twitter', href: 'https://twitter.com/tailwindcss' },
      { title: 'YouTube', href: 'https://www.youtube.com/tailwindlabs' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="pb-16 text-sm leading-6">
      <div className="max-w-7xl mx-auto divide-y divide-gray-200 px-4 sm:px-6 md:px-8">
        <div className="flex">
          {footerNav.map((sections) => (
            <div
              key={Object.keys(sections).join(',')}
              className="flex-none w-1/2 space-y-10 sm:space-y-8 lg:flex lg:space-y-0"
            >
              {Object.entries(sections).map(([title, items]) => (
                <div key={title} className="lg:flex-none lg:w-1/2">
                  <h2 className="font-semibold text-gray-900">{title}</h2>
                  <ul className="mt-3 space-y-2">
                    {items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href}>
                          <a className="hover:text-gray-900">{item.title}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-16 pt-10">
          <Logo className="w-auto h-6" />
        </div>
      </div>
    </footer>
  )
}
