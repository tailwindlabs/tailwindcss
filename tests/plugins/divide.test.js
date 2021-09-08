import path from 'path'
import postcss from 'postcss'
import tailwind from '../../src'

function run(input, config, plugin = tailwind) {
  let { currentTestName } = expect.getState()

  return postcss(plugin(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

function syntax(templates) {
  return templates.join('')
}

let css = syntax
let html = syntax

it('should add the divide styles for divide-y and a default border color', () => {
  let config = {
    purge: {
      enabled: true,
      content: [{ raw: html`<div class="divide-y"></div>` }],
    },
    corePlugins: { preflight: false },
  }

  return run('@tailwind base; @tailwind utilities;', config).then((result) => {
    expect(result.css).toIncludeCss(css`
      *,
      ::before,
      ::after {
        --tw-border-opacity: 1;
        border-color: rgba(229, 231, 235, var(--tw-border-opacity));
      }
    `)

    expect(result.css).toIncludeCss(css`
      .divide-y > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-y-reverse: 0;
        border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
        border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
      }
    `)
  })
})

it('should add the divide styles for divide-x and a default border color', () => {
  let config = {
    purge: {
      enabled: true,
      content: [{ raw: html`<div class="divide-x"></div>` }],
    },
    corePlugins: { preflight: false },
  }

  return run('@tailwind base; @tailwind utilities;', config).then((result) => {
    expect(result.css).toIncludeCss(css`
      *,
      ::before,
      ::after {
        --tw-border-opacity: 1;
        border-color: rgba(229, 231, 235, var(--tw-border-opacity));
      }
    `)

    expect(result.css).toIncludeCss(css`
      .divide-x > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-x-reverse: 0;
        border-right-width: calc(1px * var(--tw-divide-x-reverse));
        border-left-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));
      }
    `)
  })
})

it('should add the divide styles for divide-y-reverse and a default border color', () => {
  let config = {
    purge: {
      enabled: true,
      content: [{ raw: html`<div class="divide-y-reverse"></div>` }],
    },
    corePlugins: { preflight: false },
  }

  return run('@tailwind base; @tailwind utilities;', config).then((result) => {
    expect(result.css).toIncludeCss(css`
      *,
      ::before,
      ::after {
        --tw-border-opacity: 1;
        border-color: rgba(229, 231, 235, var(--tw-border-opacity));
      }
    `)

    expect(result.css).toIncludeCss(css`
      .divide-y-reverse > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-y-reverse: 1;
      }
    `)
  })
})

it('should add the divide styles for divide-x-reverse and a default border color', () => {
  let config = {
    purge: {
      enabled: true,
      content: [{ raw: html`<div class="divide-x-reverse"></div>` }],
    },
    corePlugins: { preflight: false },
  }

  return run('@tailwind base; @tailwind utilities;', config).then((result) => {
    expect(result.css).toIncludeCss(css`
      *,
      ::before,
      ::after {
        --tw-border-opacity: 1;
        border-color: rgba(229, 231, 235, var(--tw-border-opacity));
      }
    `)

    expect(result.css).toIncludeCss(css`
      .divide-x-reverse > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-x-reverse: 1;
      }
    `)
  })
})

it('should only inject the base styles once if we use divide and border at the same time', () => {
  let config = {
    purge: {
      enabled: true,
      content: [{ raw: html`<div class="divide-y border-r"></div>` }],
    },

    corePlugins: { preflight: false },
  }

  return run('@tailwind base; @tailwind utilities;', config).then((result) => {
    expect(result.css).toIncludeCss(css`
      *,
      ::before,
      ::after {
        --tw-border-opacity: 1;
        border-color: rgba(229, 231, 235, var(--tw-border-opacity));
      }
    `)

    expect(result.css).toIncludeCss(css`
      .divide-y > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-y-reverse: 0;
        border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
        border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
      }
    `)

    expect(result.css).toIncludeCss(css`
      .border-r {
        border-right-width: 1px;
      }
    `)
  })
})
