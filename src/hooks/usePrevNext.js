import { useContext } from 'react'
import { SidebarContext } from '@/layouts/SidebarLayout'
import { useRouter } from 'next/router'

export function usePrevNext() {
  let router = useRouter()
  let {
    pages: { flat: pages },
  } = useContext(SidebarContext)
  let pageIndex = pages.findIndex((page) => page.slug === router.pathname.split('/').pop())
  return {
    prev: pageIndex > -1 ? pages[pageIndex - 1] : undefined,
    next: pageIndex > -1 ? pages[pageIndex + 1] : undefined,
  }
}
