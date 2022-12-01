
        module.exports = {
          content: {
            relative: true,
            files: ['./index.html'],
          },
          theme: {
            extend: {
              colors: {
                yellow: '#ff7',
              }
            },
          },
          corePlugins: {
            preflight: false,
          },
        }
      