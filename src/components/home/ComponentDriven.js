import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'

export function ComponentDriven() {
  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.amber} mb-8`} />
        <Caption as="h2" className="text-amber-500 mb-3">
          Component-driven
        </Caption>
        <BigText className="mb-8">Worried about duplication? Don’t be.</BigText>
        <Paragraph className="mb-6">
          If you're repeating the same utilities over and over and over again, all you have to do is
          extract them into a component or template partial and boom — you've got a single source of
          truth so you can make changes in one place.
        </Paragraph>
        <Link href="#" className="text-amber-500">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="amber"
        rotate={-2}
        left={
          <div
            className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
            style={{ height: 380 }}
          />
        }
        right={<CodeWindow className="bg-orange-500" />}
      />
      <div className="px-8 mt-32 mb-8">
        <Paragraph className="mb-6">
          Not into component frameworks and like to keep it old school? Use Tailwind's @apply
          directive to extract repeated utility patterns into custom CSS classes just by copying and
          pasting the list of class names.
        </Paragraph>
        <Link href="#" className="text-orange-500">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="orange"
        rotate={1}
        left={
          <div
            className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
            style={{ height: 372 }}
          />
        }
        right={<CodeWindow className="bg-pink-600" />}
      />
    </section>
  )
}
