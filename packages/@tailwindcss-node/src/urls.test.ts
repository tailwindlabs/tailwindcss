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
