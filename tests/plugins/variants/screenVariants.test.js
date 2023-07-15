import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('screenVariants', {
  safelist: [
    '2xl:flex',
    'xl:flex',
    'lg:flex',
    'md:flex',
    'sm:flex',

    'min-[100px]:flex',
    'max-[100px]:flex',
  ],
}).toMatchFormattedCss(
  css`
    @media not all and (min-width: 1536px) {
      .max-2xl\:flex {
        display: flex;
      }
    }
    @media not all and (min-width: 1280px) {
      .max-xl\:flex {
        display: flex;
      }
    }
    @media not all and (min-width: 1024px) {
      .max-lg\:flex {
        display: flex;
      }
    }
    @media not all and (min-width: 768px) {
      .max-md\:flex {
        display: flex;
      }
    }
    @media not all and (min-width: 640px) {
      .max-sm\:flex {
        display: flex;
      }
    }
    @media (max-width: 100px) {
      .max-\[100px\]\:flex {
        display: flex;
      }
    }
    @media (min-width: 100px) {
      .min-\[100px\]\:flex {
        display: flex;
      }
    }
    @media (min-width: 640px) {
      .sm\:flex {
        display: flex;
      }
    }
    @media (min-width: 768px) {
      .md\:flex {
        display: flex;
      }
    }
    @media (min-width: 1024px) {
      .lg\:flex {
        display: flex;
      }
    }
    @media (min-width: 1280px) {
      .xl\:flex {
        display: flex;
      }
    }
    @media (min-width: 1536px) {
      .\32 xl\:flex {
        display: flex;
      }
    }
  `
)
