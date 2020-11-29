import { ReactComponent as AngularLogo } from '@/img/guides/angular.svg'
import { ReactComponent as CreateReactAppLogo } from '@/img/guides/create-react-app.svg'
import { ReactComponent as GatsbyLogo } from '@/img/guides/gatsby.svg'
import { ReactComponent as LaravelLogo } from '@/img/guides/laravel.svg'
import { ReactComponent as NextJsLogo } from '@/img/guides/nextjs.svg'
import { ReactComponent as NuxtJsLogo } from '@/img/guides/nuxtjs.svg'
import { ReactComponent as RailsLogo } from '@/img/guides/rails.svg'
import { ReactComponent as SvelteLogo } from '@/img/guides/svelte.svg'
import { ReactComponent as Vue3Logo } from '@/img/guides/vue-3.svg'
import Link from 'next/link'

const guides = [
  {
    name: 'Next.js',
    logo: NextJsLogo,
    link: '/docs/guides/nextjs',
  },
  {
    name: 'Vue 3 (Vite)',
    logo: Vue3Logo,
    link: '/docs/guides/vue-3-vite',
  },
  {
    name: 'Laravel',
    logo: LaravelLogo,
    link: '/docs/guides/laravel',
  },
  {
    name: 'Nuxt.js',
    logo: NuxtJsLogo,
    link: '/docs/guides/nuxtjs',
  },
  {
    name: 'Create React App',
    logo: CreateReactAppLogo,
    link: '/docs/guides/create-react-app',
  },
  {
    name: 'Gatsby',
    logo: GatsbyLogo,
    link: '/docs/guides/gatsby',
  },
]

export function IntegrationGuides() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
      {guides.map((guide) => {
        const Logo = guide.logo
        return (
          <Link href={guide.link} key={guide.name}>
            <a className="flex flex-col items-center py-4 shadow-sm ring-1 ring-black ring-opacity-5 rounded-xl">
              <Logo className="h-12 w-auto" />
              <div className="mt-3 text-sm text-gray-900 font-semibold sm:mt-2">{guide.name}</div>
            </a>
          </Link>
        )
      })}
    </div>
  )
}
