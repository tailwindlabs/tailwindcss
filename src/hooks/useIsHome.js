import { useRouter } from 'next/router'

export function useIsHome() {
  return useRouter().pathname === '/'
}
