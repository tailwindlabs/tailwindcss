import { run, html, css } from './util/run'

test('responsive and variants atrules', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="responsive-in-utilities"></div>
          <div class="variants-in-utilities"></div>
          <div class="both-in-utilities"></div>
          <div class="responsive-at-root"></div>
          <div class="variants-at-root"></div>
          <div class="both-at-root"></div>
          <div class="responsive-in-components"></div>
          <div class="variants-in-components"></div>
          <div class="both-in-components"></div>
          <div class="md:focus:responsive-in-utilities"></div>
          <div class="md:focus:variants-in-utilities"></div>
          <div class="md:focus:both-in-utilities"></div>
          <div class="md:focus:responsive-at-root"></div>
          <div class="md:focus:variants-at-root"></div>
          <div class="md:focus:both-at-root"></div>
          <div class="md:focus:responsive-in-components"></div>
          <div class="md:focus:variants-in-components"></div>
          <div class="md:focus:both-in-components"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer utilities {
      @responsive {
        .responsive-in-utilities {
          color: blue;
        }
      }
      @variants {
        .variants-in-utilities {
          color: red;
        }
      }
      @responsive {
        @variants {
          .both-in-utilities {
            color: green;
          }
        }
      }
    }

    @responsive {
      .responsive-at-root {
        color: white;
      }
    }
    @variants {
      .variants-at-root {
        color: orange;
      }
    }
    @responsive {
      @variants {
        .both-at-root {
          color: pink;
        }
      }
    }

    @layer components {
      @responsive {
        .responsive-in-components {
          color: blue;
        }
      }
      @variants {
        .variants-in-components {
          color: red;
        }
      }
      @responsive {
        @variants {
          .both-in-components {
            color: green;
          }
        }
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .responsive-in-components {
        color: #00f;
      }
      .variants-in-components {
        color: red;
      }
      .both-in-components {
        color: green;
      }
      .responsive-in-utilities {
        color: #00f;
      }
      .variants-in-utilities {
        color: red;
      }
      .both-in-utilities {
        color: green;
      }
      .responsive-at-root {
        color: #fff;
      }
      .variants-at-root {
        color: orange;
      }
      .both-at-root {
        color: pink;
      }
      @media (min-width: 768px) {
        .md\:focus\:responsive-in-components:focus {
          color: #00f;
        }
        .md\:focus\:variants-in-components:focus {
          color: red;
        }
        .md\:focus\:both-in-components:focus {
          color: green;
        }
        .md\:focus\:responsive-in-utilities:focus {
          color: #00f;
        }
        .md\:focus\:variants-in-utilities:focus {
          color: red;
        }
        .md\:focus\:both-in-utilities:focus {
          color: green;
        }
        .md\:focus\:responsive-at-root:focus {
          color: #fff;
        }
        .md\:focus\:variants-at-root:focus {
          color: orange;
        }
        .md\:focus\:both-at-root:focus {
          color: pink;
        }
      }
    `)
  })
})
