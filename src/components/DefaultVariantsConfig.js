import { defaultVariantsConfig } from '@/utils/defaultVariantsConfig'

export function DefaultVariantsConfig() {
  return (
    <div className="prose">
      <div className="bg-gray-800 my-6 overflow-hidden rounded-xl">
        <pre className="language-js">
          <code
            className="language-js"
            dangerouslySetInnerHTML={{ __html: defaultVariantsConfig }}
          />
        </pre>
      </div>
    </div>
  )
}
