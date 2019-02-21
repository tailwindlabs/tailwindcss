export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        // General
        '.cursor-auto': { cursor: 'auto' },
        '.cursor-default': { cursor: 'default' },
        '.cursor-none': { cursor: 'none' },

        // Links & status
        '.cursor-context-menu': { cursor: 'context-menu' },
        '.cursor-help': { cursor: 'help' },
        '.cursor-pointer': { cursor: 'pointer' },
        '.cursor-progress': { cursor: 'progress' },
        '.cursor-wait': { cursor: 'wait' },

        // Selection
        '.cursor-cell': { cursor: 'cell' },
        '.cursor-crosshair': { cursor: 'crosshair' },
        '.cursor-text': { cursor: 'text' },
        '.cursor-vertical-text': { cursor: 'vertical-text' },

        // Drag & drop
        '.cursor-alias': { cursor: 'alias' },
        '.cursor-copy': { cursor: 'copy' },
        '.cursor-move': { cursor: 'move' },
        '.cursor-no-drop': { cursor: 'no-drop' },
        '.cursor-not-allowed': { cursor: 'not-allowed' },

        // Resize & scrolling
        '.cursor-all-scroll': { cursor: 'all-scroll' },
        '.cursor-col-resize': { cursor: 'col-resize' },
        '.cursor-row-resize': { cursor: 'row-resize' },

        '.cursor-n-resize': { cursor: 'n-resize' },
        '.cursor-e-resize': { cursor: 'e-resize' },
        '.cursor-s-resize': { cursor: 's-resize' },
        '.cursor-w-resize': { cursor: 'w-resize' },
        '.cursor-ne-resize': { cursor: 'ne-resize' },
        '.cursor-nw-resize': { cursor: 'nw-resize' },
        '.cursor-se-resize': { cursor: 'se-resize' },
        '.cursor-sw-resize': { cursor: 'sw-resize' },

        '.cursor-ew-resize': { cursor: 'ew-resize' },
        '.cursor-ns-resize': { cursor: 'ns-resize' },
        '.cursor-nesw-resize': { cursor: 'nesw-resize' },
        '.cursor-nwse-resize': { cursor: 'nwse-resize' },

        // Zoom
        '.cursor-zoom-in': { cursor: 'zoom-in' },
        '.cursor-zoom-out': { cursor: 'zoom-out' },

        // Grab
        '.cursor-grab': { cursor: 'grab' },
        '.cursor-grabbing': { cursor: 'grabbing' },
      },
      variants
    )
  }
}
