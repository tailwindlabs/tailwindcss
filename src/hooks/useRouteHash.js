import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export function useRouteHash() {
  let router = useRouter()
  let [hash, setHash] = useState(0)

  useEffect(() => {
    function onHashChangeComplete() {
      if (hash !== window.location.hash) {
        setHash(window.location.hash)
      }
    }

    router.events.on('hashChangeComplete', onHashChangeComplete)

    return () => {
      router.events.off('hashChangeComplete', onHashChangeComplete)
    }
  }, [router.events])

  return hash
}
