<template>
    <div class="rounded overflow-hidden border-2 border-grey-light mb-8 bg-white">
      <div class="border-b-2 border-grey-light p-4" :class="className" v-html="preview"></div>
      <div class="p-4 bg-grey-lightest">
          <div class="inline-block relative">
                <textarea ref="editor"></textarea>
          </div>
      </div>
    </div>
</template>

<script>
const CodeMirror = require('codemirror')
require('codemirror/lib/codemirror.css')
require('codemirror/mode/meta')

export default {
    data () {
        return {
            content: ''
        }
    },
    props: {
        className: String,
        code: String,
        value: String,
        events: Array,
        unseenLines: Array,
        marker: Function,
        options: {
            type: Object,
            required: true,
        }
    },
    created () {
        if (this.options.lineNumbers === undefined) {
            this.options.lineNumbers = true
        }
        if (this.options.lineWrapping === undefined) {
            this.options.lineWrapping = true
        }
        if (this.options.mode === undefined) {
            this.options.mode = 'text/html'
        }

        let theme = this.options.theme
        let language = this.options.mode

        if (typeof language === 'string') {
            var lang = CodeMirror.findModeByMIME(language)
            language = !lang ? lang : lang.mode
        }

        if (language && language !== 'null') {
            require('codemirror/mode/' + language + '/' + language + '.js')
        }
    },
    mounted () {
        this.editor = CodeMirror.fromTextArea(this.$refs.editor, this.options)
        this.editor.setValue(this.code || this.value || this.content)
        this.editor.on('change', (instance) => {
            this.content = instance.getValue()
        })
        this.$emit('ready', this.editor)

        window.setTimeout(() => {
            this.editor.refresh()
        }, 0)
    },
    beforeDestroy () {
        let element = this.editor.doc.cm.getWrapperElement()
        if (element && element.remove) {
            element.remove()
        }
    },
    watch: {
        options: {
            deep: true,
            handler (options, oldOptions) {
                let key
                for (key in options) {
                    this.editor.setOption(key, options[key])
                }
            }
        },
        code (newVal, oldVal) {
            const editorValue = this.editor.getValue()
            if (newVal !== editorValue) {
                let scrollInfo = this.editor.getScrollInfo()
                this.editor.setValue(newVal)
                this.content = newVal
                this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
            }
        },
        value (newVal, oldVal) {
            const editorValue = this.editor.getValue()
            if (newVal !== editorValue) {
                let scrollInfo = this.editor.getScrollInfo()
                this.editor.setValue(newVal)
                this.content = newVal
                this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
            }
        }
    },
    methods: {
        refresh () {
            this.editor.refresh()
        }
    },
    computed: {
        preview () {
            return this.content || this.code
        }
    }
}
</script>
