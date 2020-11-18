import Link from 'next/link'
import { documentationNav } from '@/navs/documentation'
import clsx from 'clsx'
import styles from './Footer.module.css'
import { Logo } from '@/components/Logo'

const footerNav = {
  'Getting started': {
    className: 'row-span-2',
    items: documentationNav['Getting started'],
  },
  'Core concepts': {
    className: 'row-span-2',
    items: documentationNav['Core Concepts'],
  },
  Customization: {
    className: 'row-span-2',
    items: documentationNav['Customization'],
  },
  Community: {
    items: [
      { title: 'GitHub', href: 'https://github.com/tailwindlabs/tailwindcss' },
      { title: 'Discord', href: '/discord' },
      { title: 'Twitter', href: 'https://twitter.com/tailwindcss' },
      { title: 'YouTube', href: 'https://www.youtube.com/tailwindlabs' },
    ],
  },
}

export function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-12 sm:pt-20 md:pt-24 xl:pt-32 sm:pb-20">
      <div className="max-w-screen-lg xl:max-w-screen-xl mx-auto divide-y divide-gray-200 px-4 sm:px-6 md:px-8">
        <ul
          className={`${styles.nav} text-sm font-medium pb-14 sm:pb-20 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10`}
        >
          {Object.keys(footerNav).map((section, i) => (
            <li key={section} className={clsx('space-y-5', footerNav[section].className)}>
              <h2 className="text-xs font-semibold tracking-wide text-gray-900 uppercase">
                {section}
              </h2>
              <ul className="space-y-4">
                {footerNav[section].items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a className="hover:text-gray-900 transition-colors duration-200">
                        {item.title}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="pt-10 sm:pt-12">
          <Logo width="208" height="26" />
        </div>
      </div>
    </footer>
  )
}
