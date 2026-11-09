import { expect, test } from 'vitest'
import { rewriteUrls } from './urls'

const css = String.raw

test('URLs can be rewritten', async () => {
  let root = '/root'

  let result = await rewriteUrls({
    root,
    base: '/root/foo/bar',
    // prettier-ignore
    css: css`
      .foo {
        /* Relative URLs: replaced */
        background: url(./image.jpg);
        background: url(../image.jpg);
        background: url('./image.jpg');
        background: url("./image.jpg");

        /* Absolute URLs: ignored */
        background: url(/image.jpg);
        background: url(/foo/image.jpg);
        background: url('/image.jpg');
        background: url("/image.jpg");

        /* Potentially Vite-aliased URLs: ignored */
        background: url(~/image.jpg);
        background: url(~/foo/image.jpg);
        background: url('~/image.jpg');
        background: url("~/image.jpg");
        background: url(#/image.jpg);
        background: url(#/foo/image.jpg);
        background: url('#/image.jpg');
        background: url("#/image.jpg");
        background: url(@/image.jpg);
        background: url(@/foo/image.jpg);
        background: url('@/image.jpg');
        background: url("@/image.jpg");

        /* External URL: ignored */
        background: url(http://example.com/image.jpg);
        background: url('http://example.com/image.jpg');
        background: url("http://example.com/image.jpg");

        /* Data URI: ignored */
        /* background: url(data:image/png;base64,abc==); */
        background: url('data:image/png;base64,abc==');
        background: url("data:image/png;base64,abc==");

        /* Function calls: ignored */
        background: url(var(--foo));
        background: url(var(--foo, './image.jpg'));
        background: url(var(--foo, "./image.jpg"));

        /* Fragments: ignored */
        background: url(#dont-touch-this);

        /* Image Sets - Raw URL: replaced */
        background: image-set(
          image1.jpg 1x,
          image2.jpg 2x
        );
        background: image-set(
          'image1.jpg' 1x,
          'image2.jpg' 2x
        );
        background: image-set(
          "image1.jpg" 1x,
          "image2.jpg" 2x
        );

        /* Image Sets - Relative URLs: replaced */
        background: image-set(
          url('image1.jpg') 1x,
          url('image2.jpg') 2x
        );
        background: image-set(
          url("image1.jpg") 1x,
          url("image2.jpg") 2x
        );
        background: image-set(
          url('image1.avif') type('image/avif'),
          url('image2.jpg') type('image/jpeg')
        );
        background: image-set(
          url("image1.avif") type('image/avif'),
          url("image2.jpg") type('image/jpeg')
        );

        /* Image Sets - Function calls: ignored */
        background: image-set(
          linear-gradient(blue, white) 1x,
          linear-gradient(blue, green) 2x
        );

        /* Image Sets - Mixed: replaced */
        background: image-set(
          linear-gradient(blue, white) 1x,
          url("image2.jpg") 2x
        );
      }

      /* Fonts - Multiple URLs: replaced */
      @font-face {
        font-family: "Newman";
        src:
          local("Newman"),
          url("newman-COLRv1.otf") format("opentype") tech(color-COLRv1),
          url("newman-outline.otf") format("opentype"),
          url("newman-outline.woff") format("woff");
      }
    `,
  })

  expect(result).toMatchInlineSnapshot(`
    ".foo {
      background: url(./foo/bar/image.jpg);
      background: url(./foo/image.jpg);
      background: url('./foo/bar/image.jpg');
      background: url("./foo/bar/image.jpg");
      background: url(/image.jpg);
      background: url(/foo/image.jpg);
      background: url('/image.jpg');
      background: url("/image.jpg");
      background: url(~/image.jpg);
      background: url(~/foo/image.jpg);
      background: url('~/image.jpg');
      background: url("~/image.jpg");
      background: url(#/image.jpg);
      background: url(#/foo/image.jpg);
      background: url('#/image.jpg');
      background: url("#/image.jpg");
      background: url(@/image.jpg);
      background: url(@/foo/image.jpg);
      background: url('@/image.jpg');
      background: url("@/image.jpg");
      background: url(http://example.com/image.jpg);
      background: url('http://example.com/image.jpg');
      background: url("http://example.com/image.jpg");
      background: url('data:image/png;base64,abc==');
      background: url("data:image/png;base64,abc==");
      background: url(var(--foo));
      background: url(var(--foo, './image.jpg'));
      background: url(var(--foo, "./image.jpg"));
      background: url(#dont-touch-this);
      background: image-set(url(./foo/bar/image1.jpg) 1x, url(./foo/bar/image2.jpg) 2x);
      background: image-set(url('./foo/bar/image1.jpg') 1x, url('./foo/bar/image2.jpg') 2x);
      background: image-set(url("./foo/bar/image1.jpg") 1x, url("./foo/bar/image2.jpg") 2x);
      background: image-set(url('./foo/bar/image1.jpg') 1x, url('./foo/bar/image2.jpg') 2x);
      background: image-set(url("./foo/bar/image1.jpg") 1x, url("./foo/bar/image2.jpg") 2x);
      background: image-set(url('./foo/bar/image1.avif') type('image/avif'), url('./foo/bar/image2.jpg') type('image/jpeg'));
      background: image-set(url("./foo/bar/image1.avif") type('image/avif'), url("./foo/bar/image2.jpg") type('image/jpeg'));
      background: image-set(linear-gradient(blue, white) 1x, linear-gradient(blue, green) 2x);
      background: image-set(linear-gradient(blue, white) 1x, url("./foo/bar/image2.jpg") 2x);
    }
    @font-face {
      font-family: "Newman";
      src: local("Newman"), url("./foo/bar/newman-COLRv1.otf") format("opentype") tech(color-COLRv1), url("./foo/bar/newman-outline.otf") format("opentype"), url("./foo/bar/newman-outline.woff") format("woff");
    }
    "
  `)
})

test('empty URLs are left alone', async () => {
  let result = await rewriteUrls({
    root: '/root',
    base: '/root/foo/bar',
    css: '.foo { background: url( ); background: url(./image.jpg) }',
  })

  expect(result).toContain('url( )')
  expect(result).toContain('url(./foo/bar/image.jpg)')
})

test('cross-drive URLs preserve absolute path and avoid climbing across drives', async () => {
  let result = await rewriteUrls({
    root: 'C:/Users/app/entry',
    base: 'H:/tw-repro/app',
    css: '.card { background-image: url("./images/probe.svg"); }',
  })

  expect(result).toContain('url("H:/tw-repro/app/images/probe.svg")')
})

test('URLs on the same Windows drive are rebased relatively even with differing drive letter case', async () => {
  let result = await rewriteUrls({
    root: 'c:/Users/app/entry',
    base: 'C:/Users/app/entry/styles',
    css: '.card { background-image: url("./images/probe.svg"); }',
  })

  expect(result).toContain('url("./styles/images/probe.svg")')
})

test('cross-drive URLs with parent directory references preserve resolved absolute path', async () => {
  let result = await rewriteUrls({
    root: 'C:/Users/app/entry',
    base: 'H:/tw-repro/app/nested',
    css: '.card { background-image: url("../images/probe.svg"); }',
  })

  expect(result).toContain('url("H:/tw-repro/app/images/probe.svg")')
})

test('already absolute Windows drive URLs are left alone', async () => {
  let result = await rewriteUrls({
    root: 'C:/Users/app/entry',
    base: 'H:/tw-repro/app',
    css: '.card { background-image: url("H:/tw-repro/app/images/probe.svg"); }',
  })

  expect(result).toContain('url("H:/tw-repro/app/images/probe.svg")')
})

test('network share UNC paths preserve double slash prefix and resolve cross-share paths', async () => {
  let crossShareResult = await rewriteUrls({
    root: 'C:/Users/app/entry',
    base: '\\\\server\\share\\styles',
    css: '.card { background-image: url("./images/probe.svg"); }',
  })
  expect(crossShareResult).toContain('url("//server/share/styles/images/probe.svg")')

  let sameShareResult = await rewriteUrls({
    root: '\\\\server\\share\\app',
    base: '\\\\server\\share\\app\\styles',
    css: '.card { background-image: url("./images/probe.svg"); }',
  })
  expect(sameShareResult).toContain('url("./styles/images/probe.svg")')
})

test('same-share UNC paths with differing casing rebase relatively without duplicate segments', async () => {
  let result = await rewriteUrls({
    root: '//server/share/app',
    base: '//SERVER/SHARE/app/styles',
    css: '.card { background-image: url("./images/probe.svg"); }',
  })
  expect(result).toContain('url("./styles/images/probe.svg")')
})

test('CSS escape backslashes in URLs are preserved on Windows paths', async () => {
  let result = await rewriteUrls({
    root: 'C:/app',
    base: 'C:/app/styles',
    css: '.card { background-image: url("./my\\ image.svg"); }',
  })
  expect(result).toContain('url("./styles/my\\ image.svg")')
})
