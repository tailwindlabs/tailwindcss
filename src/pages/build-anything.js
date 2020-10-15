import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/build-anything.svg'
import { HtmlZenGarden } from '@/components/HtmlZenGarden'

export default function BuildAnything() {
  return (
    <section className="max-w-screen-xl mx-auto py-44">
      <GradientLockup
        color="orange"
        rotate={-2}
        header={
          <div className="-ml-4">
            <Tabs tabs={['Simple', 'Playful', 'Elegant', 'Brutalist']} />
          </div>
        }
        left={<HtmlZenGarden />}
        right={<CodeWindow className="bg-pink-600" />}
      />
    </section>
  )
}
