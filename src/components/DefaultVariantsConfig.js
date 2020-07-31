import { defaultVariantsConfig } from '@/utils/defaultVariantsConfig'

export function DefaultVariantsConfig() {
  return (
    <pre className="language-js">
      <code className="language-js" dangerouslySetInnerHTML={{ __html: defaultVariantsConfig }} />
    </pre>
  )
}
