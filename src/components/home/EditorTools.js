import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'

export function EditorTools() {
  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.lightblue} mb-8`} />
        <Caption as="h2" className="text-lightBlue-600 mb-3">
          Editor tools
        </Caption>
        <BigText className="mb-8">World-class IDE integration.</BigText>
        <Paragraph as="div" className="mb-6">
          <p>
            Worried about remembering all of these class names? The Tailwind CSS IntelliSense
            extension for VS Code has you covered.
          </p>
          <p>
            Get intelligent autocomplete suggestions, linting, class definitions and more, all
            within your editor and with no configuration required.
          </p>
        </Paragraph>
        <Link href="#" className="text-lightBlue-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="lightblue"
        rotate={2}
        left={
          <CodeWindow className="bg-lightBlue-500" height={625}>
            <CodeWindow.Code />
          </CodeWindow>
        }
      />
    </section>
  )
}
