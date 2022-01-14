import clsx from 'clsx'
import { useEffect, useState } from 'react'
import redent from 'redent'
import Alert from '@reach/alert'
import { SnippetGroup } from '@/components/SnippetGroup'
import { Editor } from '@/components/Editor'
import { Transition } from '@headlessui/react'

export function Steps({ steps, code, level = 2 }) {
  let StepHeading = `h${level}`

  return (
    <>
      <div className="hidden sm:block absolute top-0 left-[15%] pt-[40%] 2xl:left-[40%] 2xl:pt-[8%] dark:hidden">
        <img
          src={require('@/img/beams/installation.jpg').default}
          alt=""
          className="w-[52.6875rem] max-w-none"
        />
      </div>
      <ol className="relative space-y-2 mb-16" style={{ counterReset: 'step' }}>
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={clsx(
              'relative pl-10 xl:grid grid-cols-5 gap-16 before:content-[counter(step)] before:absolute before:left-0 before:flex before:items-center before:justify-center before:w-[calc(1.375rem+1px)] before:h-[calc(1.375rem+1px)] before:text-[0.625rem] before:font-bold before:text-slate-700 before:rounded-md before:shadow-sm before:ring-1 before:ring-slate-900/5 dark:before:bg-slate-700 dark:before:text-slate-200 dark:before:ring-0 dark:before:shadow-none dark:before:highlight-white/5',
              index !== steps.length - 1 &&
                'pb-8 after:absolute after:top-[calc(1.875rem+1px)] after:bottom-0 after:left-[0.6875rem] after:w-px after:bg-slate-200 dark:after:bg-slate-200/5'
            )}
            style={{ counterIncrement: 'step' }}
          >
            <div className="mb-6 col-span-2 xl:mb-0">
              <StepHeading className="text-sm leading-6 text-slate-900 font-semibold mb-2 dark:text-slate-200">
                {step.title}
              </StepHeading>
              <div className="prose prose-slate prose-sm dark:prose-dark">
                <step.body />
              </div>
            </div>
            {step.code && <Snippet code={step.code} highlightedCode={code[index]} />}
          </li>
        ))}
      </ol>
    </>
  )
}

function CopyButton({ code }) {
  let [{ state, i }, setState] = useState({ state: 'idle', i: 0 })

  useEffect(() => {
    if (state === 'copied') {
      let handle = window.setTimeout(() => {
        setState({ state: 'idle', i: i + 1 })
      }, 1500)
      return () => {
        window.clearTimeout(handle)
      }
    }
  }, [state, i])

  return (
    <div className="relative flex -mr-2">
      <button
        type="button"
        className={clsx({
          'text-slate-500 hover:text-slate-400': state === 'idle',
          'text-sky-400': state === 'copied',
        })}
        onClick={() => {
          navigator.clipboard.writeText(redent(code.replace(/^[+->]/gm, ' '))).then(() => {
            setState({ state: 'copied', i: i + 1 })
          })
        }}
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="w-8 h-8"
        >
          <path d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19" />
          <path d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5" />
        </svg>
      </button>
      <Transition
        className="absolute bottom-full left-1/2 mb-3.5 pb-1 -translate-x-1/2"
        show={state === 'copied'}
        enter="transform ease-out duration-200 transition origin-bottom"
        enterFrom="scale-95 translate-y-0.5 opacity-0"
        enterTo="scale-100 translate-y-0 opacity-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Alert className="relative bg-sky-500 text-white font-mono text-[0.625rem] leading-6 font-medium px-1.5 rounded-lg">
          Copied
          <svg
            aria-hidden="true"
            width="16"
            height="6"
            viewBox="0 0 16 6"
            className="text-sky-500 absolute top-full left-1/2 -mt-px -ml-2"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15 0H1V1.00366V1.00366V1.00371H1.01672C2.72058 1.0147 4.24225 2.74704 5.42685 4.72928C6.42941 6.40691 9.57154 6.4069 10.5741 4.72926C11.7587 2.74703 13.2803 1.0147 14.9841 1.00371H15V0Z"
              fill="currentColor"
            />
          </svg>
        </Alert>
      </Transition>
    </div>
  )
}

function Code({ code, lang, pad }) {
  return (
    <pre
      className={clsx(
        'text-sm leading-6 text-slate-50 flex ligatures-none',
        pad && 'overflow-auto'
      )}
    >
      <code
        className={clsx('flex-none min-w-full', pad && 'p-5')}
        dangerouslySetInnerHTML={{
          __html: code
            .split('\n')
            .map((line) => {
              if (lang === 'terminal') {
                line = `<span class="flex"><svg viewBox="0 -9 3 24" aria-hidden="true" class="flex-none overflow-visible text-pink-400 w-auto h-6 mr-3"><path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="flex-auto">${line}</span></span>`
              }
              return line
            })
            .join(lang === 'terminal' ? '' : '\n'),
        }}
      />
    </pre>
  )
}

function Snippet({ code, highlightedCode }) {
  if (Array.isArray(code)) {
    return (
      <div className="col-span-3">
        <SnippetGroup
          actions={({ selectedIndex }) => <CopyButton code={code[selectedIndex].code} />}
        >
          {code.map(({ name, lang }, index) => (
            <Editor key={name} filename={name}>
              <Code code={highlightedCode[index]} lang={lang} />
            </Editor>
          ))}
        </SnippetGroup>
      </div>
    )
  }

  return (
    <div className="relative z-10 -ml-10 col-span-3 bg-slate-800 rounded-xl shadow-lg xl:ml-0 dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/10">
      <TabBar name={code.name}>
        <CopyButton code={code.code} />
      </TabBar>
      <div className="relative">
        <Code code={highlightedCode} lang={code.lang} pad={true} />
      </div>
    </div>
  )
}

function TabBar({ name, children }) {
  return (
    <div className="relative flex text-slate-400 text-xs leading-6">
      <div className="mt-2 flex-none text-sky-300 border-t border-b border-t-transparent border-b-sky-300 px-4 py-1 flex items-center">
        {name}
      </div>
      <div className="flex-auto flex pt-2 rounded-tr-xl overflow-hidden">
        <div className="flex-auto -mr-px bg-slate-700/50 border border-slate-500/30 rounded-tl" />
      </div>
      {children && (
        <div className="absolute top-2 right-0 h-8 flex items-center pr-4">{children}</div>
      )}
    </div>
  )
}
