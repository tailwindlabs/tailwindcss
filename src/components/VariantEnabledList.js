import { defaultConfig } from '@/utils/defaultConfig'
import { ConfigSample } from '@/components/ConfigSample'

const variantListInverted = Object.entries(defaultConfig.variants).reduce(
  (reduced, [plugin, variants]) => {
    variants.forEach((variant) => {
      if (reduced[variant]) {
        reduced[variant].push(plugin)
      } else {
        reduced[variant] = [plugin]
      }
    })
    return reduced
  },
  {}
)

export function VariantEnabledList({ variant }) {
  if (!variantListInverted[variant]) {
    return (
      <p>
        <strong>
          By default, the <code>{variant}</code> variant is not enabled for any core plugins
        </strong>
        .
      </p>
    )
  }

  return (
    <>
      <p>
        By default, the <code>{variant}</code> variant is enabled for the following core plugins:
      </p>

      <ul>
        {variantListInverted[variant].map((plugin) => (
          <li key={plugin}>
            <code>{plugin}</code>
          </li>
        ))}
      </ul>
    </>
  )
}
