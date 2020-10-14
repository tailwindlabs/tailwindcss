import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/customization.svg'

export function Customization() {
  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.pink} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-rose-400 mb-3">
          Customization
        </Caption>
        <BigText className="mb-8">Extend it, tweak it, change it.</BigText>
        <Paragraph as="div" className="mb-6">
          <p>
            Tailwind includes an expertly crafted set of defaults out-of-the-box, but literally
            everything can be customized — from the color palette to the spacing scale to the box
            shadows to the mouse cursor.
          </p>
          <p>
            Use the tailwind.config.js file to craft your own design system, then let Tailwind
            transform it into your own custom CSS framework.
          </p>
        </Paragraph>
        <Link href="#" className="text-rose-400">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="pink"
        rotate={-1}
        header={
          <div className="-ml-4">
            <Tabs tabs={['Simple', 'Playful', 'Elegant', 'Brutalist']} />
          </div>
        }
        left={
          <div
            className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
            style={{ height: 374 }}
          />
        }
        right={<CodeWindow className="bg-rose-500" />}
      />
    </section>
  )
}
